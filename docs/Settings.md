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
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Volume:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: start; align-items: center;">
            <input id="volume" type="range" min="1" max="100" value="0" style="width:60%">
            <label id="volumeLabel">0%</label>
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Playback Mode:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Loop
            <input type="radio" id="playbackModeLoop" name="playbackMode" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Auto
            <input type="radio" id="playbackModeAuto" name="playbackMode" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Static Effect:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Off
            <input type="radio" id="staticEffectOff" name="static" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            On
            <input type="radio" id="staticEffectOn" name="static" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Show Timestamp:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Off
            <input type="radio" id="showTimestampOff" name="timestamp" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            On
            <input type="radio" id="showTimestampOn" name="timestamp" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Show Channel Number:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Off
            <input type="radio" id="showChannelNumberOff" name="channelNumber" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            On
            <input type="radio" id="showChannelNumberOn" name="channelNumber" style="width:17px; height:17px">
          </div>
        </div>
      </div>

      <div style="width:100%; flex:1; display:flex; flex-flow:row;">
        <div style="width:100%; flex:1; margin:16px; display:flex; flex-flow:row;">
          <div style="width:100%; flex:1; display:flex; flex-flow:column; justify-content: center; align-items: start; font-weight: bold;">
            Alphabetize Playback Order:
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            Off
            <input type="radio" id="alphabetizePlaybackOrderOff" name="playbackOrder" style="width:17px; height:17px">
          </div>
          <div style="width:100%; flex:1; display:flex; flex-flow:row; justify-content: center; align-items: center;">
            On
            <input type="radio" id="alphabetizePlaybackOrderOn" name="playbackOrder" style="width:17px; height:17px">
          </div>
        </div>
      </div>

    </div>

    <div id="buttonContainer" class="tx-hero" style="display:flex; flex-direction:column; justify-content:center; align-items:center">
      <button id="connectButton" title="update connect button" alt="Button brings up dialog to manually connect TV"
        class="md-button md-button--primary">
        Connect TV
      </button>
    </div>
  </section>


  <script type="module" src="../javascript/settings/main.js"></script>
</body>