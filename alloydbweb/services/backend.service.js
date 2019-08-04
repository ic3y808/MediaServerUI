import io from "socket.io-client";

export default class Backend {
  constructor($rootScope, AppUtilities, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    $rootScope.socket = io("//" + document.location.hostname + ":" + document.location.port);

    $rootScope.socket.on("ping", (data) => {
      if (data) { $rootScope.backend_ping = data; }
    });
    $rootScope.settings = { advanced_mode: false };
    $rootScope.settings.alloydb = {};

    $rootScope.saveSettings = () => {

      if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
        $rootScope.settings.alloydb.alloydb_lastfm_password = AppUtilities.encryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      }
      this.$rootScope.socket.emit("save_settings", { key: "alloydb_settings", data: $rootScope.settings.alloydb });

      if ($rootScope.settings.alloydb.alloydb_lastfm_password) {
        $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword($rootScope.settings.alloydb.alloydb_lastfm_password);
      }
      $rootScope.triggerConfigAlert("Saved!", "success");
    };

    $rootScope.loadSettings = () => {

    };

    var setup = () => {

      if (this.$rootScope.settings.alloydb.alloydb_host && this.$rootScope.settings.alloydb.alloydb_apikey) {
        this.AlloyDbService.login();
      }
    };

    $rootScope.socket.on("settings_saved_event", (settings) => {
      setup();
    });

    $rootScope.socket.on("settings_loaded_event", (settings) => {
      if (settings) {
        if (settings.key === "alloydb_settings") {
          $rootScope.settings.alloydb = settings.data;
          if (settings.data.alloydb_lastfm_password) {
            $rootScope.settings.alloydb.alloydb_lastfm_password = $rootScope.decryptPassword(settings.data.alloydb_lastfm_password);
          }
          console.log($rootScope.settings.alloydb);
          setup();
        }
        this.AppUtilities.apply();
      }
    });
  }
}