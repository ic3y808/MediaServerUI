import angular from 'angular';

import ArtistComponent from './artist.component';
import ArtistsComponent from './artists.component';
import FreshComponent from './fresh.component';
import GenreComponent from './genre.component';
import GenresComponent from './genres.component';
import HomeComponent from './home.component';
import IndexComponent from './index.component';
import PlayingComponent from './playing.component';
import PlaylistComponent from './playlist.component';
import PlaylistsComponent from './playlists.component';
import PodcastsComponent from './podcasts.component';
import SettingsComponent from './settings.component';
import StarredComponent from './starred.component';
import StatusComponent from './status.component';

export default angular
  .module('app.components', [])
  .component('artist', ArtistComponent)
  .component('artists', ArtistsComponent)
  .component('fresh', FreshComponent)
  .component('genre', GenreComponent)
  .component('genres', GenresComponent)
  .component('home', HomeComponent)
  .component('index', IndexComponent)
  .component('playing', PlayingComponent)
  .component('playlist', PlaylistComponent)
  .component('playlists', PlaylistsComponent)
  .component('podcasts', PodcastsComponent)
  .component('settings', SettingsComponent)
  .component('starred', StarredComponent)
  .component('status', StatusComponent)
;
