import { Serial } from "../serial.js";
import { show, hide, disable, setClickCallback, setInnerText } from "../common.js";


// Only perform the settings page logic if actually on the settings page
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

    let format = async () => {
        let sendStr = "{\"FORMAT\":\"" + "SDFAT" + "\"}" ;
        console.log("SENT: " + sendStr);
        await serial.write(sendStr, true);

        try{
            let result = await serial.waitFor("Unhandled ", "key", "JSON");

            // If waited for and find "Unhandled JSON key" then
            // feature not supported, alert the user
            if(result != undefined){
                alert("Could not format! Please update TV for format support!");
            }
        }catch{
            // If times out waiting for "Unhandled JSON key" then format
            // feature was supported and likely worked, tell the user
            alert("Format successful!");
        }
    }

    let get = async (value, ignoreUnsupportedSettingsWarning=false) => {
        received = "";

        let sendStr = "{\"GET\":\"" + value + "\"}";
        console.log("SENT: " + sendStr);
        await serial.write(sendStr, true);

        try{
            let result = await serial.waitFor("{", "}", value);
            if(ignoreUnsupportedSettingsWarning == false){
                if(result.indexOf("none") != -1){
                    alert("Getting '" + value + "' unsupported! Please update your TV!")
                }
            }
            return result;
        }catch{
            // Did not find response string in time
        }
    }

    let setup = async () => {
        // Now show settings since we got a response
        show("settings");
        show("formatButton", false);

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

        // Get show volume setting
        received = await get("randStartTime");
        console.warn(received);
        let randStartTime = JSON.parse(received)["randStartTime"];
        document.getElementById("randStartTimeOn").checked = randStartTime;
        document.getElementById("randStartTimeOff").checked = !randStartTime;
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
        hide("formatButton");
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

    document.getElementById("randStartTimeOff").oninput = (event) => {
        set("randStartTime=false");
    }
    document.getElementById("randStartTimeOn").oninput = (event) => {
        set("randStartTime=true");
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

    setClickCallback("formatButton", () => {
        if(confirm("Are you sure you want to format the TV? All files will be erased!\n\n* If you're having playback/file issues, try turning the TV off and on (hold the power button down for 10s to turn it off)\n* Try charging the TV for a few minutes and check if the issues go away\n\nTinyTV 2 and Mini will turn off, press the power button to turn it back on. DIY will stay on, the SD card will need to be removed to upload videos")){
            // Format the TV and erase all of its files
            format();
        }
    });
}