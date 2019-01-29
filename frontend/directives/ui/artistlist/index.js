module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'template/artistlist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      var testForLetter = function (character) {
        try {
          //Variable declarations can't start with digits or operators
          //If no error is thrown check for dollar or underscore. Those are the only nonletter characters that are allowed as identifiers
          eval("let " + character + ";");
          let regExSpecial = /[^\$_]/;
          return regExSpecial.test(character);
        }
        catch (error) {
          return false;
        }
      }
      scope.getId = function (name) {

        if (!testForLetter(name.charAt(0).toUpperCase())) return 'symbol';
        return name.charAt(0).toUpperCase()
      }

    }
  }
};
