import { Serial } from "../serial.js";
import { TV_TYPES, show, hide, disable, play, setClickCallback, setInnerText, hideAll } from "../common.js";
import { BasicPicoboot } from "./basicpicoboot.js";
import { BasicBossac } from "./basicbossac.js";


// Only perform the update page logic if actually on the update page
if(window.location.pathname.indexOf("Update") != -1){
    // When setScreen(), removeUrlParameter(), or page back button are pressed, re-render the page
    window.onpopstate = () => {
        refresh();
    }
    
    
    // https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
    let insertUrlParameter = (key, value) => {
        if (history.pushState) {
            let searchParams = new URLSearchParams(window.location.search);
            searchParams.set(key, value);
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
            window.history.pushState({path: newurl}, '', newurl);
        }
    }

    let setType = (type) => {
        insertUrlParameter("type", type);
    }

    let setScreen = (screen) => {
        insertUrlParameter("screen", screen);
        refresh();
    }
    
    // Remove the specific key
    let removeUrlParameter = (key) => {
        const url = window.location.href;
        var r = new URL(url);
        r.searchParams.delete(key);
        const newUrl = r.href;
        window.history.pushState({ path: newUrl }, '', newUrl);
        refresh();
    }

    // Get value of specific key
    let getUrlParameter = (key) => {
        let searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(key);
    }


    if(!("serial" in navigator)){
        disable("connectButton");
        show("browserSupportError");
        hide("description");
        hide("mainScreenBulletList");
    }

    let serial = new Serial([{usbVendorId:11914, usbProductId:10}, {usbVendorId:0x03EB, usbProductId: 0x8008}, {usbVendorId:0x03EB, usbProductId: 0x8009}], false);
    const picoboot = new BasicPicoboot();
    const bossac = new BasicBossac(serial);
    const decoder = new TextDecoder();
    let detectedTVType = TV_TYPES.NONE;
    let detectedFirmwareVer = undefined;
    let firmwareAndVersionInfo = undefined;

    
    // Makes all elements invisible and then shows element for screen in query string (called by insertUrlParameter)
    let refresh = () => {
        const screen = getUrlParameter("screen");

        // Only hide all elements if in a screen other than main update landing screen
        hideAll();

        if(screen == undefined){
            // If serial connected, disconnect it on this page
            if(bossac.connected){
                bossac.disconnect();
            }
            if(serial.connected){
                serial.disconnect();
            }
            if(picoboot.connected){
                picoboot.disconnect();
            }
            

            // Reset these when back on this screen
            detectedTVType = TV_TYPES.NONE;
            detectedFirmwareVer = undefined;
            firmwareAndVersionInfo = undefined;

            setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));

            setInnerText("description", "Update software on TinyTV 2, Mini, or DIY Kit");
            setInnerText("connectButton", "Connect TV");
            show("description");
            show("connectButton");
            show("mainScreenBulletList");


            let failedToConnectOrDetect = (str) => {
                detectedTVType = TV_TYPES.NONE
                serial.disconnect(false);
        
                setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));
                setInnerText("description", str);
                setInnerText("connectButton", "Try Again");
        
                hide("mainScreenBulletList");
                hide("infoOutput");
                show("description");
                show("manualUpdateButton");
            }
        
            serial.onConnectionCanceled = () => {
                failedToConnectOrDetect("Connection canceled or something is using it.\nWould you like to try again or try manually updating?");
            }
            serial.onDisconnect = () => {
                setClickCallback("connectButton", serial.connect.bind(serial, 2000000, 2048));
                setInnerText("description", "Update software on TinyTV 2, Mini, or DIY Kit");
                setInnerText("connectButton", "Connect TV");
        
                hide("infoOutput");
                show("description");
        
                detectedTVType = TV_TYPES.NONE;
            }
            serial.onConnect = async () => {
                setClickCallback("connectButton", serial.disconnect.bind(serial));
                setInnerText("connectButton", "Disconnect");
        
                setInnerText("infoOutput", "Detecting TV, please press power button to exit USB mode...");
                show("infoOutput");
                hide("mainScreenBulletList");
        
                let sendStr = "{\"GET\":\"" + "tvType" + "\"}";
                console.log("SENT: " + sendStr);
                serial.write(sendStr, true);
                try{
                    let received = await serial.waitFor('{', '}');
                    console.warn(received);

                    if(detectedTVType == TV_TYPES.NONE || detectedFirmwareVer == undefined){
                        // See if it is any of the TVs, pass a human readable string to the on detect function since it will be displayed
                        if(received.indexOf(TV_TYPES.TINYTV_2) != -1){
                            detectedTVType = TV_TYPES.TINYTV_2;
                            received = received.replace(TV_TYPES.TINYTV_2, "");     // Trim this away
                        }else if(received.indexOf(TV_TYPES.TINYTV_MINI) != -1){
                            detectedTVType = TV_TYPES.TINYTV_MINI;
                            received = received.replace(TV_TYPES.TINYTV_MINI, "");  // Trim this away
                        }else if(received.indexOf(TV_TYPES.TINYTV_DIY) != -1){
                            detectedTVType = TV_TYPES.TINYTV_DIY;
                            received = received.replace(TV_TYPES.TINYTV_DIY, "");  // Trim this away
                        }else{
                            console.error("Found reply string but it does not contain a recognized TV type. Here's the received substring '" + received + "' and here are valid types:", TV_TYPES);
                            failedToConnectOrDetect("Detection failed. Would you like to try again or try manually updating?");
                            return;
                        }
                    }
                }catch(error){
                    failedToConnectOrDetect("Detection failed. Would you like to try again or try manually updating?");
                    return;
                }


                sendStr = "{\"GET\":\"" + "fwVersion" + "\"}";
                console.log("SENT: " + sendStr);
                await serial.write(sendStr, true);
                let received = await serial.waitFor('{', '}');
                console.warn(received);
                
                let versionStr = JSON.parse(received)["fwVersion"];
                versionStr = versionStr.split("."); // Split into separate components

                detectedFirmwareVer = {
                    "MAJOR": parseInt(versionStr[0]),
                    "MINOR": parseInt(versionStr[1]),
                    "PATCH": parseInt(versionStr[2])
                }

                onTVTypeAndVersionDetected();
            }
        }else if(screen == "manual_update"){
            setInnerText("infoOutput", "Manually choose your TV");
            show("manualChoice");
            show("infoOutput");
            show("cancelUpdate");

            setClickCallback("choseMini", () => {
                setScreen("tvmini_step_1");
            });
            setClickCallback("chose2", () => {
                setScreen("tv2_step_1");
            });
            setClickCallback("choseDIY", () => {
                setScreen("tvdiy_step_1");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvmini_step_1"){
            setInnerText("description", "Step 1: Turn the TV off by holding the middle power button for 10 seconds. The screen will remain off\n(it does not matter if the TV is already on or off)");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvminiStep1VideoContainer");
            play("tvminiStep1Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tvmini_step_2");
            });
            setClickCallback("backButton", () => {
                setScreen("manual_update");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvmini_step_2"){
            setInnerText("description", "Step 2: Plug the TV into a computer using a USB-C cord");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvminiStep2VideoContainer");
            play("tvminiStep2Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tvmini_step_3");
            });
            setClickCallback("backButton", () => {
                setScreen("tvmini_step_1");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvmini_step_3"){
            setInnerText("description", "Step 3: Turn the TV on in update mode by pressing and holding the\nright-most button and clicking the middle power button once");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvminiStep3VideoContainer");
            play("tvminiStep3Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                insertUrlParameter("type", "tvmini");
                setScreen("update");
            });
            setClickCallback("backButton", () => {
                setScreen("tvmini_step_2");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tv2_step_1"){
            setInnerText("description", "Step 1: Turn the TV off by holding the power button for 10 seconds. The screen will remain off\n(it does not matter if the TV is already on or off)");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tv2Step1VideoContainer");
            play("tv2Step1Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tv2_step_2");
            });
            setClickCallback("backButton", () => {
                setScreen("manual_update");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tv2_step_2"){
            setInnerText("description", "Step 2: Plug the TV into a computer using a USB-C cord");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tv2Step2VideoContainer");
            play("tv2Step2Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tv2_step_3");
            });
            setClickCallback("backButton", () => {
                setScreen("tv2_step_1");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tv2_step_3"){
            setInnerText("description", "Step 3: Turn the TV on in update mode by pressing and holding\nthe reset button with a pen and clicking the power button once");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tv2Step3VideoContainer");
            play("tv2Step3Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                insertUrlParameter("type", "tv2");
                setScreen("update");
            });
            setClickCallback("backButton", () => {
                setScreen("tv2_step_2");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvdiy_step_1"){
            setInnerText("description", "Step 1: Turn the TV off by sliding the power switch down");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvdiyStep1VideoContainer");
            play("tvdiyStep1Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tvdiy_step_2");
            });
            setClickCallback("backButton", () => {
                setScreen("manual_update");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvdiy_step_2"){
            setInnerText("description", "Step 2: Plug the TV into a computer using a Micro-USB cord");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvdiyStep2VideoContainer");
            play("tvdiyStep2Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                setScreen("tvdiy_step_3");
            });
            setClickCallback("backButton", () => {
                setScreen("tvdiy_step_1");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "tvdiy_step_3"){
            setInnerText("description", "Step 3: Turn the TV on in update mode by pressing and holding\nthe top-left button and sliding the power button up");
            setInnerText("nextButton", "Next");
            show("description");
            show("backButton");
            show("nextButton");
            show("tvdiyStep3VideoContainer");
            play("tvdiyStep3Video");
            show("cancelUpdate");

            setClickCallback("nextButton", () => {
                insertUrlParameter("type", "tvdiy");
                setScreen("update");
            });
            setClickCallback("backButton", () => {
                setScreen("tvdiy_step_2");
            });
            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
        }else if(screen == "update"){
            const tvtype = getUrlParameter("type");
            let programmer = undefined;

            if(tvtype == "tv2" || tvtype == "tvmini"){
                programmer = picoboot;
                setInnerText("description", "The TV should now be in update mode and ready to connect to!\nClick the button below and select the 'RP2 Boot' device");
            }else{
                programmer = bossac;
                setInnerText("description", "The TV should now be in update mode and ready to connect to!\nClick the button below and select 'USB Serial Device'");
            }

            setInnerText("connectButton", "Connect");
            show("description");
            show("connectButton");
            show("cancelUpdate");

            setClickCallback("connectButton", async () => {
                programmer.onError = (message) => {
                    setInnerText("description", "Error, cannot continue update. Was the device disconnected?\nWould you like to restart the update process, contact us, or cancel?\n" + message);
                    setInnerText("connectButton", "Restart");
                    hide("progressBar");
                    show("contactusButton");

                    setClickCallback("connectButton", () => {
                        removeUrlParameter("type");
                        removeUrlParameter("screen");
                    });
                }

                programmer.onConnectionCanceled = () => {
                    setInnerText("description", "No device selected or something is using it, could not connect and update.\nWould you like to try connecting again, contacting us, or canceling?");
                    setInnerText("connectButton", "Try again");
                    show("contactusButton");
                }

                programmer.onOpenFail = () => {
                    setInnerText("description", "Something went wrong when trying to update over USB.\nPlease select the 'RPI-RP2' device in File Explorer and agree to the popup dialog");
                    hide("connectButton");
                    setClickCallback("cancelUpdate", () => {
                        programmer.disconnect(false);
                        removeUrlParameter("screen");
                        removeUrlParameter("type");
                    });
                }

                programmer.onUpdateStart = () => {
                    setInnerText("description", "Updating...");
                    setInnerText("connectButton", "Disconnect");
                    hide("contactusButton");
                    setClickCallback("connectButton", () => {
                        programmer.disconnect(true);
                    });
                    setClickCallback("cancelUpdate", () => {
                        programmer.disconnect(false);
                        removeUrlParameter("screen");
                        removeUrlParameter("type");
                    });
                }

                programmer.onUpdateProgress = (percentage) => {
                    show("progressBar");
                    document.getElementById("progressBarBar").style.width = percentage + "%";
                    document.getElementById("progressBarText").innerText = percentage + "%";
                }

                programmer.onUpdateComplete = () => {
                    removeUrlParameter("type");
                    setScreen("update_complete");
                }


                // Get the firmware url and version information for all TVs
                let response = await fetch("https://raw.githubusercontent.com/TinyCircuits/TinyCircuits-TinyTVs-Firmware/master/binaries/update-page-info.json", {cache: 'no-store', pragma: 'no-cache'});
                if(!response.ok){
                    setInnerText("description", "Error fetching firmware information, please try contacting us");
                    show("contactusButton");
                    show("manualUpdateButton");
                    hide("infoOutput");
                    hide("connectButton");
                    return;
                }
                let firmwareAndVersionInfo = JSON.parse(await response.text());

                // Format the firmware URLs with the latest version information (this just makes it so that only one thing needs to be changed manually in the update-page-info.json)
                firmwareAndVersionInfo["tinytv2"]["firmware-url"] = firmwareAndVersionInfo["tinytv2"]["firmware-url"].replace("_X_", firmwareAndVersionInfo["tinytv2"]["latest-version"][0]);
                firmwareAndVersionInfo["tinytv2"]["firmware-url"] = firmwareAndVersionInfo["tinytv2"]["firmware-url"].replace("_Y_", firmwareAndVersionInfo["tinytv2"]["latest-version"][1]);
                firmwareAndVersionInfo["tinytv2"]["firmware-url"] = firmwareAndVersionInfo["tinytv2"]["firmware-url"].replace("_Z_", firmwareAndVersionInfo["tinytv2"]["latest-version"][2]);

                firmwareAndVersionInfo["tinytvmini"]["firmware-url"] = firmwareAndVersionInfo["tinytvmini"]["firmware-url"].replace("_X_", firmwareAndVersionInfo["tinytvmini"]["latest-version"][0]);
                firmwareAndVersionInfo["tinytvmini"]["firmware-url"] = firmwareAndVersionInfo["tinytvmini"]["firmware-url"].replace("_Y_", firmwareAndVersionInfo["tinytvmini"]["latest-version"][1]);
                firmwareAndVersionInfo["tinytvmini"]["firmware-url"] = firmwareAndVersionInfo["tinytvmini"]["firmware-url"].replace("_Z_", firmwareAndVersionInfo["tinytvmini"]["latest-version"][2]);

                firmwareAndVersionInfo["tinytvdiy"]["firmware-url"] = firmwareAndVersionInfo["tinytvdiy"]["firmware-url"].replace("_X_", firmwareAndVersionInfo["tinytvdiy"]["latest-version"][0]);
                firmwareAndVersionInfo["tinytvdiy"]["firmware-url"] = firmwareAndVersionInfo["tinytvdiy"]["firmware-url"].replace("_Y_", firmwareAndVersionInfo["tinytvdiy"]["latest-version"][1]);
                firmwareAndVersionInfo["tinytvdiy"]["firmware-url"] = firmwareAndVersionInfo["tinytvdiy"]["firmware-url"].replace("_Z_", firmwareAndVersionInfo["tinytvdiy"]["latest-version"][2]);


                if(tvtype == "tv2"){
                    await programmer.connectUpdate(firmwareAndVersionInfo["tinytv2"]["firmware-url"]);
                }else if(tvtype == "tvmini"){
                    await programmer.connectUpdate(firmwareAndVersionInfo["tinytvmini"]["firmware-url"]);
                }else if(tvtype == "tvdiy"){
                    await programmer.connectUpdate(firmwareAndVersionInfo["tinytvdiy"]["firmware-url"]);
                }
            });
        }else if(screen == "update_not_needed"){
            let detectedVersion = getUrlParameter("detected_tv_fw_version");
            let latestVersion = getUrlParameter("latest_tv_fw_version");
            setInnerText("description", "Your TV is up to date. Would you still like to update?\n\n Detected Version: " + detectedVersion + "\nAvailable Version: " + latestVersion);
            setInnerText("nextButton", "Update");
            show("description");
            show("cancelUpdate");
            show("nextButton");

            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("detected_tv_fw_version");
                removeUrlParameter("latest_tv_fw_version");
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
            setClickCallback("nextButton", async () => {
                serial.autoReset(() => {
                    removeUrlParameter("detected_tv_fw_version");
                    removeUrlParameter("latest_tv_fw_version");
                    setScreen("update");
                });
            });
        }else if(screen == "update_needed"){
            let detectedVersion = getUrlParameter("detected_tv_fw_version");
            let latestVersion = getUrlParameter("latest_tv_fw_version");
            setInnerText("description", "Your TV is out of date! Would you like to update?\n\n Detected Version: " + detectedVersion + "\nAvailable Version: " + latestVersion);
            setInnerText("nextButton", "Yes");
            show("description");
            show("cancelUpdate");
            show("nextButton");

            setClickCallback("cancelUpdate", () => {
                removeUrlParameter("detected_tv_fw_version");
                removeUrlParameter("latest_tv_fw_version");
                removeUrlParameter("screen");
                removeUrlParameter("type");
            });
            setClickCallback("nextButton", async () => {
                serial.autoReset(() => {
                    removeUrlParameter("detected_tv_fw_version");
                    removeUrlParameter("latest_tv_fw_version");
                    setScreen("update");
                });
            });
        }else if(screen == "update_complete"){
            setInnerText("description", "Update complete!\nThe TV should reboot.");
            setInnerText("nextButton", "Done");
            show("description");
            show("nextButton");

            setClickCallback("nextButton", async () => {
                removeUrlParameter("screen");
            });
        }
    }

    // Call this in case link with query string is visited
    refresh();


    // If user picks manual update, change query string and render that page
    setClickCallback("manualUpdateButton", () => {
        setScreen("manual_update");
    })


    let onTVTypeAndVersionDetected = async () => {
        // Disconnect now since the next connect should be automatic and at 1200 baud to reset it
        serial.onDisconnect = () => {};
        await serial.disconnect();

        let response = await fetch("https://raw.githubusercontent.com/TinyCircuits/TinyCircuits-TinyTVs-Firmware/master/binaries/update-page-info.json", {cache: 'no-store', pragma: 'no-cache'});
        
        if(!response.ok){
            setInnerText("description", "Error fetching online versions, please contact us or try manually updating");
            show("contactusButton");
            show("manualUpdateButton");
            hide("infoOutput");
            hide("connectButton");
            return;
        }

        let firmwareAndVersionInfo = JSON.parse(await response.text());

        insertUrlParameter("detected_tv_fw_version", detectedFirmwareVer["MAJOR"] + "." + detectedFirmwareVer["MINOR"] + "." + detectedFirmwareVer["PATCH"]);

        if(detectedTVType == TV_TYPES.TINYTV_2){
            insertUrlParameter("type", "tv2");
            insertUrlParameter("latest_tv_fw_version", firmwareAndVersionInfo["tinytv2"]["latest-version"][0] + "." +
                                                       firmwareAndVersionInfo["tinytv2"]["latest-version"][1] + "." +
                                                       firmwareAndVersionInfo["tinytv2"]["latest-version"][2]);
            if(detectedFirmwareVer["MAJOR"] < firmwareAndVersionInfo["tinytv2"]["latest-version"][0] ||
               detectedFirmwareVer["MINOR"] < firmwareAndVersionInfo["tinytv2"]["latest-version"][1] ||
               detectedFirmwareVer["PATCH"] < firmwareAndVersionInfo["tinytv2"]["latest-version"][2]){
                // Need to update
                setScreen("update_needed");
            }else{
                // Don't need to update but still can if they'd like to
                setScreen("update_not_needed");
            }
        }else if(detectedTVType == TV_TYPES.TINYTV_MINI){
            insertUrlParameter("type", "tvmini");
            insertUrlParameter("latest_tv_fw_version", firmwareAndVersionInfo["tinytvmini"]["latest-version"][0] + "." +
                                                       firmwareAndVersionInfo["tinytvmini"]["latest-version"][1] + "." +
                                                       firmwareAndVersionInfo["tinytvmini"]["latest-version"][2]);
            if(detectedFirmwareVer["MAJOR"] < firmwareAndVersionInfo["tinytvmini"]["latest-version"][0] ||
               detectedFirmwareVer["MINOR"] < firmwareAndVersionInfo["tinytvmini"]["latest-version"][1] ||
               detectedFirmwareVer["PATCH"] < firmwareAndVersionInfo["tinytvmini"]["latest-version"][2]){
                // Need to update
                setScreen("update_needed");
            }else{
                // Don't need to update but still can if they'd like to
                setScreen("update_not_needed");
            }
        }else if(detectedTVType == TV_TYPES.TINYTV_DIY){
            insertUrlParameter("type", "tvdiy");
            insertUrlParameter("latest_tv_fw_version", firmwareAndVersionInfo["tinytvdiy"]["latest-version"][0] + "." +
                                                       firmwareAndVersionInfo["tinytvdiy"]["latest-version"][1] + "." +
                                                       firmwareAndVersionInfo["tinytvdiy"]["latest-version"][2]);
            if(detectedFirmwareVer["MAJOR"] < firmwareAndVersionInfo["tinytvdiy"]["latest-version"][0] ||
               detectedFirmwareVer["MINOR"] < firmwareAndVersionInfo["tinytvdiy"]["latest-version"][1] ||
               detectedFirmwareVer["PATCH"] < firmwareAndVersionInfo["tinytvdiy"]["latest-version"][2]){
                // Need to update
                setScreen("update_needed");
            }else{
                // Don't need to update but still can if they'd like to
                setScreen("update_not_needed");
            }
        }
    }
}