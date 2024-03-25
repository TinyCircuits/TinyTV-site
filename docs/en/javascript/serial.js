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
        this.decoder = new TextDecoder();

        this.manuallyConnecting = false;
        this.connected = false;

        this.allowAutoConnect = allowAutoConnect;

        // String buffer used for waiting for specific string
        this.waiting = false;
        this.startWaitForStr = "";
        this.endWaitForStr = "";
        this.subStr = undefined;
        this.received = "";

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


    // Sets baud to 1200 and disconnects to boot Arduino boards into bootloader mode
    async autoReset(callback = () => {}){
        this.onConnect = () => {
            this.onDisconnect = () => {
                callback();
            }
            this.disconnect();
        }

        this.enableAutoConnect();
        await this.connect(1200);
        this.disableAutoConnect();
    }


    async write(data, encode=true){
        if(this.writer && this.connected){
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
                        console.log(this.decoder.decode(value));
                        // If we're waiting on a specific string, add this chunk
                        // to all teh received so it can be searched through
                        if(this.waiting){
                            this.received += this.decoder.decode(value);
                            this.#checkWaitFor();
                        }
                        this.onData(value);
                    }
                }
            }catch(error){
                // Likely unplugged
            }
        }
    }


    #checkWaitFor(){
        let startIndex = this.received.indexOf(this.startWaitForStr);
        let endIndex = this.received.indexOf(this.endWaitForStr);
        if(startIndex != -1 && endIndex != -1){

            // Found the start and end enclosing strings, now see if the sub string is between them if not undefined
            if(this.subStr != undefined){
                let subIndex = this.received.indexOf(this.subStr, startIndex);

                // Already know we're ahead of start since we started there, make sure less then end
                if(subIndex < endIndex){
                    // Substring within start and end, stop waiting, we found all the strings
                    this.waiting = false;
                }
            }else{
                // No sub string and we found the start and end, stop waiting
                this.waiting = false;
            }
        }
    }


    // Async function that returns with substring (included what was waited for)
    // or rejects if times out since string may have never been found
    async waitFor(startWaitForStr, endWaitForStr, subStr=undefined){
        this.waiting = true;
        this.startWaitForStr = startWaitForStr;
        this.endWaitForStr = endWaitForStr;
        this.subStr = subStr;
        this.received = "";

        let startTimeMS = performance.now();

        // Wait for this.waiting to go false due to #checkWaitFor() being called when data is received
        return new Promise((resolve, reject) => {
            let check = () => {
                if(this.waiting){
                    // Still waiting, check timeout and reject if went over else try checking flag again in a little
                    if(performance.now() - startTimeMS < 3000){
                        // Call self after certain amount of time
                        setTimeout(() => {
                            check();
                        }, 100);
                    }else{
                        console.error("Timed out waiting for serial strings '" + startWaitForStr + "', " + subStr + ", and '" + endWaitForStr + "', here's what was received: ", this.received);
                        reject(undefined);
                    }
                }else{
                    // Not waiting anymore, must have found the start and end strings
                    // Find them again and extract then return the substring
                    let startIndex = this.received.indexOf(this.startWaitForStr);
                    let endIndex = this.received.indexOf(this.endWaitForStr);

                    // Return the string
                    resolve(this.received.slice(startIndex, endIndex+1));
                }
            }
            check();
        })
    }


    async disconnect(fireCallback=true){
        if(this.connected){
            this.connected = false;

            this.reader.releaseLock();
            this.writer.releaseLock();

            try{
                await this.port.close();
            }catch(error){
                console.log("Port may be already closed:", error)
            }

            this.reader = undefined;
            this.writer = undefined;
            this.port = undefined;

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
            this.onConnectionCanceled();
        }
    }


    async attemptAutoConnect(baudRate=2000000, bufferSize=2048){
        if(this.allowAutoConnect && this.manuallyConnecting == false){
            console.log("Attempting auto connect...");
            // Get ports this page knows about
            let ports = await navigator.serial.getPorts();

            // For each port, check if it matches any of the passed VID and PID pairs then finish connecting or return false
            for(let portidx=0; portidx<ports.length; portidx++){
                for(let pairidx=0; pairidx<this.vendorProductIDs.length; pairidx++){
                    let portInfo = ports[portidx].getInfo();
                    if(portInfo.usbVendorId == this.vendorProductIDs[pairidx].usbVendorId && portInfo.usbProductId == this.vendorProductIDs[pairidx].usbProductId){
                        await this.#connect(ports[portidx], baudRate, bufferSize);
                        return true;
                    }
                }
            }
        }
        return false;
    }


    async connect(baudRate=2000000, bufferSize=2048){
        // If auto connect fails, continue to manual selection
        if(!this.manuallyConnecting && await this.attemptAutoConnect(baudRate, bufferSize) == false){
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