import { TV_TYPES } from "../common.js";

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
        this.convertWorker = new Worker("/javascript/streaming/jpegstreamerWorker.js", {
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
                }else if(message.data.messageData == TV_TYPES.TINYTV_DIY){
                    this.#onTVDetect("TinyTV Diy");
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

        // When a frame hasn't been sent from the stream
        // in a while, need to resend to keep TV in live mode
        this.keepAliveTimeAtLastFrameMS = 0;
        this.keepAliveLastFrame = undefined;
        this.keepAlive();
    }


    #onSerialConnect(){
        this.onSerialConnect();
    }


    #onSerialDisconnect(){
        this.onSerialDisconnect();
        this.#teardownStream();

        // Set to undefined so that it is not sent on next connection
        if (this.keepAliveLastFrame != undefined){
            this.keepAliveLastFrame.close();
            this.keepAliveLastFrame = undefined;
        }
    }


    // If a frame hasn't been sent in a while, resend the last one to keep the TV
    // in live mode. Needs to be sent from here so that scaled correctly in worker
    keepAlive(){
        setTimeout(() => {
            if(performance.now() - this.keepAliveTimeAtLastFrameMS >= 250 && this.keepAliveLastFrame != undefined){
                try{
                    // Clone the keep alive frame since it will be closed after the worker uses it
                    let tempFrameClone = this.keepAliveLastFrame.clone();
                    console.log('Sending keepalive frame!');
                    this.convertWorker.postMessage({messageType: "frame", frame: this.keepAliveLastFrame}, [this.keepAliveLastFrame]);
                    this.keepAliveTimeAtLastFrameMS = performance.now();

                    // Reassign for use next time (or gets closed if the stream picks back up)
                    this.keepAliveLastFrame = tempFrameClone;
                }catch(error){
                    // Tried to send from here but was closed by main streamer, whatever
                    console.error(error);
                }
            }
            this.keepAlive();
        }, 100);
    }


    async #processCapturedFrames(videoFrame, controller){
        console.log("Getting frame ready to send!");

        if(this.lastFrameSent){
            // Keep a clone frame just in case so that it can be resent to keep TV in live mode
            this.keepAliveTimeAtLastFrameMS = performance.now();
            if(this.keepAliveLastFrame != undefined) this.keepAliveLastFrame.close();
            this.keepAliveLastFrame = videoFrame.clone();

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
                console.log("Setting up stream!");

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
                console.error(reason);
                reject(reason);
            });
        });
    }


    #teardownStream(){
        console.log("Tearing down stream!");

        if(this.streamVideoTrack != undefined){
            this.streamVideoTrack.stop();
            this.streamVideoTrack = null;
        }

        if(this.streamCapture != undefined){
            this.streamCapture.removeEventListener("inactive", this.#handleStreamStop.bind(this));
        }

        this.lastFrameSent = true;

        window.location.reload(true);
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
                await navigator.serial.requestPort({filters: [{usbVendorId:11914, usbProductId:10}, {usbVendorId:0x03EB, usbProductId: 0x8008}, {usbVendorId:0x03EB, usbProductId: 0x8009}]});
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