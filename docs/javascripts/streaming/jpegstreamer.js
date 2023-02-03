import { TV_SIZES, TV_TYPES, TV_JPEG_QUALITIES, TV_FIT_TYPES } from "./jpegstreamerCommon.js";

class JPEGStreamer{
    constructor(outputCanvas){
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/frameRate
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
        const DISPLAY_MEDIA_OPTIONS = {
            video: {
                cursor: "always",
                frameRate: 60
            },
            audio: false
        };

        this.lastFrameSent = true;

        // Frame capture
        // (https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrackProcessor#examples)
        this.streamCapture = undefined;
        this.streamVideoTrack = undefined;
        this.streamProcessor = undefined;
        this.streamGenerator = undefined;
        this.streamTransformer = undefined;
        
        // Web worker
        this.convertWorker = new Worker("/src/js/lib/jpegstreamer/jpegstreamerWorker.js", {
            type: 'module'
        });
        this.convertWorker.onmessage = async (message) => {
            if(message.data.messageType == "lastframesent"){
                this.lastFrameSent = true;
            }else if(message.data.messageType == "connected"){
                this.#onSerialConnect();
            }else if(message.data.messageType == "disconnected"){
                this.#onSerialDisconnect();
            }else if(message.data.messageType == "tvtype"){
                if(message.data.messageData == TV_TYPES.TINYTV_2){
                    this.#onTVDetect("TinyTV 2");
                }else if(message.data.messageData == TV_TYPES.TINYTV_MINI){
                    this.#onTVDetect("TinyTV Mini");
                }
            }
        };

        // Transfer control of the output canvas to the web worker
        const offscreenOutputCanvas = outputCanvas.transferControlToOffscreen();
        this.convertWorker.postMessage({messageType: 'canvas', canvas: offscreenOutputCanvas}, [offscreenOutputCanvas]);

        // External callbacks triggered internally
        this.onSerialConnect = () => {};
        this.onSerialDisconnect = () => {};
        this.onTVDetected = (tvString) => {};
        this.onStreamReady = () => {};
    }


    #onSerialConnect(){
        this.onSerialConnect();
    }


    #onSerialDisconnect(){
        this.onSerialDisconnect();
        this.#teardownStream();
    }


    async #processCapturedFrames(videoFrame, controller){
        if(this.lastFrameSent){
            this.lastFrameSent = false;
            this.convertWorker.postMessage({messageType: "frame", frame: videoFrame}, [videoFrame]);
        }else{
            // Not sent, just skipped, close it
            videoFrame.close();
        }
    }


    async #handleStreamStop(){
        // This will start the process of stopping streaming and resetting the UI
        this.disconnectSerial();
    }


    async #setupStream(){
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getDisplayMedia(this.DISPLAY_MEDIA_OPTIONS)
            .then((stream) => {
                this.streamCapture = stream;

                // Handle the case of a user stopping a stream some other way other than the STOP button
                this.streamCapture.addEventListener("inactive", this.#handleStreamStop.bind(this));

                this.streamVideoTrack = this.streamCapture.getVideoTracks()[0];
    
                this.streamProcessor = new MediaStreamTrackProcessor({ track: this.streamVideoTrack });
                this.streamGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
                this.streamTransformer = new TransformStream({
                    transform: this.#processCapturedFrames.bind(this),
                    writableStrategy: {highWaterMark: 1},
                    readableStrategy: {highWaterMark: 1}
                });
    
                this.streamProcessor.readable.pipeThrough(this.streamTransformer).pipeTo(this.streamGenerator.writable);

                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
        });
    }


    #teardownStream(){
        if(this.streamVideoTrack != undefined) this.streamVideoTrack.stop();
        this.lastFrameSent = true;
    }


    #onTVDetect(tvString){
        this.onTVDetected(tvString);

        // Call the stream setup after a small delay to give the user time to process
        setTimeout(() => {
            this.#setupStream().then((result) => {
                this.onStreamReady();
            }).catch((reason) => {
                this.disconnectSerial();
            });
        }, 250);
    }


    setScreenFit(fitType){
        this.convertWorker.postMessage({messageType:'fit', messageData:[fitType]});
    }


    async connectSerial(){
        // Make sure the main thread had the user pair a TinyTV
        // serial port and it is plugged in for the worker
        let portFound = false;

        (await navigator.serial.getPorts()).forEach((port, index, ports) => {
            const info = port.getInfo();
            if(info.usbVendorId == 11914 && info.usbProductId == 10){
                portFound = true;
                return;
            }
        });
        
        // No device, make the user pair one for the worker to auto connect to
        if(!portFound){
            try{
                await navigator.serial.requestPort({filters: [{usbVendorId:11914, usbProductId:10}]});
                portFound = true;
            }catch(err){
                portFound = false;
                console.warn(err);
            }
        }

        // If the page already had a paired device or the user added one, make the worker connect to it
        if(portFound){
            this.convertWorker.postMessage({messageType:'connect', messageData:[]});
        }
    }


    disconnectSerial(){
        this.convertWorker.postMessage({messageType:'disconnect', messageData:[]});
    }
}

export { JPEGStreamer }