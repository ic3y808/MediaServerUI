var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

//// requiring dependencies
var request = require('request');
//
describe('api tests', function () {
  this.timeout(0);
  // describe setup
  var env = global.setupEnv(before, after);

  function getParmas(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }
  function generateUrl(path, params) {
    var result = 'http://localhost:' + env.server.address().port + "/api/v1/" + path + "?api_key=" + process.env.API_KEY;
    if (params) {
      result += "&" + getParmas(params);
    }
    return result;
  }

  describe('system', () => {
    // tests
    describe('ping', () => {
      it('should return success', function (done) {
        request(generateUrl('system/ping'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.status, 'string');
          result.status.should.equal('success');
          done();
        });
      });
    })
    // tests
    describe('scheduler', () => {
      it('should return an array', function (done) {
        request(generateUrl('system/scheduler'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'array');
          result.length.should.not.equal(0)
          done();
        });
      });
    });

    describe('license', () => {
      it('should return a License', function (done) {
        request(generateUrl('system/license'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.license, 'string');
          result.license.should.equal('test')
          done();
        });
      });
    });
    describe('stats', () => {
      it('should return Stats', function (done) {
        request(generateUrl('system/stats'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });
  });

  describe('browse', () => {
    describe('artists index', () => {
      it('should return an index artists', function (done) {
        request(generateUrl('browse/artists_index'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('artists', () => {
      it('should return artists', function (done) {
        request(generateUrl('browse/artists'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });
    describe('artist', () => {
      it('should return an artist', function (done) {
        request(generateUrl('browse/artist', { id: "12345" }), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('albums', () => {
      it('should return an albums', function (done) {
        request(generateUrl('browse/albums'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('album', () => {
      it('should return an album', function (done) {
        request(generateUrl('browse/album', { id: "12345" }), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('genres', () => {
      it('should return genres', function (done) {
        request(generateUrl('browse/genres', { id: "12345" }), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('genre', () => {
      it('should return an genre', function (done) {
        request(generateUrl('browse/genre', { id: "12345" }), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });
    describe('charts', () => {
      it('should return the charts', function (done) {
        request(generateUrl('browse/charts'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('fresh', () => {
      it('should return the charts', function (done) {
        request(generateUrl('browse/fresh'), (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          done();
        });
      });
    });

    describe('random tracks', () => {

      it('should return an array', function (done) {
        request({ url: generateUrl('browse/random_songs'), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.random, 'array');
          done();
        });
      });
    });

    describe('starred tracks', () => {

      it('should return an array', function (done) {
        request({ url: generateUrl('browse/starred'), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.starred, 'object');
          assert.typeOf(result.starred.tracks, 'array');
          assert.typeOf(result.starred.albums, 'array');
          assert.typeOf(result.starred.artists, 'array');
          done();
        });
      });
    });

    describe('history', () => {

      it('should return an array', function (done) {
        request({ url: generateUrl('browse/history'), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.history, 'array');
          done();
        });
      });
    });
  });

  describe('config', () => {
    describe('media paths', () => {

      it('should put a new media path in', function (done) {
        request({ url: generateUrl('config/mediapaths', { path: "C:\\test", display_name: "Test" }), method: 'PUT' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.result, 'string');
          result.result.should.equal('success');
          done();
        });
      });


      it('should return an array of media paths', function (done) {
        request({ url: generateUrl('config/mediapaths'), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          var result = JSON.parse(body);
          assert.typeOf(result, 'array');

          done();
        });
      });

      it('should delete a media path', function (done) {
        request({ url: generateUrl('config/mediapaths', { path: "C:\\test", display_name: "Test" }), method: 'DELETE' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.result, 'string');
          result.result.should.equal('success');
          done();
        });
      });
    });

    describe('file list', () => {
      it('should list system drives', function (done) {
        request({ url: generateUrl('config/file_list', { path: "" }), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'array');
          done();
        });
      });

      it('should list a directory', function (done) {
        request({ url: generateUrl('config/file_list', { path: "C:\\" }), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'array');
          done();
        });
      });

      it('should list a file parent', function (done) {
        request({ url: generateUrl('config/file_parent', { path: "C:\\" }), method: 'GET' }, (error, response, body) => {
          assert.typeOf(error, 'null');
          assert.typeOf(response, 'object');
          assert.typeOf(body, 'string');
          var result = JSON.parse(body);
          assert.typeOf(result, 'object');
          assert.typeOf(result.path, 'string');
          result.path.should.equal('');
          done();
        });
      });
    });
  });


});

