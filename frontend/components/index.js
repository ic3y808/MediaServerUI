import angular from 'angular';

import ArtistComponent from './artist.component';
import ArtistsComponent from './artists.component';
import AlbumComponent from './album.component';
import AlbumsComponent from './albums.component';
import FreshComponent from './fresh.component';
import FooterComponent from './footer.component';
import GenreComponent from './genre.component';
import GenresComponent from './genres.component';
import HomeComponent from './home.component';
import IndexComponent from './index.component';
import NavComponent from './nav.component';
import PlayingComponent from './playing.component';
import PlaylistComponent from './playlist.component';
import PlaylistsComponent from './playlists.component';
import PodcastsComponent from './podcasts.component';
import SideNavComponent from './sidenav.component';
import SubsonicSettingsComponent from './subsonic.settings.component';
import StarredComponent from './starred.component';
import StatusComponent from './status.component';

export default angular
  .module('app.components', [])
  .component('artist', ArtistComponent)
  .component('artists', ArtistsComponent)
  .component('album', AlbumComponent)
  .component('albums', AlbumsComponent)
  .component('fresh', FreshComponent)
  .component('footer', FooterComponent)
  .component('genre', GenreComponent)
  .component('genres', GenresComponent)
  .component('home', HomeComponent)
  .component('index', IndexComponent)
  .component('header', NavComponent)
  .component('playing', PlayingComponent)
  .component('playlist', PlaylistComponent)
  .component('playlists', PlaylistsComponent)
  .component('podcasts', PodcastsComponent)
  .component('sidenav', SideNavComponent)
  .component('subsonicsettings', SubsonicSettingsComponent)
  .component('starred', StarredComponent)
  .component('status', StatusComponent)
;
