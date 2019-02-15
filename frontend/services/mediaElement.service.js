export default class MediaElement {
  constructor($document, Logger) {
    "ngInject";
    var media = $document[0].getElementById('media-player');

    $('#media-player').on('error', function failed(e) {
      // audio playback failed - show a message saying why
      // to get the source of the audio element use $(this).src
      Logger.error('player error ' + e.target.error);
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          Logger.error('You aborted the video playback.');
          break;
        case e.target.error.MEDIA_ERR_NETWORK:
          Logger.error('A network error caused the audio download to fail.');
          break;
        case e.target.error.MEDIA_ERR_DECODE:
          Logger.error('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
          break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          Logger.error('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
          break;
        default:
          Logger.error('An unknown error occurred.');
          break;
      }
    });

    return media;
  }
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
});