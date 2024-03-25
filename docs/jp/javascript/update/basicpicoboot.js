class BasicPicoboot{
    constructor(){
        this.device = undefined;

        this.connected = false;
        this.showErrorMsg = false;

        // Callbacks for external implementation
        this.onUpdateStart = () => {};
        this.onUpdateProgress = (percentage) => {};
        this.onUpdateComplete = () => {};
        this.onConnectionCanceled = () => {};
        this.onOpenFail = () => {};
        this.onError = () => {};
    }


    async wait(timeMS){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeMS)
        });
    }


    async copyUpdate(firmwareURL){
        // Get the directory

        let dirHandle = undefined;
        try{
            dirHandle = await showDirectoryPicker({id: 0, mode: "readwrite", startIn: "downloads"});
        }catch(error){
            this.onError("Error during getting directory... " + error.toString());
        }
        
        if(dirHandle != undefined && dirHandle.name == "\\"){
            this.onUpdateStart();
            const response = await fetch(firmwareURL, {cache: 'no-store', pragma: 'no-cache'});
            if(response.ok == false){
                this.onError("404: firmware file not found... " + firmwareURL);
                return;
            }
            const uf2Data = await (response).arrayBuffer();

            const fileHandle = await dirHandle.getFileHandle("firmware.uf2", {create: true});
            const writable = await fileHandle.createWritable();
            this.onUpdateProgress(35);
            await writable.write(uf2Data);
            this.onUpdateProgress(75);
            await writable.close();
            this.onUpdateComplete();
        }else{
            this.onError("It looks like the wrong directory was selected (or none at all)...");
        }
    }


    async connectUpdate(firmwareURL){
        try{
            this.showErrorMsg = false;

            // Do web side of getting the device
            this.device = await navigator.usb.requestDevice({ filters: [{vendorId: 0x2E8A, productId: 0x0003}]});

            await this.device.open();

            if(this.device.configuration === null){
                await device.selectConfiguration(1);
            }

            await this.device.claimInterface(1);
            this.connected = true;
            await this.wait(1);

            // Get USB exclusive control according to the datasheet PICOBOOT interface commands
            await this.#exclusive();
            await this.wait(1);

            // Wireshark does this after every erase and write but it seems to work by just doing it once
            await this.#exitxip();
            await this.wait(1);

            await this.update(firmwareURL);
        }catch(error){
            console.log(error);

            if(error.toString().indexOf("An operation that changes interface state is in progress") != -1){
                this.onOpenFail();

                this.copyUpdate(firmwareURL);
            }else{
                // User did not select anything and closed browser dialog
                this.onConnectionCanceled();
            }
        }
    }


    disconnect(showErrorMSG=true){
        if(this.connected){
            this.showErrorMsg = showErrorMSG;
            this.device.close();
        }
    }


    async update(firmwarePath){
        if(!this.connected){
            return;
        }

        const flashSectorSize = 4096;

        const response = await fetch(firmwarePath, {cache: 'no-store', pragma: 'no-cache'});
        if(response.ok == false){
            this.onError("404: firmware file not found... " + firmwarePath);
            return;
        }
        const uf2Data = await (response).arrayBuffer();
        const uf2BlockSize = 512;
        const uf2BlockCount = uf2Data.byteLength/uf2BlockSize;
        const uf2BlockPayloadSize = 256;
        let uf2Payload = new Uint8Array(flashSectorSize);
        const uf2FlashStartAddress = new DataView(uf2Data.slice(0, uf2BlockSize)).getUint32(12, true);

        this.onUpdateStart();

        for(let ibx=0, ipx=0, flashAddressOffset=0; ibx<uf2BlockCount; ibx++, ipx++){
            const uf2Offset = ibx*uf2BlockSize;
            const uf2BlockData = uf2Data.slice(uf2Offset, uf2Offset+uf2BlockSize);
            const uf2BlockPayload = new Uint8Array(uf2BlockData.slice(32, 32+uf2BlockPayloadSize));

            uf2Payload.set(uf2BlockPayload, ipx*uf2BlockPayloadSize);

            if(ipx+1 == (flashSectorSize/uf2BlockPayloadSize) || ibx+1 == uf2BlockCount){
                await this.#flasherase(uf2FlashStartAddress+flashAddressOffset, flashSectorSize);
                await this.wait(10);

                await this.#flashwrite(uf2FlashStartAddress+flashAddressOffset, flashSectorSize, uf2Payload);
                await this.wait(10);

                uf2Payload = new Uint8Array(flashSectorSize);
                ipx = -1;
                flashAddressOffset += flashSectorSize;

                // Call external callback
                this.onUpdateProgress(((ibx/uf2BlockCount)*100).toFixed(0));
            }
        }

        console.warn("Done flashing firmware!");
        await this.#reboot();

        // Call external callback
        this.onUpdateComplete();
    }


    async #exclusive(){
        if(!this.connected){
            return;
        }

        return new Promise(async (resolve, reject) => {
            let packet = new ArrayBuffer(32);
            let dataView = new DataView(packet);
            dataView.setUint32(0x00, 0x431fd10b, true);   // Magic
            dataView.setUint32(0x04, 0x00000000, true);   // User token

            dataView.setUint8(0x08, 0x01, true);          // Command ID
            dataView.setUint8(0x09, 0x01, true);          // Command size
            dataView.setUint32(0x0c, 0x00000000, true);   // Transfer length

            dataView.setUint8(0x10, 0x02);                // Exclusive, no MSC

            await this.device.transferOut(3, new Uint8Array(packet));
            await this.wait(10);

            let data = await this.device.transferIn(4, 64);
            if(data.status != "ok"){
                console.error("Could not claim exclusive...");
                reject();
            }else{
                console.log("Wrote exclusive!");
                resolve();
            }
        })
    }


    async #reboot(){
        if(!this.connected){
            return;
        }

        return new Promise(async (resolve, reject) => {
            let packet = new ArrayBuffer(32);
            let dataView = new DataView(packet);
            dataView.setUint32(0x00, 0x431fd10b, true);   // Magic
            dataView.setUint32(0x04, 0x00000001, true);   // User token

            dataView.setUint8(0x08 , 0x02, true);         // Command ID
            dataView.setUint8(0x09 , 0x0c, true);         // Command size
            dataView.setUint32(0x0c , 0x00000000, true);  // Transfer length

            dataView.setUint32(0x10 , 0x00000000, true);  // dPC
            dataView.setUint32(0x14 , 0x00000000, true);  // dSP
            dataView.setUint32(0x18 , 0x00005631, true);  // ms Delay (needs to be something other than 0! Copied from Wireshark picotool output)

            await this.device.transferOut(3, new Uint8Array(packet));
            await this.wait(10);

            let data = await this.device.transferIn(4, 64);
            if(data.status != "ok"){
                console.error("Could not reboot...");
                reject();
            }else{
                this.connected = false;
                console.log("Wrote reboot!");
                resolve();
            }
        })
    }


    async #exitxip(){
        if(!this.connected){
            return;
        }

        return new Promise(async (resolve, reject) => {
            let packet = new ArrayBuffer(32);
            let dataView = new DataView(packet);
            dataView.setUint32(0x00, 0x431fd10b, true);   // Magic
            dataView.setUint32(0x04, 0x00000002, true);   // User token

            dataView.setUint8(0x08 , 0x06, true);         // Command ID
            dataView.setUint8(0x09 , 0x00, true);         // Command size
            dataView.setUint32(0x0c , 0x00000000, true);  // Transfer length

            await this.device.transferOut(3, new Uint8Array(packet));
            await this.wait(10);

            let data = await this.device.transferIn(4, 64);
            if(data.status != "ok"){
                console.error("Could not exit xip...");
                reject();
            }else{
                console.log("Wrote exit xip!");
                resolve();
            }
        })
    }


    async #flasherase(address, size){
        if(!this.connected){
            return;
        }

        return new Promise(async (resolve, reject) => {
            let packet = new ArrayBuffer(32);
            let dataView = new DataView(packet);
            dataView.setUint32(0x00, 0x431fd10b, true);   // Magic
            dataView.setUint32(0x04, 0x00000003, true);   // User token

            dataView.setUint8(0x08 , 0x03, true);         // Command ID
            dataView.setUint8(0x09 , 0x08, true);         // Command size
            dataView.setUint32(0x0c , 0x00000000, true);  // Transfer length

            dataView.setUint32(0x10 , address, true);     // Address
            dataView.setUint32(0x14 , size, true);        // Size

            try{
                await this.device.transferOut(3, new Uint8Array(packet));
                await this.wait(10);
                let data = await this.device.transferIn(4, 64);

                if(data.status != "ok"){
                    console.error("Could not erase flash...");
                    reject();
                }else{
                    console.log("Erased", size, "bytes at", address,);
                    resolve();
                }
            }catch(error){
                console.warn("Error, maybe disconnected?");
                if(!this.showErrorMsg) this.onError("Error during flash erase...");
            }
        });
    }


    async #flashwrite(address, size, payload){
        if(!this.connected){
            return;
        }

        return new Promise(async (resolve, reject) => {
            let packet = new ArrayBuffer(32);
            let dataView = new DataView(packet);
            dataView.setUint32(0x00, 0x431fd10b, true);   // Magic
            dataView.setUint32(0x04, 0x00000003, true);   // User token

            dataView.setUint8(0x08, 0x05, true);          // Command ID
            dataView.setUint8(0x09, 0x08, true);          // Command size
            dataView.setUint32(0x0c, size, true);         // Transfer length

            dataView.setUint32(0x10, address, true);      // Address
            dataView.setUint32(0x14, size, true);         // Size

            try{
                await this.device.transferOut(3, new Uint8Array(packet));
                await this.wait(10);

                await this.device.transferOut(3, new Uint8Array(payload));
                await this.wait(10);

                let data = await this.device.transferIn(4, 64);

                if(data.status != "ok"){
                    console.error("Could not write to flash...");
                    reject();
                }else{
                    console.log("Wrote", size, "bytes to flash starting at", address);
                    resolve();
                }
            }catch(error){
                console.warn("Error, maybe disconnected?");
                if(!this.showErrorMsg) this.onError("Error during flash writing...");
            }
        });
    }
}


export { BasicPicoboot };