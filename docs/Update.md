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

  .choose {
    width: 100%;
    display: flex;
    justify-content: space-around;
    max-width: 61rem;
    margin-right: auto;
    margin-left: auto;
    margin-top: 32px;
    padding: 0 .2rem;
  }

  .progress-bar-parent {
    display: flex;
    height: 25px;
    width: 50%;
    margin-bottom: 16px;
    border-radius: 8px;
    outline: 1px solid green;
  }

  .progress-bar {
    position: relative;
    width: 50%;
    height: 100%;
    background-color: rgb(0, 170, 0);
    border-radius: 8px;
  }

  .progress-bar-text {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
  }

  .item {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    box-sizing: border-box;
    padding: 0 15px;
    word-break: break-word;
    flex: 1;
    min-width: 0;
  }

  .item:hover {
    background-color: #526cfe47;
    border-radius: 8px;
  }
</style>

<!-- NOTE: elements in this page are referenced by javascript in project folder /docs/javascripts/streaming/stream.js -->
<body>
  <section id="updateSection" class="tx-container flex-center" style="width:100%; height:100%">
    <h2>TV Updating</h2>
    
    <p id="description" style="display:flex; text-align: center;">Update software on TinyTV 2, Mini, or DIY Kit</p>
    <div id="mainScreenBulletList">
      <ul style="list-style-type:decimal">
        <li>Click the button below to bring up the connection dialog</li>
        <li>Select "TinyUSB Serial" or "TinyScreen+"</li>
        <li>Click the "Connect" button in the dialog to start the update process</li>
      </ul>
    </div>

    <div id="progressBar" class="progress-bar-parent invisible">
      <div id="progressBarBar" class="progress-bar">
      </div>
      <div id="progressBarText" class="progress-bar-text">
        50%
      </div>
    </div>

    <p id="browserSupportError" style="color:red" class="invisible">Browser not supported: please use a Chromium based browser like Google Chrome, Microsoft Edge, Opera, Brave, etc.</p>


    <div id="tv2Step1VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tv2Step1Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tv2_manual_step1.webm" type="video/webm">
      </video>
    </div>

    <div id="tv2Step2VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tv2Step2Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tv2_manual_step2.webm" type="video/webm">
      </video>
    </div>

    <div id="tv2Step3VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tv2Step3Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tv2_manual_step3.webm" type="video/webm">
      </video>
    </div>


    <div id="tvminiStep1VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvminiStep1Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvmini_manual_step1.webm" type="video/webm">
      </video>
    </div>

    <div id="tvminiStep2VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvminiStep2Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvmini_manual_step2.webm" type="video/webm">
      </video>
    </div>

    <div id="tvminiStep3VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvminiStep3Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvmini_manual_step3.webm" type="video/webm">
      </video>
    </div>


    <div id="tvdiyStep1VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvdiyStep1Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvdiy_manual_step1.webm" type="video/webm">
      </video>
    </div>

    <div id="tvdiyStep2VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvdiyStep2Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvdiy_manual_step2.webm" type="video/webm">
      </video>
    </div>

    <div id="tvdiyStep3VideoContainer" style="height:60%; aspect-ratio:1/1; display:flex; flex-direction:row; justify-content:center; align-items:center;" class="invisible">
      <video id="tvdiyStep3Video" width="1000" height="1000" style="object-fit:contain; height:100%; width:100%;" loop muted>
        <source src="/videos/tvdiy_manual_step3.webm" type="video/webm">
      </video>
    </div>


    <div id="manualChoice" class="choose invisible">
      <div class="item">
        <a id="choseMini">
          <center><h2>TinyTV Mini</h2></center>
          <center><img src="/images/tinytvmini.svg" alt="TinyTV Mini" style="height:100px; object-fit:scale-down;" class="filter-svg"/></center>
        </a>
      </div>
    
      <div class="item">
        <a id="chose2">
          <center><h2>TinyTV 2 </h2></center>
          <center><img src="/images/tinytv2.svg" alt="TinyTV 2" style="height:200px; object-fit:scale-down;" class="filter-svg"/></center>
        </a>
      </div>

      <div class="item">
        <a id="choseDIY">
          <center><h2>TinyTV DIY Kit </h2></center>
          <center><img src="/images/tinytvdiy.svg" alt="TinyTV DIY Kit" style="height:180px; object-fit:scale-down;" class="filter-svg" /></center>
        </a>
      </div>
    </div>

    <h3 id="infoOutput" class="invisible">Detecting TV...</h3>

    <div id="buttonContainer" class="tx-hero" style="display:flex; flex-direction:column; justify-content:center; align-items:center">
      <div>
        <button id="connectButton" title="update connect button" alt="Button automatically connects TV or brings up dialog to manually connect it"
          class="md-button md-button--primary">
          Connect TV
        </button>
        <button id="contactusButton" title="go to TinyCircuits contact us form" alt="Button that goes to contact us form"
          class="md-button md-button--primary invisible" style="margin-left:8px" onclick="window.open('https://tinycircuits.com/pages/contact-us','_blank')">
          Contact us
        </button>
        <button id="manualUpdateButton" title="update connect button" alt="Button automatically connects TV or brings up dialog to manually connect it"
          class="md-button md-button--primary invisible" style="margin-left:8px">
          Manual Update
        </button>
      </div>

      <div style="display:flex; flex-flow:column">
        <div>
          <button id="backButton" title="go to the previous step" alt="Button that goes back a step"
            class="md-button md-button--primary invisible" style="margin-left:8px">
            Back
          </button>
          <button id="nextButton" title="go to the next step" alt="Button that goes to the next step"
            class="md-button md-button--primary invisible" style="margin-left:8px">
            Next
          </button>
        </div>
        <div style="display:flex; justify-content:center; align-items:center; margin-top:16px; text-decoration:underline; text-decoration-color:var(--md-typeset-a-color)">
          <a id="cancelUpdate" class="invisible" style="cursor:pointer">Cancel</a>
        </div>
      </div>

    </div>
  </section>


  <script type="module" src="/javascripts/update/main.js"></script>
</body>