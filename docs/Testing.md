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

  /* Override and remove margin to allow complete control over centering elements */
  .md-main__inner{
    margin-top: 0px;
  }

  /* Copy of home.html to get buttons to match buttons */
  .tx-hero {
    margin: 32px 2.8rem;
    color: var(--md-primary-bg-color);
  }

  .tx-hero .md-button {
    /* margin-top: .5rem;
    margin-right: .5rem; */
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


<!-- NOTE: elements in this page are referenced by javascript in project folder /docs/javascripts/stream.js -->
<section id="streamScreen0" class="tx-container flex-center">
  <h2>TV Streaming</h2>
  <p id="description">Stream your computer to TinyTV 2 or Mini!</p>
  <p id="browserSupportError" style="color:red" class="invisible">Browser not supported: please use a Chromium based browser like Google Chrome, Microsoft Edge, Opera, Brave, etc.</p>
  <div class="tx-hero flex-center">
    <button id="streamConnectButton" title="stream connect button" alt="Button automatically connects TV or brings up dialog to manually connect it"
      class="md-button md-button--primary">
      Connect TV
    </button>
  </div>
</section>

<section id="streamScreen1" class="tx-container flex-center invisible">
  <h2>TV Streaming</h2>
  <p>Stream your computer to TinyTV 2 or Mini!</p>
  <div class="tx-hero flex-center">
    <button title="stream connect button" alt="Button automatically connects TV or brings up dialog to manually connect it"
      class="md-button md-button--primary">
      Connect TV
    </button>
  </div>
</section>