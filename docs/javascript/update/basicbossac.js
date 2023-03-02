class BasicBossac{
    constructor(serial){
        this.serial = serial;

        this.connected = false;
        this.wasDisconnectCalled = false;
        this.collectedData = "";

        this.programFlashStart = 0x2000;
        this.uploadPacketSize = 4096;
        this.sramBufferAddress = 0x20005000;   // Taken from Arduino IDE output with verbose option enabled

        this.decoder = new TextDecoder();

        // Callbacks for external implementation
        this.onUpdateStart = () => {};
        this.onUpdateProgress = (percentage) => {};
        this.onUpdateComplete = () => {};
        this.onConnectionCanceled = () => {};
        this.onError = () => {};
    }

    disconnect(){
        if(this.connected){
            this.connected = false;
            this.wasDisconnectCalled = true;
            this.serial.disconnect();
        }
    }

    async checkCollectedDataFor(text){
        let timeoutTryCount = 0;
        return new Promise((resolve, reject) => {
            let check = () => {
                if(timeoutTryCount < 200){
                    setTimeout(() => {
                        if(this.collectedData.indexOf(text) == -1){
                            check();
                            timeoutTryCount++;
                        }else{
                            this.collectedData = "";
                            resolve(true);
                        }
                    }, 10);
                }else{
                    if(!this.wasDisconnectCalled) reject();
                }
            }
            check();
        });
    }


    async wait(ms){
        return new Promise((resolve, reject) => {
            let count = 0;
            let wait1ms = () => {
                setTimeout(() => {
                    if(count < ms){
                        count++;
                        wait1ms();
                    }else{
                        resolve();
                    }
                }, 1);
            }
            wait1ms();
        });
    }


    async connectUpdate(firmwarepath){
        return new Promise((resolve, reject) => {
            this.collectedData = "";

            this.serial.onConnectionCanceled = this.onConnectionCanceled.bind(this);
            this.serial.onDisconnect = () => {
                this.connected = false;
                this.onError();
            }
            this.serial.onConnect = () => {
                this.connected = true;
                this.wasDisconnectCalled = false;
    
                this.serial.onData = (data) => {
                    this.collectedData += this.decoder.decode(data);
                    console.log(decoder.decode(data));
                }
    
                this.update(firmwarepath);
            }
    
            this.serial.connect(115200, 128);
        });
    }


    async #erase(){
        if(!this.connected){
            return;
        }

        // Erase flash after bootloader
        await this.serial.write("X" + this.programFlashStart.toString(16) + "#", true);
        await this.wait(1);
        await this.checkCollectedDataFor("X\n\r");
    }


    async #reboot(){
        // CPU reset https://github.com/shumatech/BOSSA/blob/3532de82efd28fadbabc2b258d84dddf14298107/src/Device.cpp#L652
        await this.serial.write("WE000ED0C,05FA0004#", true);
    }


    async #write(packet, ipx){
        // https://github.com/shumatech/BOSSA/blob/master/src/Samba.cpp#L511
        const cmd0 = "S" + this.sramBufferAddress.toString(16) + "," + packet.byteLength.toString(16).padStart(4, '0') + "#";
        await this.serial.write(cmd0, true);
        await this.wait(1);

        // https://github.com/shumatech/BOSSA/blob/master/src/Samba.cpp#L528
        await this.serial.write(packet, false);
        await this.wait(1);

        // https://github.com/shumatech/BOSSA/blob/master/src/Samba.cpp#L619
        const cmd1 = "Y" + this.sramBufferAddress.toString(16) + ",0#";
        await this.serial.write(cmd1, true);
        await this.wait(1);
        await this.checkCollectedDataFor("Y\n\r");

        // https://github.com/shumatech/BOSSA/blob/master/src/Samba.cpp#L629
        const cmd2 = "Y" + (this.programFlashStart + (ipx*this.uploadPacketSize)).toString(16) + "," + packet.byteLength.toString(16).padStart(4, '0') + "#";
        await this.serial.write(cmd2, true);
        await this.wait(1);
        await this.checkCollectedDataFor("Y\n\r");
    }


    async update(firmwarePath){
        try{
            this.collectedData = "";

            const binData = new Uint8Array(await (await fetch(firmwarePath, {cache: 'no-store', pragma: 'no-cache'})).arrayBuffer());
            const packetCount = Math.ceil(binData.byteLength/this.uploadPacketSize); // Round up since .slice() will figure out the end

            this.onUpdateStart();

            await this.#erase().catch((errorMsg) => {
                throw errorMsg;
            })

            for(let ipx=0; ipx<packetCount; ipx++){
                if(this.connected){
                    let packet = binData.slice((ipx*this.uploadPacketSize), (ipx*this.uploadPacketSize)+this.uploadPacketSize);
                    await this.#write(packet, ipx);

                    this.onUpdateProgress(((ipx/packetCount)*100).toFixed(0));
                }else{
                    return;
                }
            }

            await this.#reboot();
            this.onUpdateComplete();
        }catch(error){
            this.onError();
        }
    }
}

export { BasicBossac };