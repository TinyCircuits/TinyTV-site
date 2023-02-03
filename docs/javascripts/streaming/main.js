import { JPEGStreamer } from "./lib/jpegstreamer/jpegstreamer.js";


let streamScreen0 = document.getElementById("streamScreen0");
let streamScreen1 = document.getElementById("streamScreen1");
let streamConnectButton = document.getElementById("streamConnectButton");
let browserSupportError = document.getElementById("browserSupportError");
let description = document.getElementById("description");

// Only perform the streaming logic if actually on the streaming page that has all the elements
if(streamScreen0 && streamScreen1 && streamConnectButton && browserSupportError && description){
    if (!("serial" in navigator)){
        streamConnectButton.disabled = true;
        browserSupportError.classList.toggle("invisible");
        description.classList.toggle("invisible");
    }
    
    
    streamConnectButton.onclick = (event) => {
        console.log("TEST");
    }
}