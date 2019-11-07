
document.getElementById("random").addEventListener("change", () => {
  if (document.getElementById("random").checked && document.getElementById("dg").checked) {
    document.getElementById("dg").checked = false;
  }

});
document.getElementById("dg").addEventListener("change", () => {
  if (document.getElementById("dg").checked && document.getElementById("random").checked) {
    document.getElementById("random").checked = false;
  }
});

let tsuMonthList = ['Onovahn', 'Celetahn', 'Feloahn', 'Koylahn', 'Jileahn', 'Dolahn', 'Stelahn', 'Pookahn', 'Volahn', 'Erehahn'];
let irlDayList = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
let irlMonthList = ["Janvier", "Févier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
function timestampToTsu(timestamp) {
  let year = Math.floor(timestamp / 86400);
  timestamp = timestamp - year * 86400;

  let month = Math.floor(timestamp / 8640);
  timestamp = timestamp - month * 8640;

  let day = Math.floor(timestamp / 216);
  month += 1;
  day += 1;
  return [year, month, day];
}

// On open details, indicates the current tsu date
document.getElementById("dates").addEventListener("toggle", () => {
  let tsu = timestampToTsu(Date.now() / 1000);
  document.getElementById("currentTsuDate").innerText = tsu[2] + " " + tsuMonthList[tsu[1] - 1] + "[" + tsu[1] + "] de l'an " + tsu[0] + " tsu";
});

document.getElementById("irlToTsu").addEventListener("click", () => {
  let irlDate = new Date(document.getElementById("irlDate").value)
  console.log(irlDate);
  let timestamp = irlDate.getTime() / 1000;
  let splitTime = document.getElementById("irlTime").value.split(":");
 /*  console.log(timestamp);
  //add seconds to timestamp
  timestamp+=splitTime[1] * 1000;
  console.log(timestamp);
  */

  //add hours to timestamp
  timestamp+=splitTime[0]*36000;
  console.log(timestamp); 
  let tsu = timestampToTsu(timestamp);
  document.getElementById("tsuConvertedDate").innerText = tsu[2] + " " + tsuMonthList[tsu[1] - 1] + "[" + tsu[1] + "] de l'an " + tsu[0] + " tsu";
});

document.getElementById("tsuToIrl").addEventListener("click", () => {
  let tsuDay = document.getElementById("tsuDay").value - 1;
  let tsuMonth = document.getElementById("tsuMonth").value - 1;
  let tsuYear = document.getElementById("tsuYear").value;

  let timestamp = tsuDay * 216;
  timestamp += tsuMonth * 8640;
  timestamp += tsuYear * 86400;
  let irlDate = new Date(timestamp * 1000);
  let irlDay = irlDate.getDay();
  let irlMonth = irlDate.getMonth();
  let irlYear = irlDate.getFullYear();
  let irlHour = irlDate.getHours();
  let irlMinutes = irlDate.getMinutes();
  document.getElementById("irlConvertedDate").innerText = irlDayList[irlDay] + " " + irlDate.getUTCDate() + " " + irlMonthList[irlMonth] + " " + irlYear + " " + irlHour + ":" + irlMinutes;
});


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
        random: document.getElementById("random").checked,
        dg: document.getElementById("dg").checked
      });
    }

    function splitCode(code) {
      return code.split("-");
    }

    /**
    * Just log the error to the console.
    */
    function reportError(error) {
      console.error(`${error}`);
    }

    /**
    * Get the active tab,
    * then call "fillCodeDestination()" or "fillCodeDestination()" as appropriate.
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
  console.error(`Failed to execute celestus content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({ file: "/content_scripts/celestify.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);