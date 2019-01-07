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

  getSchedulerStatus() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getSchedulerStatus();
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

  getMusicFoldersIndex() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getMusicFoldersIndex();
    else return false;
  }

  getRandomSongs() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getRandomSongs();
    else return false;
  }

  getFresh(daysBack) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getFresh(daysBack);
    else return false;
  }

  getAlbums() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbums();
    else return false;
  }

  getAlbum(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbum(id);
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

  getAlbumInfo(artist, album) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getAlbumInfo(artist, album);
    else return false;
  }

  getTrackInfo(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getTrackInfo(id);
    else return false;
  }

  getStarred() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getStarred();
    else return false;
  }

  scanFullStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanFullStart();
    else return false;
  }

  scanQuickStart() {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.scanQuickStart();
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

  addPlay(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.addPlay(id);
    else return false;
  }

  love(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.love(params);
    else return false;
  }

  unlove(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unlove(params);
    else return false;
  }

  star(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.star(params);
    else return false;
  }

  unstar(params) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.unstar(params);
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

  getCoverArt(id) {
    this.doLogin();
    if (this.isLoggedIn)
      return this.alloydb.getCoverArt(id);
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