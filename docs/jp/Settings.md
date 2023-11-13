---
hide:
  - navigation
  - toc
---

<!-- All that up there hides the navigation (left pane) and table of contents (right pane) -->

<style>
  /* Remove page title */
  h1 {
    visibility: hidden;
    position: absolute;
  }


  /* Convenience class for centering elements */
  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .invisible {
    position: absolute;
    visibility: hidden;
    opacity: 0;
  }


  /* Override/add to allow centering in page */
  .md-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Override and remove margin to allow complete control over centering elements, grow to max height */
  .md-main__inner {
    margin-top: 0px;
    flex-grow: 1;
    width: 100%;
  }

  .md-content__inner {
    margin-top: 0px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-top: 0;
  }

  .md-typeset h2 {
    margin: 0;
  }

  .md-typeset h3 {
    margin: 0px;
    margin-top: 8px;
    margin-bottom: 32px;
  }


  /* Copy of home.html to get buttons to match buttons */
  .tx-hero {
    margin: 8px 0px;
    color: var(--md-primary-bg-color);
  }

  .tx-hero .md-button {
    color: var(--md-primary-bg-color); /*outline button font and border color*/
    border-radius: 8px;
  }

  .tx-hero .md-button--primary {
    background-color: var(--md-typeset-a-color);
    color: black;
    border-color: var(--md-typeset-a-color);
    border-width: var(--border-btn,1px);
    border-radius: 8px;
  }

  /* Make buttons return to original color when not hovering after click */
  .tx-hero .md-button:hover:focus {
    background-color: var(--md-accent-fg-color);
    color: var(--md-default-bg-color);
    border-color: var(--md-accent-fg-color);
  }
  .tx-hero .md-button:hover {
    color: var(--md-default-bg-color);
  }
  .tx-hero .md-button:active {
    background-color: var(--md-accent-fg-color);
    color: var(--md-default-bg-color);
    border-color: var(--md-accent-fg-color);
  }
  .tx-hero .md-button:focus {
    background-color: var(--md-typeset-a-color);
    color: var(--md-default-bg-color);
    border-color: var(--md-typeset-a-color);
  }

  .tx-hero .md-button:disabled {
    cursor: not-allowed;
    filter: brightness(50%);
  }
</style>

<!-- NOTE: elements in this page are referenced by javascript in project folder /docs/javascripts/update/main.js -->
<body>
  <section id="updateSection" class="tx-container flex-center" style="width:100%; height:100%">
    <h2>TV Settings</h2>
    
    <p id="description" style="display:flex; text-align: center;">Change settings on TinyTV 2, Mini, or DIY Kit</p>

    <p id="browserSupportError" style="color:red" class="invisible">Browser not supported: please use a Chromium based browser like Google Chrome, Microsoft Edge, Opera, Brave, etc.</p>
  
    <div id="settings" style="width:55%; height:60%; display:flex; flex-flow:column;" class="invisible">

      <div style="width:100%; flex:1; display:flex; flex-flow:row; border-bottom: 1px solid var(--md-default-fg-color)">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Set the current volume of the TV" style="width:100%; flex:1; display:flex; text-wrap:nowrap; flex-wrap:nowrap; flex-flow:row; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Volume:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: start; align-items: center;">
            <input id="volume" type="range" min="0" max="6" value="0" style="width:60%">
            <label id="volumeLabel">0</label>
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Make videos loop without switching to the next automatically" style="width:100%; flex:1; display:flex; flex-wrap:nowrap; text-wrap:nowrap; flex-flow:row; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Loop Video:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="loopVideoOff" name="loopVideo" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="loopVideoOn" name="loopVideo" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Make all videos play in the background. When off, videos pause until switched back to" style="width:100%; flex:1; display:flex; text-wrap:nowrap; flex-flow:row; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Live Video:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="liveVideoOff" name="liveVideo" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="liveVideoOn" name="liveVideo" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Toggle ordering the video playlist by name (or number)" style="width:100%; flex:1; display:flex; flex-flow:row; text-wrap:nowrap; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Alphabetize Playback:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="alphabetizePlaybackOrderOff" name="playbackOrder" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="alphabetizePlaybackOrderOn" name="playbackOrder" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Toggle static effects that occur when the channel changes or the TV turns on" style="width:100%; flex:1; display:flex; text-wrap:nowrap; flex-flow:row; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Static Effect:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="staticEffectOff" name="static" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="staticEffectOn" name="static" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Toggle the channel number that's shown when the channel is changed" style="width:100%; flex:1; display:flex; flex-flow:row; text-wrap:nowrap; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Show Channel Number:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="showChannelNumberOff" name="channelNumber" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="showChannelNumberOn" name="channelNumber" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Toggle showing the volume slider that appears when the volume is changed" style="width:100%; flex:1; display:flex; flex-flow:row; text-wrap:nowrap; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Show Volume:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="showVolumeOff" name="showVolume" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="showVolumeOn" name="showVolume" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div title="Toggle between videos starting at a random spot on TV start up otherwise start at beginning of video" style="width:100%; flex:1; display:flex; text-wrap:nowrap; flex-wrap:nowrap; justify-content:start; align-items:center; font-weight:bold;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="min-width:20px; min-height:20px; width:20px; height:20px; margin:4px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Random Start Time:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            Off
            <input type="radio" id="randStartTimeOff" name="randStartTime" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: end; align-items: center;">
            On
            <input type="radio" id="randStartTimeOn" name="randStartTime" style="width:17px; height:17px">
          </div>
        </div>
      </div>

    </div>

    <div id="buttonContainer" class="tx-hero" style="display:flex; flex-direction:row; justify-content:center; align-items:center">
      <button id="formatButton" title="erase all videos and reformat internal SD card" style="margin-right:10px; background-color:red; border-color:red; visibility:hidden; position:absolute;" alt="Button that asks if user wants to format TV and erase all videos"
        class="md-button md-button--primary">
        Format TV
      </button>
      <button id="connectButton" title="update connect button" alt="Button brings up dialog to manually connect TV"
        class="md-button md-button--primary">
        Connect TV
      </button>
    </div>
  </section>


  <script type="module" src="../javascript/settings/main.js"></script>
</body>