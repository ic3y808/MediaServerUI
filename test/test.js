var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

process.env.MODE = "prod"
//// requiring dependencies
var request = require('request');
//
describe('api tests', function () {
  this.timeout(0);
  // describe setup
  var env = global.setupEnv(before, after);

  function generateUrl(path) {
    return 'http://localhost:' + env.server.address().port + "/api/v1/" + path + "?api_key=" + process.env.API_KEY;
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
  })
});

