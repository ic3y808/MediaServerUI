module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    // object is passed while making the call
    template:
      '<div class="ArtistTable-tableContainer">' +
      '  <table class="ArtistTable-table">' +
      '	<thead>' +
      '	  <tr>' +
      '		<th label="Artist Name" class="TableHeaderCell-headerCell Link-link">Artist Name</th>' +
      '		<th label="Tracks" class="TableHeaderCell-headerCell Link-link">Tracks</th>' +
      '		<th label="Starred" class="TableHeaderCell-headerCell Link-link">Starred</th>' +
      '	  </tr>' +
      '	</thead>' +
      '	<tbody>' +
      '	<tr ng-repeat="artist in data" class="ArtistTableRow-row">' +
      '		<td  id="{{getId(artist.base_path)}}" class="AlbumRow-title ArtistTableRowCell-cell"><a href="/artist/{{artist.base_id}}" class="Link-link ng-binding">{{artist.base_path}}</a></td>' +
      '		<td class="AlbumRow-status ArtistTableRowCell-cell"><span title="" class="Label-label Label-medium"><span>{{artist.track_count}}</span></span></td>' +
      '		<td class="ArtistCell-StarredCell ArtistTableRowCell-cell">' +
      '		  <button type="button" class="IconButton-button Link-link Link-link">' +
      '		    <i aria-hidden="true" data-prefix="fas" class="fa fa-star-o fa-w-16 Icon-default"></i>' +
      '		  </button>' +
      '		</td>' +
      '	  </tr>' +
      '	</tbody>' +
      '  </table>' +
      '</div>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.getId = function(name){
        return name.charAt(0).toUpperCase()
      }
    }
  }
};
