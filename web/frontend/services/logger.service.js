export default class Logger {
  constructor($rootScope) {
    "ngInject";
    this.$rootScope = $rootScope;

    this.$rootScope.$watch('socket', function (oldVal, newVal) {

    });
  }

  formMessage(type, data) {
    if(data){
      console.log(data);
      if (this.$rootScope.socket) {
        this.$rootScope.socket.emit('log', { message: data, method: type });
      }
    }
  }

  info(data) {
    this.formMessage('info', data);
  }

  debug(data) {
    this.formMessage('debug', data);
  }

  error(data) {
    this.formMessage('error', data);
  }
}