---
hide:
  - navigation
---

# TinyTV Help & FAQ Page


## Charging TinyTV's

You can use a USB power cable to connect your TinyTV to your computer or another power source. A orange charging LED will turn on when your TinyTV is charging. The orange LED will turn off when your TinyTV is fully charged.


## Can I expand the storage?

All TinyTVs come with an 8GB micro SD Card pre-loaded with some demo videos. The micro SD Card is removable only with the TinyTV DIY Kit using tweezers and the cutout slot on the bottom of the TV case. The TinyTV 2 and TinyTV Mini sets have the micro SD Card built in without ready-access - ***While it's theoretically possible to disassemble these models and put in a larger SD Card, we don't recommend or support this since it could damage the electronics without proper caution or equipment.***

---

## "The remote does not turn the TV on?"

TinyTV 2 and Mini can only be turned on using the remote for up to two minutes after quickly pressing the power button. There are two "off modes" the TVs have, soft off and hard off:

  * **Soft off**: When quickly pressing the power button to turn the TV off it goes into **soft off** mode. The remote can be used for up to two minutes to turn it back on.
  * **Hard off**: After five minutes in **soft off** mode the TV cannot be turned back on using the remote. This mode conserves the most battery life. Quickly press the power button to turn it back on.

  _NOTE: Before version 1.2.1 TinyTV 2 and Mini would shutoff in two minutes. The time it takes to automatically shutoff in 'Soft Off' mode can be adjusted in the 'settings.txt' file on the TV using 'powerOffSecs'_

---

## "Playback error"

<center>
<img src="../images/PlaybackErrorSplash_64x64.png" alt="TinyTV Playback error TinyTV Mini" />
<img src="../images/PlaybackErrorSplash_96x64.png" alt="TinyTV Playback error TinyTV DIY Kit" />
<img src="../images/PlaybackErrorSplash_216x135.png" alt="TinyTV Playback error TinyTV 2" />
</center>

A playback error will occur when a video file cannot be loaded, or if playback cannot continue for the given file. Check your storage on your TinyTV and make sure the videos have been converted with the correct TinyTV Model, and that all the files have been converted using the TinyTV Converter Application. The TinyTV video formats are custom to the hardware, so you will need to use our free converter.

---

## "No Card" or "Storage card not detected"

<center>
<img src="../images/NoCardSplash_64x64.png" alt="TinyTV No card error TinyTV Mini" />
<img src="../images/NoCardSplash_96x64.png" alt="TinyTV No card error TinyTV DIY Kit" />
<img src="../images/NoCardSplash_216x135.png" alt="TinyTV No card error TinyTV 2" />
</center>

The SD Card in the hardware is not detectable - this error occurs when no SD Card is inserted, or if the SD Card is loose on the contacts. Try re-inserting the SD Card if possible.

---

## "Storage error" or "A storage malfunction occurred"

<center>
<img src="../images/StorageErrorSplash_64x64.png" alt="TinyTV Storage error TinyTV Mini" />
<img src="../images/StorageErrorSplash_96x64.png" alt="TinyTV Storage error TinyTV DIY Kit" />
<img src="../images/StorageErrorSplash_216x135.png" alt="TinyTV Storage error TinyTV 2" />
</center>


A few things can trigger a storage malfunction error. This error occurs when the SD Card is detected, but the filesystem is damaged or unrecognizable. This can also happen if your file names include unexpected, or special, characters - if you see this error, try changing the names of your files on the SD Card.

---

## "TV does not show up as a USB device on computer"
Try the following:

  * Different cables. Some USB-C cables only allow for charging devices, try a cable that you know you have used for transferring files or pictures from another device.
  * Turn the TV on by pressing the top button for TinyTV 2 and the top middle button on TinyTV Mini

---

## "How are files sorted?"
Files are sorted like in Windows in ascending order. Numbers at the start of a filename are prioritized over filenames with just letters. For example:
0.avi
1.avi
22.avi
A.avi
B.avi
L.avi

---

## "How many videos can I put on my TV?"
  * **TinyTV 2 and Mini**: 100 videos
  * **TinyTV DIY Kit**: 25 videos

---

## "How long can filenames be?"
  * **TinyTV 2 and Mini**: 150 characters
  * **TinyTV DIY Kit**: 50 characters