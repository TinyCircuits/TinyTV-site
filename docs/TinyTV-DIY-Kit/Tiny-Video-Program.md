
  <h1>Programming the TinyTV or Tiny Video Player </h1>


  <center><img width="50%" height="50%" src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/TinyVideoPlayer-Product-Photo-01.1.png" /></center>



Get ready to learn how to upload your favorite movies and videos into a screen you can comfortably fit in the palm of your hand. You can take this project on the road with some movies loaded on it, or use it in your next project that needs some tiny video.

TinyTV and Tiny Video Player kits are shipped with the TinyTV and Video Player code pre-programmed, respectively. This tutorial is for those that wish to get more involved in the programming aspect. If you are interested in looping or auto playing videos, or want to turn off the TV mode that starts playing all videos once the unit is turned on - please refer to the <a href="../TinyTV-Tutorial/" alt="TinyTV and Tiny Video Player settings menu">**Settings Menu Tutorial**</a>. The settings menu has some commonly-asked-for functionality options that can be toggled without doing any programming!



*If this is your first time programming with the TinyScreen+, please go through the* <a href="https://learn.tinycircuits.com/Processors/TinyScreen+_Setup_Tutorial/" target="_blank" alt="TinyScreen+ Setup Tutorial learn wiki page">***TinyScreen+ Setup Tutorial on our Wiki tutorial site***</a> *so that you have the TinyScreen library downloaded before proceeding.*

- - -

## Materials

### Hardware: 

* <a href="https://tinycircuits.com/collections/accessories/products/micro-usb-cable-3-feet" target="_blank" alt="Micro USB Cable Product Page">**Micro USB Cable**</a> 
* <a href="https://tinycircuits.com/products/tinytv-diy-kit" target="_blank" alt="TinyTV Product Page">**DIY TinyTV Kit**</a> or <a href="https://tinycircuits.com/collections/kits/products/tiny-video-player-kit" target="_blank" alt="Tiny Video Player Kit Product Page">**Tiny Video Player Kit**</a> or **Individual Components:**
    * <a href="https://tinycircuits.com/products/tinyscreenplus" target="_blank" alt="TinyScreen+ Processor Board Product Page">**TinyScreen+ Processor Board]**</a> - Runs the program, has a SAMD 32-bit processor, OLED screen, USB and power circuitry.
    * <a href="https://tinycircuits.com/collections/memory/products/microsd_audio-tinyshield" target="_blank" alt="Micro SD / Audio TInyShield Product Page">**Micro SD / Audio TinyShield**</a> - Designed specifically for use with the TinyScreen+, this TinyShield has the micro SD card adapter, audio driver and IR receiver (which can receive TV remote control signals). 
    * <a href="https://tinycircuits.com/collections/batteries/products/lithium-ion-polymer-battery-3-7v-290mah" target="_blank" alt="290 mAh Rechargeable Lithium Polymer Battery Product Page">**290 mAh Rechargeable Lithium Polymer Battery**</a> - Used to power your video player, and is recharged when the USB is plugged into the TinyScreen+ board.
    * <a href="https://tinycircuits.com/collections/accessories/products/16_9_speaker" target="_blank" alt="16x9 Speaker Product Page">**16x9 Speaker**</a> - for audio playback on videos
    * <a href="https://tinycircuits.com/collections/accessories/products/microsd-card-and-adapter-8gb" target="_blank" alt="8GB micro SD card and Adapter Product Page">**8GB Micro SD card and Adapter**</a> - preloaded with sample videos. 


### Software: 

* <a href="https://www.arduino.cc/en/Main/Software" target="_blank" alt="Arduino IDE Download Page">**Arduino IDE**</a>  - used to program the processor on the TinyScreen+
* <a href="https://github.com/TinyCircuits/TinyCircuits-TinyTV-ASK4002/raw/master/examples/TinyTV.zip" target="_blank" alt="Program that can function as a Tiny Video Player or TinyTV">**Arduino Program zip file Tiny Video Player / TinyTV**</a> - this will need uploaded using the Arduino IDE. This program can display both the Tiny Video Player, or the TinyTV program by toggling options on the <a href="../TinyTV-Tutorial/" target="_blank" alt="TinyScreen+ Setup Tutorial learn wiki page">**Settings Menu**</a>. The default setting is for the TinyTV.
  * *Note: make sure that when you download this zipped folder that you keep the file structure as it is when downloaded. You will need to open all of the program files in the Arduino IDE to be able to upload the program successfully.*

- - -

## Software

If you have not already, download the Arduino IDE. This is the platform, or application we will use to upload a program to the TinyScreen+ so that it will work as a Tiny Video Player.

Download the following zipped folder of the TinyTV / Video Player program, unzip the folder, and double-click the 'TinyTV.ino' file to open the program in the Arduino IDE:

<center><a href="https://github.com/TinyCircuits/TinyCircuits-TinyTV-ASK4002/raw/master/examples/TinyTV.zip" alt="TinyTV / Video Player Arduino Program Zip Download">**TinyTV / Video Player Arduino Program**</a></center>


Once downloaded, extract the files to a destination of your choice. Navigate to the unzipped folder and open TinyTV.ino. Turn the switch on the TinyScreen+ to ON, and plug it into your computer using a Micro USB cable.

To program the TinyScreen+, you need to make these selections under the Tools tab: 

*   Tools -> Board -> "TinyScreen+"
*   Tools -> Port -> "COM##(TinyScreen+)"
*   Programmer -> "Arduino as ISP"

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Image-03.png" /></center>
<center>*Tools selections*</center>

Once you've ensured the Board and Port selections under the Tools tab are correct, upload the sketch. Your TinyScreen+ should begin playing the videos stored on your micro SD card in the order you added them.

If you have any issues finding the correct port, you can unplug the microUSB cable and plug it back in while noting which COM## disappears and reappears during this process.

- - -

## How it works


After the program is uploaded, the TinyTV will begin playing the first video listed on the SD Card with a .tsv extension. Each video on the SD Card will show up as a "channel" that you can scroll through with the channel buttons on the remote. The videos all begin playing as soon as the TinyTV is turned on to mimic a real TV. When left on a channel, the video on that "channel" will repeat. Use the <a href="https://tinycircuits.com/collections/components/products/tiny-remote" target="_blank" alt="Tiny Remote Product Page">**Tiny Remote**</a> to control your TinyTV from a distance *(the remote works best about 12-18in. away from an IR Receiver. Works best with the TinyTV when pointed toward the top - where the receiver is)*, or use the following diagram of button functions right on the TinyTV enclosure:

<center><img height="50%" width="50%" src="https://github.com/TinyCircuits/TinyCircuits-TinyTV-ASK4002/raw/master/images/TinyTV-Buttons.jpg" alt="TinyTV Button functions" /></center>

To customize your viewing experience, you can use the <a height="50%" width="50%" href="https://learn.tinycircuits.com/Kits/TinyTV-Tutorial/" target="_blank" alt="https://learn.tinycircuits.com/Kits/TinyTV-Tutorial/">**Settings Menu Tutorial**</a> to turn off the TinyTV program for the Tiny Video Player program. Additionally you can toggle Auto Play, and Looping settings to customize your palm-sized video display.

The Tiny Video Player program will display a side-scrolling menu of all the files on the SD Card that have the .tsv extension in order. The Tiny Video Player program has the following functionality programmed for the TinyScreen+ buttons: 

<center><img src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/Tiny-Video-Player-Tutorial-Image-04.png" /></center>

If you want to add some new videos or movies to your SD Card, you can move on to the <a href="../TSV-Converter-Tutorial/" alt="TinyScreen Video Converter Tutorial">**TSV Converter Tutorial**</a> that shows you exactly how to do that using the TSV (TinyScreen Video) Converter. To sum up using the TSV Converter, you simply need to download either the MacOS or Windows app, open it and then upload the files you want to convert to the .tsv format. The converted videos will automatically save to the same file location as the original video. The videos you would like to play on the Tiny Video Player then just need moved onto the SD card being used in the project.






