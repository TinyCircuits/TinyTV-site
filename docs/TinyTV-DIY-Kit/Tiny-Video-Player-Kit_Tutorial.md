
  <h1> Tiny Video Player Kit Tutorial </h1>
  

  <center><img width="50%" height="50%" src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/TinyVideoPlayer-Product-Photo-01.1.png" /></center>


This tutorial will show you how to build the Tiny Video Player Kit. If you bought the Tiny Video Player Kit, this program comes pre-installed so that you can get started watching, or converting and uploading videos. There are a few different <a href="../TinyTV-Tutorial/" alt="TinyTV and Video Player settings tutorial">**settings options**</a> for how you can play and watch videos (as of April 2020).


*If you bought the Tiny Video Player Kit and you are looking for the resource that teaches you how to add your own videos to the Tiny Video Player, you can skip directly to the* <a href="../TSV-Converter-Tutorial/" alt="TinyScreen Video Converter Tutorial">***TSV Converter Tutorial***</a>

- - -

## Materials

### Hardware: 

* <a href="https://tinycircuits.com/collections/accessories/products/micro-usb-cable-3-feet" target="_blank" alt="Micro USB Cable Product Page">**Micro USB Cable**</a> 
* <a href="https://tinycircuits.com/collections/kits/products/tiny-video-player-kit" target="_blank" alt="Tiny Video Player Kit Product Page">**Tiny Video Player Kit**</a> or **Individual Components:**
    * <a href="https://tinycircuits.com/products/tinyscreenplus" target="_blank" alt="TinyScreen+ Processor Board Product Page">**TinyScreen+ Processor Board**</a> - Runs the program, has a SAMD 32-bit processor, OLED screen, USB and power circuitry.
    * <a href="https://tinycircuits.com/collections/memory/products/microsd_audio-tinyshield" target="_blank" alt="Micro SD / Audio TInyShield Product Page">**Micro SD / Audio TinyShield**</a> - Designed specifically for use with the TinyScreen+, this TinyShield has the micro SD card adapter, audio driver and IR receiver (which can receive TV remote control signals).
    * <a href="https://tinycircuits.com/collections/batteries/products/lithium-ion-polymer-battery-3-7v-290mah" target="_blank" alt="290 mAh Rechargeable Lithium Polymer Battery Product Page">**290 mAh Rechargeable Lithium Polymer Battery**</a> - Used to power your video player, and is recharged when the USB is plugged into the TinyScreen+ board.
    * <a href="https://tinycircuits.com/collections/accessories/products/16_9_speaker" target="_blank" alt="16x9 Speaker Product Page">**16x9 Speaker**</a> - for audio playback on videos
    * <a href="https://tinycircuits.com/collections/accessories/products/microsd-card-and-adapter-8gb" target="_blank" alt="8GB micro SD card and Adapter Product Page">**8GB Micro SD card and Adapter**</a> - preloaded with sample videos. 

### Extras:

*   Some videos!

- - -

### Fun Fact:

*   The micro SD card that comes with the kit is 8 GB, which may seem small, but most movies are around 1-2GB each. HD movies tend to be closer to 5GB, but that is still an impressive amount of memory in such a tiny package. 

- - -

## Step 1: Assembly (Hardware)

There is no soldering or complicated configurations to worry about, you simply have to plug connectors into the right places to assemble this project.


<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Gif-01.gif" /></center>

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Gif-02.gif" /></center>

Starting with the SD and Audio TinyShield, plug in the SD card and the speaker to the slots on the TinyShield.

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Gif-03.gif" /></center>


 Plug the battery into the 2 pin connector on the TinyScreen+.  
***Be careful!** The TinyScreen+ and the SD and Audio TinyShield both have a tan 2 pin connector. Make sure the battery is plugged into the TinyScreen+, and the speaker is plugged into the SD and Audio TinyShield. *

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Gif-04.gif" /></center>


Then attach the TinyScreen+ to the SD and Audio TinyShield via the tan 32-pin connectors.

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Gif-05.gif" /></center>
<center>*The complete setup of the Tiny Video Player*</center>

Turn the switch on the TinyScreen+ to ON. 

- - -

## Step 2: Software (Setup)

If you have not already, download the Arduino IDE. This is the platform, or application we will use to upload a program to the TinyScreen+ so that it will work as a Tiny Video Player.

To setup the Arduino IDE to program the TinyScreen+, open up the Arduino IDE after downloading. You need to make these selections under the Tools tab: 

*   Tools -> Board -> "TinyScreen+"
*   Tools -> Port -> "COM##(TinyScreen+)"
*   Programmer -> "Arduino as ISP"

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Image-03.png" /></center>
<center>*Tools selections*</center>



If you have any issues finding the correct port, you can unplug the microUSB cable and plug it back in while noting which COM## disappears and reappears during this process.

- - -

## Step 3: The Code!

At this point, you have everything set up to upload the program to your TinyScreen+. Download the following zip file of the Tiny Video Player program and open it in the Arduino IDE:

<center><a href="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/software/TinyScreenVideoKit.zip" alt="Tiny Video Player Arduino Program Zip Download">**Tiny Video Player Arduino Program**</a></center>

After the program is uploaded, the Tiny Video Player program will begin playing all the files on the SD Card that have the .tsv extension in order. 

The Tiny Video Player program has the following functionality programmed for the TinyScreen+ buttons: 

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Image-04.png" /></center>

If you want to add some new videos or movies to your SD Card, you can move on to the <a href="../TSV-Converter-Tutorial/" alt="TinyScreen Video Converter Tutorial">**TSV Converter Tutorial**</a> that shows you exactly how to do that using the TSV (TinyScreen Video) Converter. To sum up using the TSV Converter, you simply need to download either the MacOS or Windows app, open it and then upload the files you want to convert to the .tsv format. The converted videos will automatically save to the same file location as the original video. The videos you would like to play on the Tiny Video Player then just need moved onto the SD card being used in the project.

