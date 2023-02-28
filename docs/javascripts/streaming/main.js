import { JPEGStreamer } from "/javascripts/streaming/jpegstreamer.js";
import { TV_FIT_TYPES } from "/javascripts/streaming/jpegstreamerCommon.js";

let streamScreen0 = document.getElementById("streamScreen0");
let streamConnectButton = document.getElementById("streamConnectButton");
let browserSupportError = document.getElementById("browserSupportError");
let description = document.getElementById("description");
let outputPreview = document.getElementById("outputPreview");
let outputCanvas = document.getElementById("outputCanvas");
let infoOutput = document.getElementById("infoOutput");
let audioSupportMessage = document.getElementById("audioSupportMessage");

let cropContainer = document.getElementById("cropContainer");
let inputContain = document.getElementById("inputContain");
let inputCover = document.getElementById("inputCover");
let inputFill = document.getElementById("inputFill");

// Only perform the streaming logic if actually on the streaming page that has all the elements
if(window.location.pathname.indexOf("Streaming") != -1){
    if (!("serial" in navigator)){
        streamConnectButton.disabled = true;
        browserSupportError.classList.remove("invisible");
        description.classList.add("invisible");
        audioSupportMessage.classList.add("invisible");
    }

    streamConnectButton.onclick = () => {jpegStreamer.connectSerial()};

    let jpegStreamer = new JPEGStreamer(outputCanvas);
    jpegStreamer.onSerialConnect = () => {
        streamConnectButton.innerText = "Disconnect";
        streamConnectButton.onclick = () => {jpegStreamer.disconnectSerial()};


        infoOutput.innerText = "Detecting TV...";
        infoOutput.classList.remove("invisible");
    }
    jpegStreamer.onSerialDisconnect = () => {
        streamConnectButton.innerText = "Connect TV";
        streamConnectButton.onclick = () => {jpegStreamer.connectSerial()};

        outputPreview.classList.add("invisible");
        cropContainer.classList.add("invisible");
        infoOutput.classList.add("invisible");
        description.classList.remove("invisible");
        audioSupportMessage.classList.remove("invisible");
    }
    jpegStreamer.onTVDetected = (tvString) => {
        infoOutput.innerText = tvString + " detected!";
    }
    jpegStreamer.onStreamReady = () => {
        outputPreview.classList.remove("invisible");
        cropContainer.classList.remove("invisible");
        description.classList.add("invisible");
        infoOutput.classList.add("invisible");
        audioSupportMessage.classList.add("invisible");
    }


    inputContain.oninput = (event) => {
        jpegStreamer.setScreenFit(TV_FIT_TYPES.CONTAIN);
    }
    inputCover.oninput = (event) => {
        jpegStreamer.setScreenFit(TV_FIT_TYPES.COVER);
    }
    inputFill.oninput = (event) => {
        jpegStreamer.setScreenFit(TV_FIT_TYPES.FILL);
    }
}