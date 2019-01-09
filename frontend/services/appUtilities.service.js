export default class AppUtilities {
  constructor($rootScope) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.$rootScope.goBack = this.goBack;
    this.$rootScope.apply = this.apply;

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

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  hideLoader() {
    $(".loader").css("display", "none");
    $(".main-content").css("display", "block");
  }

  setContentBackground(img) {
    if(img){
      var bgUrl = img.replace('300x300', Math.round($('.art-backdrop').width()) + 'x' + Math.round($('.art-backdrop').height()));
      $('.art-backdrop').css('background-image', 'url(' + bgUrl + ')');
      this.apply();
    }
  }

  resetContentBackground() {
    $('.art-backdrop').css('background-image', 'url("")');
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