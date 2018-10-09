export default class MediaService {
  constructor($document) {
    var media = $document[0].getElementById('media-player');
    return media;
  }
}