import CryptoJS from "crypto-js";
import moment from "moment";
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export default class AppUtilities {
  constructor($rootScope, $timeout, Logger) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.Logger = Logger;
    this.$rootScope.goBack = this.goBack;
    this.$rootScope.goForward = this.goForward;
    this.$rootScope.getBackgroundStyle = this.getBackgroundStyle;
    this.$rootScope.getLinkIcon = this.getLinkIcon;
    this.$rootScope.apply = this.apply;
    this.$rootScope.updateGridRows = this.updateGridRows;
    this.$rootScope.decryptPassword = this.decryptPassword;
    this.$rootScope.formatTime = this.formatTime;
    this.$rootScope.formatIsoTime = this.formatIsoTime;
    this.$rootScope.formatUnixTime = this.formatUnixTime;
    this.$rootScope.humanFileSize = this.humanFileSize;
  }

  broadcast(e, d) {
    this.$rootScope.$broadcast(e, d);
  }

  apply() {
    if (!this.$rootScope.$$phase) {
      //$digest or $apply
      this.$rootScope.$digest();
    }
  }

  goBack() {
    window.history.back();
  }

  goForward() {
    window.history.forward();
  }

  getBackgroundStyle(imagepath) {
    if (imagepath === undefined || imagepath === "" || imagepath === null) { return ""; }
    return {
      "background-image": "url(" + imagepath + ")"
    };
  }

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      const index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      const temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  showLoader() {
    $("#root.root").css("display", "none");
    $(".loader").css("display", "block");
  }

  hideLoader() {
    $(".loader").css("display", "none");
    $("#root.root").css("display", "initial");
  }

  setContentBackground(img) {
    if (img) {
      var bgUrl = img.replace("300x300", Math.round($(".art-backdrop").width()) + "x" + Math.round($(".art-backdrop").height()));
      $(".art-backdrop").css("background-image", "url(" + bgUrl + ")");
      this.apply();
    }
  }

  resetContentBackground() {
    $(".art-backdrop").css("background-image", "url(\"\")");
  }

  updateGridRows(gridOptions) {
    this.$timeout(function () {
      if (gridOptions && gridOptions.api) {
        gridOptions.api.redrawRows({
          force: true
        });
        gridOptions.api.doLayout();
        gridOptions.api.sizeColumnsToFit();
      }
    });
  }

  showNoRows(gridOptions) {
    if (gridOptions && gridOptions.api) {
      gridOptions.api.showNoRowsOverlay();
    }
  }

  setRowData(gridOptions, data) {
    if (gridOptions && gridOptions.api) {
      gridOptions.api.setRowData(data);
      this.updateGridRows(gridOptions);
    }
  }

  fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      Logger.info("Fallback: Copying text command was " + msg);
    } catch (err) {
      Logger.error("Fallback: Oops, unable to copy" + JSON.stringify(err));
    }

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {

    }, function (err) {
      console.error("Async: Could not copy text: ", err);
    });
  }

  humanFileSize(size) {
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (
      ((size / Math.pow(1024, i)).toFixed(2) * 1) +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }

  formatIsoTime(isoDate) {
    var time = moment(isoDate).format("LLLL");
    if (time.indexOf("Invalid date") !== -1) { time = "Never"; }
    return time;
  }

  formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

  formatUnixTime(seconds) {
    var dateString = moment.unix(seconds).format("MM/DD/YY hh:mm");
    return dateString;
  }

  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100, 10),
      seconds = parseInt((duration / 1000) % 60, 10),
      minutes = parseInt((duration / (1000 * 60)) % 60, 10),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  debounce(func, wait, immediate) {
    var timeout = null;
    return () => {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) { func.apply(context, args); }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args); }
    };
  }

  getRandom(arr, n) {
    var len = arr.length;
    var index = n;
    if (index > len) {
      return arr;
    } else {
      var result = new Array(index);
      var taken = new Array(len);

      while (index--) {
        var x = Math.floor(Math.random() * len);
        result[index] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    }
  }

  encryptPassword(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;

  }

  decryptPassword(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      this.Logger.error("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }

      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return output;
  }

  getLinkIcon(link) {
    var base = "icon-";
    switch (link.type) {
      case "discogs": { return base + link.type; }
      case "wikipedia": { return base + link.type; }
      case "myspace": { return base + link.type; }
      case "last": { return base + link.type; }
      case "wikidata": { return base + link.type; }
      case "allmusic": { return base + link.type; }
      case "facebook": { return base + link.type; }
      case "twitter": { return base + link.type; }
      case "beatport": { return base + link.type; }
      case "youtube": { return base + link.type; }
      case "bbc": { return base + link.type; }
      case "soundcloud": { return base + link.type; }
      case "bandcamp": { return base + link.type; }
      default: { return base + "external-link"; }
    }
  }
}

window.Parsley.addValidator("uppercase", {
  requirementType: "number",
  validateString: function (value, requirement) {
    var uppercases = value.match(/[A-Z]/g) || [];
    return uppercases.length >= requirement;
  },
  messages: {
    en: "Your password must contain at least (%s) uppercase letter."
  }
});

//has lowercase
window.Parsley.addValidator("lowercase", {
  requirementType: "number",
  validateString: function (value, requirement) {
    var lowecases = value.match(/[a-z]/g) || [];
    return lowecases.length >= requirement;
  },
  messages: {
    en: "Your password must contain at least (%s) lowercase letter."
  }
});

//has number
window.Parsley.addValidator("number", {
  requirementType: "number",
  validateString: function (value, requirement) {
    var numbers = value.match(/[0-9]/g) || [];
    return numbers.length >= requirement;
  },
  messages: {
    en: "Your password must contain at least (%s) number."
  }
});

//has special char
window.Parsley.addValidator("special", {
  requirementType: "number",
  validateString: function (value, requirement) {
    var specials = value.match(/[^a-zA-Z0-9]/g) || [];
    return specials.length >= requirement;
  },
  messages: {
    en: "Your password must contain at least (%s) special characters."
  }
});