import { Serial } from "../serial.js";
import { TV_SIZES, TV_TYPES, TV_JPEG_QUALITIES, TV_FIT_TYPES } from "./jpegstreamerCommon.js";

self.detectedTVType = TV_TYPES.NONE;
self.currentJPEGQuality = 0;

self.currentFitType = TV_FIT_TYPES.CONTAIN;
self.fitFrameX = 0;
self.fitFrameY = 0;
self.fitFrameW = TV_SIZES.TINYTV_2_W;  // Just choose TinyTV 2 as a default
self.fitFrameH = TV_SIZES.TINYTV_2_H;

self.fitWidth = (screenW, screenH, videoW, videoH) => {
    self.fitFrameW = screenW;
    self.fitFrameH = videoH * (screenW / videoW);
    self.fitFrameX = 0;
    self.fitFrameY = (screenH/2) - (self.fitFrameH/2);
}

self.fitHeight = (screenW, screenH, videoW, videoH) => {
    self.fitFrameW = videoW * (screenH / videoH);
    self.fitFrameH = screenH;
    self.fitFrameX = (screenW/2) - (self.fitFrameW/2);
    self.fitFrameY = 0;
}


self.fitContain = (screenW, screenH, videoW, videoH) => {
    if(videoW > videoH){
        self.fitWidth(screenW, screenH, videoW, videoH);
    }else{
        self.fitHeight(screenW, screenH, videoW, videoH);
    }
}

self.fitCover = (screenW, screenH, videoW, videoH) => {
    if(videoW < videoH){
        self.fitWidth(screenW, screenH, videoW, videoH);
    }else{
        self.fitHeight(screenW, screenH, videoW, videoH);
    }
}

self.fitFill = (screenW, screenH) => {
    self.fitFrameW = screenW;
    self.fitFrameH = screenH;
    self.fitFrameX = 0;
    self.fitFrameY = 0;
}

self.setScreenFit = (fitType, videoW, videoH) => {
    if(fitType == undefined && self.currentFitType == undefined){           // Set a default if neither defined
        fitType = TV_FIT_TYPES.CONTAIN;
        self.currentFitType = fitType;
    }else if(fitType != undefined && self.currentFitType != undefined){     // Override with passed if both defined
        self.currentFitType = fitType;
    }else if(fitType == undefined && self.currentFitType != undefined){     // Use what's been set before
        fitType = self.currentFitType;
    }

    if(self.detectedTVType == TV_TYPES.TINYTV_2){
        if(fitType == undefined || fitType == TV_FIT_TYPES.CONTAIN){
            self.fitContain(TV_SIZES.TINYTV_2_W, TV_SIZES.TINYTV_2_H, videoW, videoH);
        }else if(fitType == TV_FIT_TYPES.COVER){
            self.fitCover(TV_SIZES.TINYTV_2_W, TV_SIZES.TINYTV_2_H, videoW, videoH);
        }else if(fitType == TV_FIT_TYPES.FILL){
            self.fitFill(TV_SIZES.TINYTV_2_W, TV_SIZES.TINYTV_2_H);
        }
    }else if(self.detectedTVType == TV_TYPES.TINYTV_MINI){
        if(fitType == undefined || fitType == TV_FIT_TYPES.CONTAIN){
            self.fitContain(TV_SIZES.TINYTV_MINI_W, TV_SIZES.TINYTV_MINI_H, videoW, videoH);
        }else if(fitType == TV_FIT_TYPES.COVER){
            self.fitCover(TV_SIZES.TINYTV_MINI_W, TV_SIZES.TINYTV_MINI_H, videoW, videoH);
        }else if(fitType == TV_FIT_TYPES.FILL){
            self.fitFill(TV_SIZES.TINYTV_MINI_W, TV_SIZES.TINYTV_MINI_H);
        }
    }
}



self.offscreenCanvas = new OffscreenCanvas(216, 135);
self.offscreenCanvasCtx = self.offscreenCanvas.getContext("2d");
self.offscreenOutputCanvas = undefined;
self.offscreenOutputCanvasCtx = undefined;

self.serial = new Serial([{usbVendorId:11914, usbProductId:10}]);
self.serial.onConnect = () => {
    self.postMessage({messageType: "connected", messageData: []});

    const decoder = new TextDecoder();
    let received = "";

    self.serial.onData = (data) => {
        if(self.detectedTVType == TV_TYPES.NONE){
            received += decoder.decode(data);

            // See if it is any of the TVs, pass a human readable string to the on detect function since it will be displayed
            if(received.indexOf(TV_TYPES.TINYTV_2) != -1){
                self.detectedTVType = TV_TYPES.TINYTV_2;
                self.offscreenCanvas.width = TV_SIZES.TINYTV_2_W;
                self.offscreenCanvas.height = TV_SIZES.TINYTV_2_H;
                self.currentJPEGQuality = TV_JPEG_QUALITIES.TINYTV_2;
                self.postMessage({messageType: "tvtype", messageData: [TV_TYPES.TINYTV_2]});
            }else if(received.indexOf(TV_TYPES.TINYTV_MINI) != -1){
                self.detectedTVType = TV_TYPES.TINYTV_MINI;
                self.offscreenCanvas.width = TV_SIZES.TINYTV_MINI_W;
                self.offscreenCanvas.height = TV_SIZES.TINYTV_MINI_H;
                self.currentJPEGQuality = TV_JPEG_QUALITIES.TINYTV_MINI;
                self.postMessage({messageType: "tvtype", messageData: [TV_TYPES.TINYTV_MINI]});
            }
        }
    }

    let requestTVType = () => {
        if(self.detectedTVType == TV_TYPES.NONE && self.serial.connected){
            setTimeout(() => {
                self.serial.write("TYPE", true);
                requestTVType();
            }, 250);
        }
    }
    requestTVType();
}
self.serial.onDisconnect = () => {
    self.detectedTVType = TV_TYPES.NONE;
    self.postMessage({messageType: "disconnected", messageData: []});
}



self.onmessage = async (message) => {
    if(message.data.messageType == "frame"){
        self.setScreenFit(undefined, message.data.frame.codedWidth, message.data.frame.codedHeight);

        // Fill offscreen canvas with black
        self.offscreenCanvasCtx.beginPath();
        self.offscreenCanvasCtx.rect(0, 0, self.offscreenCanvas.width, self.offscreenCanvas.height);
        self.offscreenCanvasCtx.fillStyle = "black";
        self.offscreenCanvasCtx.fill();

        // Scale stream source to TV size
        self.offscreenCanvasCtx.drawImage(message.data.frame, self.fitFrameX, self.fitFrameY, self.fitFrameW, self.fitFrameH);

        // Convert to jpeg blob
        const blob = await self.offscreenCanvas.convertToBlob({type: "image/jpeg", quality: self.currentJPEGQuality});
        
        if(self.serial.connected){
            // Write the AVI chunk header bytes and the 4 bytes for the frame length
            await self.serial.write(new Uint8Array([0x30, 0x30, 0x64, 0x63,  blob.size & 0x000000ff,
                                                                            (blob.size & 0x0000ff00) >> 8,
                                                                            (blob.size & 0x00ff0000) >> 16,
                                                                            (blob.size & 0xff000000) >> 24]), false);
            
            // Write the actual jpeg frame
            await self.serial.write(new Uint8Array(await blob.arrayBuffer()), false);
        }
        
        // Convert jpeg to bitmap for preview (want to show the compression in the preview) and display it
        const bitmap = await createImageBitmap(blob, 0, 0, self.offscreenCanvas.width, self.offscreenCanvas.height);
        self.offscreenOutputCanvas.width = self.offscreenCanvas.width;
        self.offscreenOutputCanvas.height = self.offscreenCanvas.height;
        self.offscreenOutputCanvasCtx.drawImage(bitmap, 0, 0, self.offscreenCanvas.width, self.offscreenCanvas.height);

        // Close the frame
        message.data.frame.close();
        self.postMessage({messageType: "lastframesent", messageData: []});
    }else if(message.data.messageType == "connect"){
        self.serial.connect();
    }else if(message.data.messageType == "disconnect"){
        self.serial.disconnect();
    }else if(message.data.messageType == "canvas"){
        self.offscreenOutputCanvas = message.data.canvas;
        self.offscreenOutputCanvasCtx = self.offscreenOutputCanvas.getContext("2d");
    }else if(message.data.messageType == "fit"){
        self.currentFitType = message.data.messageData[0];
    }
};
