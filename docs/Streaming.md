---
hide:
  - navigation
  - toc
---

<!-- All that up there hides the navigation (left pane) and table of contents (right pane) -->


<style>
  /* Remove page title */
  h1{
    visibility: hidden;
    position: absolute;
  }

  /* Convenience class for centering elements */
  .flex-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .invisible{
    position: absolute;
    visibility: hidden;
    opacity: 0;
  }


  /* Override/add to allow centering in page */
  .md-main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Override and remove margin to allow complete control over centering elements, grow to max height */
  .md-main__inner{
    margin-top: 0px;
    flex-grow: 1;
    width: 100%;
  }

  .md-grid{
    margin-left: 0;
    margin-right: 0;
    max-width: 100%;
  }

  .md-content__inner{
    margin-top: 0px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }


  /* Copy of home.html to get buttons to match buttons */
  .tx-hero {
    margin: 32px 2.8rem;
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

  .tx-hero .md-button:focus,
  .tx-hero .md-button:hover:enabled {
      background-color: var(--md-accent-fg-color); /* BG color on hover */
      color: var(--md-default-bg-color); /*Text color on hover*/
      border-color: var(--md-accent-fg-color); /*border color on hover*/
  }

  .tx-hero .md-button:disabled{
      cursor: not-allowed;
      filter: brightness(50%);
  }
</style>

<!-- NOTE: elements in this page are referenced by javascript in project folder /docs/javascripts/streaming/stream.js -->
<body>
  <section id="streamScreen0" class="tx-container flex-center" style="width:100%; height:100%">
    <h2>TV Streaming</h2>
    
    <p id="description">Stream your computer to TinyTV 2 or Mini!</p>
    <p id="browserSupportError" style="color:red" class="invisible">Browser not supported: please use a Chromium based browser like Google Chrome, Microsoft Edge, Opera, Brave, etc.</p>
    <p id="audioSupportMessage">(Audio currently not supported)</p>

    <div id="outputPreview" style="width:70%; height:70%; display:flex; flex-direction:row; justify-content:center;" class="invisible">
      <canvas id="outputCanvas" width=216 height=135 style="image-rendering:pixelated; object-fit:contain;"></canvas>
    </div>
    

    <div class="tx-hero" style="display:flex; flex-direction:row; justify-content:center; align-items:center">
      <button id="streamConnectButton" title="stream connect button" alt="Button automatically connects TV or brings up dialog to manually connect it"
        class="md-button md-button--primary">
        Connect TV
      </button>
      <div id="cropContainer" class="invisible" style="background-color:var(--md-primary-fg-color); border-radius:8px; margin-left:8px; display:flex; justify-content:center; align-items:center; padding:8px;">
        <label style="display:flex; flex-direction:column; margin-left:8px; margin-right:8px;">
          <span class="ml-1 text-lg">Contain</span> 
          <input id="inputContain" type="radio" name="radio-10" class="radio radio-sm radio-primary" checked />
        </label>
        <label style="display:flex; flex-direction:column; margin-left:8px; margin-right:8px;">
          <span class="ml-1 text-lg">Cover</span> 
          <input id="inputCover" type="radio" name="radio-10" class="radio radio-sm radio-primary" />
        </label>
        <label style="display:flex; flex-direction:column; margin-left:8px; margin-right:8px;">
          <span class="ml-1 text-lg">Fill</span> 
          <input id="inputFill" type="radio" name="radio-10" class="radio radio-sm radio-primary" />
        </label>
      </div>
    </div>

    <h3 id="infoOutput" class="invisible">Detecting TV...</h3>
  </section>


  <script type="module" src="/javascripts/streaming/main.js"></script>
</body>