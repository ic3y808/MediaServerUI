import './activityQueue.scss';
class ActivityQueueController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.Backend.debug('activity-queue-controller');
    var that = this;
    this.$scope.history = [];
    var columnDefs = [{
      headerName: "Name",
      field: "name"
    },
    {
      headerName: "ETA",
      field: "eta"
    },
    {
      headerName: "Category",
      field: "category"
    },
    {
      headerName: "Percentage",
      field: "percentage",
      valueFormatter: makePercent
    },
    {
      headerName: "Priority",
      field: "priority"
    },
    {
      headerName: "Size",
      field: "size",
      valueFormatter: humanFileSize
    },
    {
      headerName: "Status",
      field: "status"
    }
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      rowMultiSelectWithClick: true,
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

        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
      },
    };

    function makePercent(percent) {
      return percent.value + "%";
    };

    function humanFileSize(size) {
      var i = Math.floor(Math.log(size.value) / Math.log(1024));
      return (size.value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    };

    $scope.$on('$destroy', function () {
      clearInterval($scope.refreshIntereval);
    });

    $rootScope.$on('sabnzbdQueueResult', function (event, data) {
      that.Backend.debug('sabnzbd queue result');
      $scope.queue = JSON.parse(data);
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.setRowData($scope.queue);
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    $scope.refreshIntereval = setInterval(function () {
      Backend.emit('get_sabnzbd_queue');
    }, 1000);


  }
}

export default {
  bindings: {},
  controller: ActivityQueueController,
  templateUrl: '/template/activityQueue.jade',

};