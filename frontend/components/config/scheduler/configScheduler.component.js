import CryptoJS from 'crypto-js';
class ConfigSchedulerController {
  constructor($scope, $rootScope, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('scheduler-controller');
    var that = this;
    $scope.settings = {};

    var that = this;
    var columnDefs = [
      {
        headerName: "Job",
        field: "name"
      },
      {
        headerName: "Running",
        field: "running",
        width: 100
      },
      {
        headerName: "Last Execution",
        field: "lastExecution"
      },
      {
        headerName: "Next Execution",
        field: "nextExecution"
      },
      {
        headerName: "Cron",
        field: "source"
      },
      {
        headerName: "Timezone",
        field: "timezone"
      },
      {
        headerName: "",
        field: "timezone",
        width: 100,
        cellRendererSelector: function (params) {
          var buttonDetails = {
            component: 'buttonRenderer',
            params: { values: ['Male', 'Female'] }
          };

          return buttonDetails;

        }
      }
    ];

    function buttonRenderer() {
    }

    buttonRenderer.prototype.init = function (params) {
      this.eGui = document.createElement('button');
      this.eGui.classList.add("btn");
      this.eGui.classList.add("btn-sm");
      this.eGui.classList.add("btn-block");
      this.eGui.classList.add("run-job-button");
      this.eGui.innerHTML = "Run Job";
    };

    buttonRenderer.prototype.getGui = function () {
      return this.eGui;
    };

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowHeight: 30,
      getRowNodeId: function (data) {
        return data.id;
      },

      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          MediaPlayer.tracks = $scope.tracks;

          var index = _.findIndex(MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          MediaPlayer.loadTrack(index);
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        setTimeout(function () {
            $scope.gridOptions.api.resetRowHeights();
        }, 500);
      },
      components: {
        buttonRenderer: buttonRenderer
      }
    };

    $scope.menuOptions = [
      // NEW IMPLEMENTATION
      {
        text: 'Object-Select',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.selected = $itemScope.item.name;
        }
      },
      {
        text: 'Object-Remove',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.items.splice($itemScope.$index, 1);
        }
      },
      // LEGACY IMPLEMENTATION
      ['Select', function ($itemScope, $event, modelValue, text, $li) {
        $scope.selected = $itemScope.item.name;
      }],
      null, // Dividier
      ['Remove', function ($itemScope, $event, modelValue, text, $li) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];

    $scope.ping = function () {
      var ping = that.AlloyDbService.getSchedulerStatus();
      if (ping) {
        ping.then(function (data) {
          that.Backend.debug('getSchedulerStatus');
          $scope.schedulerStatus = data;
          $scope.gridOptions.api.setRowData($scope.schedulerStatus);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
          that.AppUtilities.apply();
        });
      }

    };


    $scope.saveSettings = function () {
      //that.Backend.debug('save sabnzbd settings');
      //$rootScope.settings.sabnzbd = {};
      //$rootScope.settings.sabnzbd.sabnzbd_host = $scope.settings.sabnzbd_host;
      //$rootScope.settings.sabnzbd.sabnzbd_port = $scope.settings.sabnzbd_port;
      //$rootScope.settings.sabnzbd.sabnzbd_use_ssl = $scope.settings.sabnzbd_use_ssl;
      //$rootScope.settings.sabnzbd.sabnzbd_url_base = $scope.settings.sabnzbd_url_base;
      //$rootScope.settings.sabnzbd.sabnzbd_apikey = $scope.settings.sabnzbd_apikey;
      //$rootScope.settings.sabnzbd.sabnzbd_include_port_in_url = $scope.settings.sabnzbd_include_port_in_url;
      //$rootScope.settings.sabnzbd.sabnzbd_username = $scope.settings.sabnzbd_username;
      //$rootScope.settings.sabnzbd.sabnzbd_password = CryptoJS.AES.encrypt($scope.settings.sabnzbd_password, "12345").toString();
      //Backend.emit('save_settings', { key: 'sabnzbd_settings', data: $rootScope.settings.sabnzbd });
      //setTimeout(() => {
      //  Backend.emit('sabnzbd_reset_settings');
      //}, 300);
      //that.$rootScope.triggerConfigAlert("Saved!", 'success');
      //sabnzbdService.login();
    };


    $rootScope.$on('settingsReloadedEvent', function (event, settings) {

      //if (settings.key === 'sabnzbd_settings') {
      //  Backend.debug('sabnzbd settings reloading');
      //  $scope.settings.sabnzbd_host = $rootScope.settings.sabnzbd.sabnzbd_host;
      //  $scope.settings.sabnzbd_port = $rootScope.settings.sabnzbd.sabnzbd_port;
      //  $scope.settings.sabnzbd_url_base = $rootScope.settings.sabnzbd.sabnzbd_url_base;
      //  $scope.settings.sabnzbd_apikey = $rootScope.settings.sabnzbd.sabnzbd_apikey;
      //  $scope.settings.sabnzbd_use_ssl = $rootScope.settings.sabnzbd.sabnzbd_use_ssl;
      //  $scope.settings.sabnzbd_include_port_in_url = $rootScope.settings.sabnzbd.sabnzbd_include_port_in_url;
      //  $scope.settings.sabnzbd_username = $rootScope.settings.sabnzbd.sabnzbd_username;
      //  if ($rootScope.settings.sabnzbd.sabnzbd_password) {
      //    $scope.settings.sabnzbd_password = CryptoJS.AES.decrypt($rootScope.settings.sabnzbd.sabnzbd_password.toString(), "12345").toString(CryptoJS.enc.Utf8);
      //  }
      //  $scope.previewConnectionString();
      //  AppUtilities.hideLoader();
      //}


    });



    //Backend.emit('load_settings', 'sabnzbd_settings');

    $rootScope.$on('menuSizeChange', function (event, currentState) {

    });

    $rootScope.$on('windowResized', function (event, data) {

    });


    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.ping();
    });

    $scope.refreshIntereval = setInterval(function () {
      $scope.ping();
    }, 5000);

    $scope.uiRefreshIntereval = setInterval(function () {
      AppUtilities.apply();
    }, 1000);


    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
      clearInterval($scope.uiRefreshIntereval);
    });


  }
}

export default {
  bindings: {},
  controller: ConfigSchedulerController,
  templateUrl: '/template/configScheduler.jade'

};