import { Serial } from "../serial.js";
import { show, hide, disable, setClickCallback, setInnerText } from "../common.js";


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

    let set = async (value) => {
        let sendStr = "{\"SET\":\"" + value + "\"}" ;
        console.log("SENT: " + sendStr);
        await serial.write(sendStr, true);
    }

    let get = async (value) => {
        received = "";

        let sendStr = "{\"GET\":\"" + value + "\"}";
        console.log("SENT: " + sendStr);
        await serial.write(sendStr, true);

        try{
            return await serial.waitFor("{", "}", value);
        }catch{
            // Did not find response string in time
        }
    }

    let setup = async () => {
        // Now show settings since we got a response
        show("settings");

        setInnerText("description", "Change settings on TinyTV 2, Mini, or DIY Kit");

        // Get volume setting
        let received = await get("volume");
        console.warn(received);
        let volume = parseInt(JSON.parse(received)["volume"]);
        document.getElementById("volumeLabel").innerText = volume;
        document.getElementById("volume").value = volume;

        // Get loop playback mode setting
        received = await get("loopVideo");
        console.warn(received);
        let loopVideo = JSON.parse(received)["loopVideo"];
        document.getElementById("loopVideoOn").checked = loopVideo;
        document.getElementById("loopVideoOff").checked = !loopVideo;

        // Get live playback mode setting
        received = await get("liveVideo");
        console.warn(received);
        let liveVideo = JSON.parse(received)["liveVideo"];
        document.getElementById("liveVideoOn").checked = liveVideo;
        document.getElementById("liveVideoOff").checked = !liveVideo;

        // Get alphabetize playlist setting
        received = await get("alphabetize");
        console.warn(received);
        let alphabetize = JSON.parse(received)["alphabetize"];
        document.getElementById("alphabetizePlaybackOrderOn").checked = alphabetize;
        document.getElementById("alphabetizePlaybackOrderOff").checked = !alphabetize;

        // Get static effect setting
        received = await get("static");
        console.warn(received);
        let staticEffect = JSON.parse(received)["static"];
        document.getElementById("staticEffectOn").checked = staticEffect;
        document.getElementById("staticEffectOff").checked = !staticEffect;

        // Get show channel number setting
        received = await get("showChannel");
        console.warn(received);
        let showChannel = JSON.parse(received)["showChannel"];
        document.getElementById("showChannelNumberOn").checked = showChannel;
        document.getElementById("showChannelNumberOff").checked = !showChannel;

        // Get show volume setting
        received = await get("showVolume");
        console.warn(received);
        let showVolume = JSON.parse(received)["showVolume"];
        document.getElementById("showVolumeOn").checked = showVolume;
        document.getElementById("showVolumeOff").checked = !showVolume;
    }

    serial.onConnectionCanceled = () => {
        setInnerText("description", "Connection canceled. Would you like to try again?");
        setInnerText("connectButton", "Try again");
    }
    serial.onConnect = async () => {
        setInnerText("connectButton", "Disconnect");
        setClickCallback("connectButton", serial.disconnect.bind(serial));

        setInnerText("description", "Connected, waiting for TV response...\nPress the power button to get out of USB mode");

        // Keep requesting TV type until it works
        let requestTvType = async () => {
            let sendStr = "{\"GET\":\"" + "tvType" + "\"}";
            console.log("SENT: " + sendStr);
            serial.write(sendStr, true);
            try{
                let received = await serial.waitFor('{', '}');
                console.warn(received);

                // Only way this ends is if we get response that does not reject
                setup();
            }catch(error){
                // Every time 'waitFor()' fails, try asking again
                requestTvType();
            }
        }
        requestTvType();
    }
    serial.onDisconnect = () => {
        hide("settings");
        setInnerText("connectButton", "Connect TV");
        setInnerText("description", "Change settings on TinyTV 2, Mini, or DIY Kit");

        setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));
    }

    serial.onData = (data) => {
        received += decoder.decode(data);
    }
    setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));


    // Update the volume percent label on input change, and send cmd to update it
    document.getElementById("volume").oninput = (event) => {
        document.getElementById("volumeLabel").innerText = event.target.value;
        set("volume=" + event.target.value);
    }

    document.getElementById("loopVideoOff").oninput = (event) => {
        set("loopVideo=false");
    }
    document.getElementById("loopVideoOn").oninput = (event) => {
        set("loopVideo=true");
    }

    document.getElementById("liveVideoOff").oninput = (event) => {
        set("liveVideo=false");
    }
    document.getElementById("liveVideoOn").oninput = (event) => {
        set("liveVideo=true");
    }

    document.getElementById("staticEffectOff").oninput = (event) => {
        set("static=false");
    }
    document.getElementById("staticEffectOn").oninput = (event) => {
        set("static=true");
    }

    document.getElementById("showVolumeOff").oninput = (event) => {
        set("showVolume=false");
    }
    document.getElementById("showVolumeOn").oninput = (event) => {
        set("showVolume=true");
    }

    document.getElementById("showChannelNumberOff").oninput = (event) => {
        set("showChannel=false");
    }
    document.getElementById("showChannelNumberOn").oninput = (event) => {
        set("showChannel=true");
    }

    document.getElementById("alphabetizePlaybackOrderOff").oninput = (event) => {
        set("alphabetize=false");
    }
    document.getElementById("alphabetizePlaybackOrderOn").oninput = (event) => {
        set("alphabetize=true");
    }
}