class Serial{
    constructor(vendorProductIDs, allowAutoConnect=true){
        this.vendorProductIDs = vendorProductIDs;

        this.serial = undefined;

        navigator.serial.addEventListener('connect', (event) => {
            if(this.allowAutoConnect){
                console.log("Detected serial device");
                this.connect();
            }
        });

        
        navigator.serial.addEventListener('disconnect', (event) => {
            this.disconnect();
        });

        // Encode to bytes when writing
        this.encoder = new TextEncoder(); 

        this.manuallyConnecting = false;
        this.connected = false;

        this.allowAutoConnect = allowAutoConnect;

        // Functions called internally but defined externally
        this.onConnect = () => {};
        this.onDisconnect = () => {};
        this.onData = (data) => {};
        this.onConnectionCanceled = () => {};
    }


    enableAutoConnect(){
        this.allowAutoConnect = true;
    }


    disableAutoConnect(){
        this.allowAutoConnect = false;
    }


    async write(data, encode=true){
        if(this.writer){
            if(encode){
                await this.writer.write(this.encoder.encode(data));
            }else{
                await this.writer.write(data);
            }
        }
    }


    async #readLoop(){
        // Loop to keep the reading loop going every time it ends due to done status
        while(this.connected && this.port.readable){

            // Get the reader if it is not locked
            if(!this.port.readable.locked){
                this.reader = this.port.readable.getReader();
            }

            try{
                while(true){
                    const { value, done } = await this.reader.read();

                    // If done, allow reader to be closed and break loop
                    if(done){
                        this.reader.releaseLock();
                        break;
                    }

                    // If data defined, stream it to onData
                    if(value){
                        this.onData(value);
                    }
                }
            }catch(error){
                // Likely unplugged
            }
        }
    }


    async disconnect(fireCallback=true){
        if(this.connected){
            this.reader.releaseLock();
            this.writer.releaseLock();
            this.port.close();

            this.reader = undefined;
            this.writer = undefined;
            this.port = undefined;

            this.connected = false;
            if(fireCallback) this.onDisconnect();

            console.log("Serial disconnected!");
        }
    }


    async #connect(port, baudRate=2000000, bufferSize=2048){
        console.log("Opening port...");

        try{
            await port.open({ baudRate: baudRate, bufferSize: bufferSize });
            this.port = port;

            this.connected = true;

            this.reader = undefined;
            this.writer = await this.port.writable.getWriter();

            this.#readLoop();

            console.log("Serial connected!");

            // Call the connected callback for external modules
            await this.onConnect();
        }catch(error){
            if(error.name == "InvalidStateError"){
                console.error("Port already open...");
                console.log("Port already open...");
            }else if(error.name == "NetworkError"){
                console.error("Failed to open port, is something using it?");
                console.log("Failed to open port, is something using it?");
            }else{
                console.error(error);
            }
        }
    }


    async attemptAutoConnect(){
        if(this.allowAutoConnect && this.manuallyConnecting == false){
            console.log("Attempting auto connect...");
            // Get ports this page knows about
            let ports = await navigator.serial.getPorts();

            // For each port, check if it matches any of the passed VID and PID pairs then finish connecting or return false
            for(let portidx=0; portidx<ports.length; portidx++){
                for(let pairidx=0; pairidx<this.vendorProductIDs.length; pairidx++){
                    let portInfo = ports[portidx].getInfo();
                    if(portInfo.usbVendorId == this.vendorProductIDs[pairidx].usbVendorId && portInfo.usbProductId == this.vendorProductIDs[pairidx].usbProductId){
                        await this.#connect(ports[portidx]);
                        return true;
                    }
                }
            }
        }
        return false;
    }


    async connect(baudRate=2000000, bufferSize=2048){
        // If auto connect fails, continue to manual selection
        if(!this.manuallyConnecting && await this.attemptAutoConnect() == false){
            this.manuallyConnecting = true;
            try{
                console.log("Waiting on device selection...");
                let port = await navigator.serial.requestPort({filters: this.vendorProductIDs});
                await this.#connect(port, baudRate, bufferSize);
            }catch(error){
                // User did not select anything and closed browser dialog
                console.log("No device selected for connection...");
                this.onConnectionCanceled();
            }
            this.manuallyConnecting = false;
        }
    }
}

export { Serial }