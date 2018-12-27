import CryptoJS from 'crypto-js';

export default class AlloyDbService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }

  doLogin() {
    var that = this;

    if (this.$rootScope.settings && this.$rootScope.settings.alloydb && this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
      if (!this.isLoggedIn) {
        console.log('logging into alloydb')

        this.alloydb = new AlloyApi(this.$rootScope.settings.alloydb);

        this.alloydb.ping().then(function (result) {
          if (result) {
            if (result.status == 'success') {
              that.isLoggedIn = true;
              that.isLoggingIn = false;
            } else {
              that.isLoggingIn = false;
              that.isLoggedIn = false;
            }
            console.log('logging into alloydb is ' + result.status);
          }

          that.AppUtilities.broadcast('loginStatusChange', { service: 'alloydb', isLoggedIn: that.isLoggedIn });
        });


      }
    }
  }

  login() {
    this.doLogin();
  }

  ping() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.ping();
    else return false;
  }

  getLibraryInfo() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getLibraryInfo();
    else return false;
  }

  getMediaPaths() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMediaPaths();
    else return false;
  }

  getMusicFolders() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFolders();
    else return false;
  }

  getGenres() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getGenres();
    else return false;
  }

  getSongsByGenre(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSongsByGenre(id);
    else return false;
  }

  getArtist(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtist(id);
    else return false;
  }

  getArtistInfo(artist) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getArtistInfo(artist);
    else return false;
  }

  getTrackInfo(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getTrackInfo(id);
    else return false;
  }

  scanStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanStart();
    else return false;
  }

  scanStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanStatus();
    else return false;
  }

  scanCancel() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanCancel();
    else return false;
  }

  search(query) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.search(query);
    else return false;
  }

  star(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.star(id);
    else return false;
  }

  unstar(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unstar(id);
    else return false;
  }

  stream(id, quality) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.stream(id, quality);
    else return false;
  }

  download(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.download(id);
    else return false;
  }

  lastFmLogin(username, password) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.lastFmLogin(username, password);
    else return false;
  }

  scrobble(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobble(id);
    else return false;
  }

  scrobbleNowPlaying(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scrobbleNowPlaying(id);
    else return false;
  }
}