import { Serial } from "../serial.js";
import { show, hide, disable, setClickCallback, setInnerText } from "/javascripts/common.js";


// Only perform the update page logic if actually on the settings page
if(window.location.pathname.indexOf("Settings") != -1){
    // Check if serial is available in this browser
    if(!("serial" in navigator)){
        disable("connectButton");
        show("browserSupportError");
        hide("description");
    }

    let serial = new Serial([{usbVendorId:11914, usbProductId:10}, {usbVendorId:0x03EB, usbProductId: 0x8009}]);
    const decoder = new TextDecoder();
    let received = "";

    let set = async (cmd, value) => {
        await serial.write(JSON.stringify({CMD: cmd, CMD_TYPE: "set", VALUE: value}), true);
    }

    let get = async (cmd) => {
        received = "";
        await serial.write(JSON.stringify({CMD: cmd, CMD_TYPE: "get",}), true);

        // Cleared received, wait for valid json response to parse or timeout
        let tries = 0;
        let parse = () => {
            return new Promise((resolve, reject) => {
                let tryParse = () => {
                    setTimeout(() => {
                        try{
                            let result = JSON.parse(received);
                            resolve(result);
                        }catch(error){
                            // Parse likely did not work
                        }

                        tries++;
                        if(tries >= 200){
                            throw "Timed out waiting for json response... This is what was received: " + received;
                        }
                        tryParse();
                    }, 10);
                }
                tryParse();
            })
        }
        return await parse();
    }

    serial.onConnectionCanceled = () => {
        setInnerText("description", "Connection canceled. Would you like to try again?");
        setInnerText("connectButton", "Try again");
    }
    serial.onConnect = () => {
        show("settings");
        setInnerText("connectButton", "Disconnect");

        setClickCallback("connectButton", serial.disconnect.bind(serial));

        get("volume");
    }
    serial.onDisconnect = () => {
        hide("settings");
        setInnerText("connectButton", "Connect TV");

        setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));
    }

    serial.onData = (data) => {
        received += decoder.decode(data);
    }
    setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));


    // Update the volume percent label on input change, and send cmd to update it
    document.getElementById("volume").oninput = (event) => {
        document.getElementById("volumeLabel").innerText = event.target.value + "%";

        set("volume", event.target.value);
    }

    document.getElementById("playbackModeLoop").oninput = (event) => {
        set("playback_mode", "loop");
    }
    document.getElementById("playbackModeAuto").oninput = (event) => {
        set("playback_mode", "auto");
    }

    document.getElementById("staticEffectOff").oninput = (event) => {
        set("static", "off");
    }
    document.getElementById("staticEffectOn").oninput = (event) => {
        set("static", "on");
    }

    document.getElementById("showTimestampOff").oninput = (event) => {
        set("timestamp", "off");
    }
    document.getElementById("showTimestampOn").oninput = (event) => {
        set("timestamp", "on");
    }

    document.getElementById("showChannelNumberOff").oninput = (event) => {
        set("channel_number", "off");
    }
    document.getElementById("showChannelNumberOn").oninput = (event) => {
        set("channel_number", "on");
    }

    document.getElementById("alphabetizePlaybackOrderOff").oninput = (event) => {
        set("alphabetize_playback_order", "off");
    }
    document.getElementById("alphabetizePlaybackOrderOn").oninput = (event) => {
        set("alphabetize_playback_order", "on");
    }
}