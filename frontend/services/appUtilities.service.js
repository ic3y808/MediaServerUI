import CryptoJS from 'crypto-js';

export default class AppUtilities {
  constructor($rootScope, $timeout) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$rootScope.goBack = this.goBack;
    this.$rootScope.getBackgroundStyle = this.getBackgroundStyle;
    this.$rootScope.apply = this.apply;
    this.$rootScope.updateGridRows = this.updateGridRows;

    this.$rootScope.decryptPassword = this.decryptPassword;
    this.$rootScope.formatTime = this.formatTime;
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

  getBackgroundStyle(imagepath) {
    if(imagepath == undefined || imagepath == '' || imagepath == null) return '';
    return {
      'background-image': 'url(' + imagepath + ')'
    }
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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
      var bgUrl = img.replace('300x300', Math.round($('.art-backdrop').width()) + 'x' + Math.round($('.art-backdrop').height()));
      $('.art-backdrop').css('background-image', 'url(' + bgUrl + ')');
      this.apply();
    }
  }

  resetContentBackground() {
    $('.art-backdrop').css('background-image', 'url("")');
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
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  encryptPassword(pass) {
    return CryptoJS.AES.encrypt(pass, "12345").toString();

  }

  decryptPassword(pass) {
    return CryptoJS.AES.decrypt(pass, "12345").toString(CryptoJS.enc.Utf8);
  }

  //shuffle(array) {
  //  var currentIndex = array.length, temporaryValue, randomIndex;
  //  while (0 !== currentIndex) {
  //    randomIndex = Math.floor(Math.random() * currentIndex);
  //    var existing = array[currentIndex];
  //    var existing2 = array[randomIndex];
  //    if (existing && existing2) {
  //      while (true) {
  //        if (array[randomIndex].artist === array[currentIndex].artist)
  //          randomIndex = Math.floor(Math.random() * currentIndex);
  //        else break;
  //      }
  //    }
  //    currentIndex -= 1;
  //    temporaryValue = array[currentIndex];
  //    array[currentIndex] = array[randomIndex];
  //    array[randomIndex] = temporaryValue;
  //  }
  //  return array;
  //}
}