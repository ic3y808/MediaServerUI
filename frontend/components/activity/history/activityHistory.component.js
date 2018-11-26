
class ActivityHistoryController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    //this.sabnzbdService = sabnzbdService;
    this.Backend.debug('activity-history-controller');
    var that = this;
    this.$scope.history= [];
    var columnDefs = [{
      headerName: "Name",
      field: "name"
    },
    {
      headerName: "Category",
      field: "category"
    },
    {
      headerName: "Completeness",
      field: "completeness"
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

    $rootScope.$on('sabnzbdHistoryResult', function (event, data) {
      that.Backend.debug('sabnzbd history result');
      $scope.history = JSON.parse(data);
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.setRowData($scope.history);
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
      that.AppUtilities.apply();
      that.AppUtilities.hideLoader();
    });

    Backend.emit('get_sabnzbd_history');
  }
}

export default {
  bindings: {},
  controller: ActivityHistoryController,
  templateUrl: '/template/activityHistory.pug',

};