export default class MediaService {
  constructor($document) {
    "ngInject";
    var media = $document[0].getElementById('media-player');
    return media;
  }
}