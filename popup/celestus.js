/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
  document.addEventListener("click", (e) => {
    /**
    * Remove the page-hiding CSS from the active tab,
    * send a "reset" message to the content script in the active tab.
    */
    function fillCodeDestination(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "fillCodeDestination",
        code: splitCode(document.getElementById("inputCodeDestination").value)
      });
    }
    function fillCodeTarget(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "fillCodeTarget",
        code: splitCode(document.getElementById("inputCodeTarget").value),
        random: document.getElementById("random").checked
      });
    }

    function splitCode(code) {
      return code.split("-");
    }

    /**
    * Just log the error to the console.
    */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
    * Get the active tab,
    * then call "beastify()" or "reset()" as appropriate.
    */
    if (e.target.classList.contains("fillDestination")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(fillCodeDestination)
        .catch(reportError);
    }
    if (e.target.classList.contains("fillTarget")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(fillCodeTarget)
        .catch(reportError);
    }
  });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({ file: "/content_scripts/celestify.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);