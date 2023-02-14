import { Serial } from "../serial.js";
import { TV_TYPES } from "/javascripts/streaming/jpegstreamerCommon.js";


let description = document.getElementById("description");

let connectButton = document.getElementById("connectButton");
let manualUpdateButton = document.getElementById("manualUpdateButton");
let step1NextButton = document.getElementById("step1NextButton");
let step2NextButton = document.getElementById("step2NextButton");

let browserSupportError = document.getElementById("browserSupportError");
let infoOutput = document.getElementById("infoOutput");
let manualChoice = document.getElementById("manualChoice");

let choseMini = document.getElementById("choseMini");
let chose2 = document.getElementById("chose2");
let choseDIY = document.getElementById("choseDIY");

// Only perform the streaming logic if actually on the streaming page that has all the elements
if(description &&
   connectButton &&
   manualUpdateButton &&
   step1NextButton &&
   step2NextButton &&
   browserSupportError &&
   infoOutput &&
   manualChoice &&
   choseMini &&
   chose2 &&
   choseDIY){
    if (!("serial" in navigator)){
        connectButton.disabled = true;
        browserSupportError.classList.remove("invisible");
        description.classList.add("invisible");
    }

    let serial = new Serial([{usbVendorId:11914, usbProductId:10}]);
    let detectedTVType = TV_TYPES.NONE;


    let onTVTypeDetected = () => {
        infoOutput.classList.add("invisible");
        if(detectedTVType == TV_TYPES.TINYTV_2){
            console.error("TINY TV 2");
        }else if(detectedTVType == TV_TYPES.TINYTV_MINI){
            console.error("TINY TV MINI");
        }else if(detectedTVType == TV_TYPES.TINYTV_DIY){
            console.error("TINY TV DIY");
        }
    }

    let failedToConnectOrDetect = (str) => {
        detectedTVType = TV_TYPES.NONE
        serial.disconnect(false);
        connectButton.onclick = () => {serial.connect()};

        description.innerText = str;
        connectButton.innerText = "Try Again";

        infoOutput.classList.add("invisible");
        description.classList.remove("invisible");
        manualUpdateButton.classList.remove("invisible");
    }


    serial.onConnect = () => {
        connectButton.innerText = "Disconnect";
        connectButton.onclick = () => {serial.disconnect()};

        infoOutput.classList.remove("invisible");
        description.classList.add("invisible");
        manualUpdateButton.classList.add("invisible");


        const decoder = new TextDecoder();
        let received = "";


        serial.onData = (data) => {
            if(detectedTVType == TV_TYPES.NONE){
                received += decoder.decode(data);

                // See if it is any of the TVs, pass a human readable string to the on detect function since it will be displayed
                if(received.indexOf(TV_TYPES.TINYTV_2) != -1){
                    detectedTVType = TV_TYPES.TINYTV_2;
                    onTVTypeDetected();
                }else if(received.indexOf(TV_TYPES.TINYTV_MINI) != -1){
                    detectedTVType = TV_TYPES.TINYTV_MINI;
                    onTVTypeDetected();
                }
            }
        }


        let attempts = 0; 
        let requestTVType = () => {
            if(detectedTVType == TV_TYPES.NONE && serial.connected){
                setTimeout(() => {
                    serial.write("TYPE", true);

                    attempts++;

                    // 5 seconds
                    if(attempts >= 20){
                        failedToConnectOrDetect("Detection failed. Would you like to try again or try manually updating?");
                    }else{
                        requestTVType();
                    }
                }, 250);
            }
        }
        requestTVType();
    }
    serial.onConnectionCanceled = () => {
        failedToConnectOrDetect("Connection canceled. Would you like to try again or try manually updating?");
    }
    serial.onDisconnect = () => {
        description.innerText = "Update software on TinyTV 2, Mini, or DIY Kit";
        connectButton.innerText = "Connect TV";
        connectButton.onclick = () => {serial.connect()};

        infoOutput.classList.add("invisible");
        description.classList.remove("invisible");

        detectedTVType = TV_TYPES.NONE
    }


    connectButton.onclick = () => {serial.connect()};

    manualUpdateButton.onclick = () => {
        infoOutput.innerText = "Manually choose your TV";

        description.classList.add("invisible");
        connectButton.classList.add("invisible");
        manualUpdateButton.classList.add("invisible");
        manualChoice.classList.remove("invisible");
        infoOutput.classList.remove("invisible");
    }

    step1NextButton.onclick = () => {
        description.innerText = "Step 2: Plug the TV into a computer using a USB-C cord";
        document.getElementById("tv2Step1VideoContainer").classList.add("invisible");
        document.getElementById("tv2Step1Video").pause();
        document.getElementById("tv2Step2VideoContainer").classList.remove("invisible");
        document.getElementById("tv2Step2Video").play();
        step1NextButton.classList.add("invisible");
        step2NextButton.classList.remove("invisible");
    }

    step2NextButton.onclick = () => {
        description.innerText = "Step 3: Turn the TV on in update mode by pressing and holding\nthe reset button with a pen and clicking the power button once";
        document.getElementById("tv2Step2VideoContainer").classList.add("invisible");
        document.getElementById("tv2Step2Video").pause();
        document.getElementById("tv2Step3VideoContainer").classList.remove("invisible");
        document.getElementById("tv2Step3Video").play();
    }


    let onChoose = () => {
        manualChoice.classList.add("invisible");
        infoOutput.classList.add("invisible");
        description.classList.remove("invisible");
        step1NextButton.classList.remove("invisible");
    }
    choseMini.onclick = () => {
        onChoose();
    }
    chose2.onclick = () => {
        onChoose();
        description.innerText = "Step 1: Turn the TV off by holding the power button for 5 seconds. The screen will remain off\n(it does not matter if the TV is already on or off)";
        document.getElementById("tv2Step1VideoContainer").classList.remove("invisible");
        document.getElementById("tv2Step1Video").play();
    }
    choseDIY.onclick = () => {
        onChoose();
    }
}