import CryptoJS from 'crypto-js';

export default class SubsonicService {
  constructor($rootScope, AppUtilities) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.isLoggingIn = true;
    this.isLoggedIn = false;
  }



  
}