# TinyTV & Tiny Video Player Frequently Asked Questions
  
<center><img width="50%" height="50%" src="https://github.com/TinyCircuits/Wiki-Tutorials-Supporting-Files/raw/master/Kits/Tiny-Video-Player-Kit/images/TinyVideoPlayer-Product-Photo-01.1.png" /></center>

**If one of the below options doesn't answer your question(s), you can post on the <a href="http://forum.tinycircuits.com/index.php?board=10.0" target="_blank" alt="TinyTV Tinycircuits forum">TinyTV section of our forum</a>, or get in touch with <a href="https://tinycircuits.com/pages/contact-us" target="_blank" alt="Send a message to tinycircuits support on this page">customer support</a>.**

---

### Different Sized Screens
**Can I use a different sized screen with the TinyTV hardware?**

* Other screens that may be bigger, smaller or have different resolutions are unfortunately ***not*** be compatible with the TinyTV hardware. Screens vary greatly between different sizes and resolutions with their hardware pins. The supporting TinyTV hardware is custom to the 0.96" screen in the kit. We hope to offer TV's and video players with different sized screens in the future, but those screens will also require supporting hardware customized to their pins and size.

---

### Different Power Source
**How can I wire a different power source to continuously power the TinyTV?**

* There are a few different options to answer this question depending on the constraints of you or your project's needs - <a href="http://forum.tinycircuits.com/index.php?topic=2383.msg5221#msg5221" target="_blank" alt="forum post that discusses some options for different power sources for the TinyTV">**read through all the options in this forum post**</a>. Additionally, if you plan on permanently installing the TV in a diorama, miniature or otherwise, it may help to change the settings of the TV beforehand to auto-play and loop videos loaded on the SD Card when powered, check out the <a href="../TinyTV-Tutorial/" alt="TinyTV settings menu tutorial">**Settings Menu**</a> tutorial to learn more. 

---

### Electronics Inside TV
**Can I buy just the electronics inside the TV?**

* Yes! You can buy just the electronics inside the TinyTV by purchasing the <a href="https://tinycircuits.com/collections/kits-1/products/tiny-video-player-kit" target="_blank" alt="Tiny Video Player kit product page">**Tiny Video Player Kit**</a>. This kit does not include the <a href="https://tinycircuits.com/collections/components/products/tiny-remote" target="_blank" alt="TinyTV Tiny Remote product page">**Tiny Remote**</a>. 

---
### 3D Cases

**I want to create my own TV case - what resources do you have available?**

* There is a hardware diagram in the photo reel of the <a href="https://tinycircuits.com/collections/kits-1/products/tiny-video-player-kit" target="_blank" alt="Tiny Video Player kit product page">**Tiny Video Player Kit**</a> that displays the measurements of the assembled hardware that goes inside the TinyTV enclosure (including the TinyScreen+, MicroSD & Audio TinyShield, battery, and speaker).

* The STL files of the TinyTV enclosure are available from the <a href="https://tinycircuits.com/products/tinytv-diy-kit" target="_blank" alt="TinyTV product page">**TinyTV product page under DOWNLOADS**</a>. Additionally, there is a hardware diagram of the TV enclosure at the end of the TinyTV product page photo reel.

* The TV enclosures we distribute are printed using SLS Nylon with a raw finish by the <a href="https://www.jawstec.com/" target="_blank" alt="TinyTV 3D print service">**3D printing service JawsTec**</a>. We use professional grade printers due to the small size and level of detail put into the TinyTV enclosure, so please keep this in mind while using different 3D printers.

---
### No Display
**My screen is not working, how can I check if it has been damaged?**

* If no display is showing, it's possible that the screen could have been damaged during shipment or assembly. Or that the converted videos are somehow corrupted or have no visual from the original video. To check that the screen is working - try putting the TinyScreen+ board into bootloader mode. When correctly done, the TV will display "TinyScreen+ Bootloader Mode" on the screen.

* To put the hardware in bootloader mode, turn off the TV device (switch should be down), and then hold in the top-left button closest to the micro USB port while turning the unit back on. The most important part is keeping the button held in. Make sure the battery is charged and try this a few times to see if you can get anything to appear on the screen.
<center><img width="75%" height="75%" src="https://github.com/TinyCircuits/TinyCircuits-TinyTV-ASK4002/raw/master/images/TinyTV-bootloader-mode.jpg" /></center>
<center>*Bootloader mode*</center>

---

### Charging 
**How do I charge the TinyTV?**

* To charge the TV you will need a <a href="https://tinycircuits.com/collections/cables-connectors/products/micro-usb-cable-3-feet" target="_blank" alt="Micro USB B product page">**Micro USB B cable**</a>. Once you have the cable, you just need to plug it into the TV and a power source. You will know it is charging by the amber/yellow LED that turns on. The LED will turn off once it's fully charged.

---
### Autoplay & Loop Videos
**Is there a way to "loop" or "auto-play" the videos when the TV is turned on? Can I change the remote codes to use a different remote?**

* Yes! These features are easily edited by using the <a href="../TinyTV-Tutorial/" alt="TinyTV settings menu tutorial">**Settings Menu**</a>.

---
### Painting Tips
**What is the best paint to use when painting the TinyTV enclosure?**

* We covered a few different options, including using Sharpies, in our <a href="https://tinycircuits.com/blogs/news/customizing-your-diy-tinytv-kit" target="_blank" alt="TinyTV painting tutorial">**Painting and Customization tutorial**</a>. Check it out!

---
### SD Card
**I turn the TV on and get the message "Card not found!"**

* Make sure the SD Card is fully inserted. Then double-check that the SD & Audio TinyShield is fully joined to the TinyScreen+ board inside the TV - It may help to take the SD & Audio TinyShield completely out of the TV enclosure to try and reseat it.

**My new SD Card is not working with the TV.**

* Try reformatting the SD Card to FAT32 using an <a href="https://www.sdcard.org/downloads/formatter_4/" target="_blank" alt="SD Card Formatting Utility for Windows">**SD Card Formatting Utility**</a>. Make sure any important files on the SD Card are moved before starting this process - all files will be deleted during formatting. 

---
### Remote
**The remote is not working.**

* The remote works best when pointing it directly at the top of the TinyTV enclosure, as this is where the receiver is within the TV.
The remote will work around 12-16 inches away from the TV - this can change depending on the thickness of the TV enclosure and the amount of paint layered on the TV.

* Make sure the battery is fully seated in the battery holder. You can check that the remote is working by pressing one of the six white buttons while looking at the bottom of the remote. A red LED on the bottom of the board will flicker when a button is pressed.
You can test that the IR Receiver inside the TV is working by using any other IR Remote with the IR settings menu on the TinyTV (to get to the settings menu, turn the TV off with the power switch and while holding the top right TV button, turn the TV back on). <a href="../TinyTV-Tutorial/" alt="TinyTV settings menu tutorial">**Check out the full settings tutorial for more information.**</a>

---
### TV Buttons
**The buttons are not working when I press them on the TV case**

* If there is an issue with the buttons, it could be the way the hardware is seated in the case. We would recommend removing the hardware from the case gently, then try the buttons while the hardware is outside of the case to see if that works.

---
### Volume 
**How can I make the TV louder?**

* You should be able to get around 2-5x the sound by pressing and installing the speaker more firmly. To do this, take off the white sticker and adhere the speaker firmly against a flat surface (like on the inside of the TV's back panel). It may help to have the TinyTV on with a video playing and testing the audio while pressing on the speaker.

* The volume on the TV is limited by the volume of the video that is converted using the <a href="../TSV-Converter-Tutorial/"  alt="TinyScreen Video Converter Tutorial">**TSV Converter**</a> . Make sure that you are converting videos with louder volume, or consider editing the volume on a video with a utility like Photoshop or Affinity.

---
### Videos Not Playing
**Why are some of my videos are not playing on the TinyTV?**

* If the title of the video is too long, the videos will not display. Try keeping the titles of the videos shorter than 50 characters. "For example - this sentence is 50 characters long!"

* It's not common, but it is possible that the .mp4 video or .tsv converted video file is corrupted. Please make sure the video is playable on your computer before converting it, and then be sure to safely eject the SD Card from your computer to avoid any file corruption issues.

* The title includes characters/symbols outside of A-Z, 0-9 that are making the video unreadable by the program. The TV program cannot process accented or non-english letters.

* The source files could be protected by a DRM (digital rights management). Make sure you are converting videos that you have the rights to alter and convert.

---

### Some Channels are Empty or Glitching
**All of the videos I added are working, but there are some channels I switch to that are empty or glitch, what's going on?**

* There could be invisible files that your computer put on your SD Card! MacOS is most known for loading invisible files into any folder or location on your computer to organize files and upkeep some different OS functions. <a href="http://forum.tinycircuits.com/index.php?topic=2337.msg5024#msg5024" target="_blank" alt="forum post that discusses glitching videos produced by invisible files on MacOS">**Read more about this issue and how to fix it from this forum post**</a>.

