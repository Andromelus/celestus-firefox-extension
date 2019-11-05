(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  function getCelestusCodeInputs() {
    let frame = window[0].frames;
    let CodeA = frame.document.getElementById("CodeA");
    let CodeB = frame.document.getElementById("CodeB");
    let CodeC = frame.document.getElementById("CodeC");
    let CodeD = frame.document.getElementById("CodeD");
    let CodeE = frame.document.getElementById("CodeE");
    if (CodeA == null || CodeB == null || CodeC == null || CodeD == null || CodeE == null) {
      console.log("Erreur: impossible de trouver les inputs de code porte. (porte)");
      alert("Erreur: impossible de trouver les inputs de code porte. (porte)")
    } else {
      var inputCodes = [];
      inputCodes.push(CodeA);
      inputCodes.push(CodeB);
      inputCodes.push(CodeC);
      inputCodes.push(CodeD);
      inputCodes.push(CodeE);
      return inputCodes;
    }
  }

  // index used because Véo used similar ids in same page.
  // 0 = not random disrup ||| 1 = random disrup
  function getDisruptionCodeInputs(random, dg) {
    let frame = window[0].frames;
    let index;
    random == false ? (dg == false ? index = 0 : index = 2) : index = 1;
    let CodeA = frame.document.getElementsByName("CodeA")[index];
    let CodeB = frame.document.getElementsByName("CodeB")[index];
    let CodeC = frame.document.getElementsByName("CodeC")[index];
    let CodeD = frame.document.getElementsByName("CodeD")[index];
    let CodeE = frame.document.getElementsByName("CodeE")[index];
    if (CodeA == null || CodeB == null || CodeC == null || CodeD == null || CodeE == null) {
      console.log("Disruption: impossible de trouver les inputs de code.");
      alert("Erreur: impossible de trouver les inputs de code porte. (disruption) index = " + index);
    } else {
      var inputCodes = [];
      inputCodes.push(CodeA);
      inputCodes.push(CodeB);
      inputCodes.push(CodeC);
      inputCodes.push(CodeD);
      inputCodes.push(CodeE);
      return inputCodes;
    }
  }

  function fillCodeDestination(code, inputCodes) {
    for (let i = 0; i < inputCodes.length; i++) {
      inputCodes[i].value = code[i];
    }
  }

  function fillCodeTarget(code, inputCodes) {
    for (let i = 0; i < inputCodes.length; i++) {
      inputCodes[i].value = code[i];
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "fillCodeDestination") {
      fillCodeDestination(message.code, getCelestusCodeInputs());
    } else if (message.command === "fillCodeTarget") {
      fillCodeTarget(message.code, getDisruptionCodeInputs(message.random, message.dg));
    }
  });


})();