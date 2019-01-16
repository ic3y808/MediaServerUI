module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    // object is passed while making the call
    template:
      '<div class="Table-tableContainer">' +
      '  <table class="Table-table">' +
      '	<thead>' +
      '	  <tr>' +
      '		<th label="Title" class="TableHeaderCell-headerCell Link-link ng-binding">' +
      '		  <svg aria-hidden="true" data-prefix="fas" data-icon="sort-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="font-size: 14px;" class="svg-inline--fa fa-sort-up fa-w-10 TableHeaderCell-sortIcon Icon-default">' +
      '			<path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>' +
      '		  </svg>' +
      '		</th>' +
      '		<th label="Release Date" class="TableHeaderCell-headerCell Link-link">Release Date</th>' +
      '		<th label="Rating" class="TableHeaderCell-headerCell Link-link">Rating</th>' +
      '		<th class="TableHeaderCell-headerCell">Status</th>' +
      '		<th class="TableHeaderCell-headerCell">' +
      '		  <button type="button" class="IconButton-button Link-link Link-link">' +
      '			<svg aria-hidden="true" data-prefix="fas" data-icon="cog" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="font-size: 12px;" class="svg-inline--fa fa-cog fa-w-16 Icon-default">' +
      '			  <path fill="currentColor" d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"></path>' +
      '			</svg>' +
      '		  </button>' +
      '		</th>' +
      '	  </tr>' +
      '	</thead>' +
      '	<tbody>' +
      '	<tr ng-repeat="album in data.albums" class="TableRow-row">' +
      '		<td class="AlbumRow-title TableRowCell-cell"><a href="/album/{{album.album_id}}" class="Link-link Link-to ng-binding">{{album.album}}</a></td>' +
      '		<td title="Monday, September 23 2013 6:00pm" class="RelativeDateCell-cell TableRowCell-cell">Sep 23 2013</td>' +
      '		<td class="TableRowCell-cell"><span title="0 (0 Votes)" class="StarRating-starRating">' +
      '			<div class="StarRating-backStar">' +
      '			  <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="font-size: 14px;" class="svg-inline--fa fa-star fa-w-18 Icon-default">' +
      '				<path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>' +
      '			  </svg>' +
      '			  <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="font-size: 14px;" class="svg-inline--fa fa-star fa-w-18 Icon-default">' +
      '				<path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>' +
      '			  </svg>' +
      '			  <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="font-size: 14px;" class="svg-inline--fa fa-star fa-w-18 Icon-default">' +
      '				<path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>' +
      '			  </svg>' +
      '			  <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="font-size: 14px;" class="svg-inline--fa fa-star fa-w-18 Icon-default">' +
      '				<path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>' +
      '			  </svg>' +
      '			  <svg aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="font-size: 14px;" class="svg-inline--fa fa-star fa-w-18 Icon-default">' +
      '				<path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>' +
      '			  </svg>' +
      '			</div></span></td>' +
      '		<td class="AlbumRow-status TableRowCell-cell"><span title="10 tracks total. 10 tracks with files." class="Label-label Label-success Label-medium"><span>10 / 10</span></span></td>' +
      '		<td class="AlbumSearchCell-AlbumSearchCell TableRowCell-cell">' +
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
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.text = scope.buttontext;
    }
  }
};
