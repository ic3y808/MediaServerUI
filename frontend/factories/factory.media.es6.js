MediaFactory.$inject = ['$document'];


function MediaFactory($document) {
  var media = $document[0].getElementById('media-player');
  return media;
};

export default MediaFactory;