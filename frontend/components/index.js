import angular from 'angular';

import ArtistComponent from './artist.component';
import ArtistsComponent from './artists.component';
import AlbumComponent from './album.component';
import AlbumsComponent from './albums.component';
import FreshComponent from './fresh.component';
import FooterComponent from './footer/footer.component';
import GenreComponent from './genre.component';
import GenresComponent from './genres.component';
import HomeComponent from './home.component';
import IndexComponent from './index.component';
import NavbarComponent from './navbar/navbar.component';
import PlayingComponent from './playing.component';
import PlaylistComponent from './playlist.component';
import PlaylistsComponent from './playlists.component';
import PodcastsComponent from './podcasts.component';
import SideNavComponent from './sidenav/sidenav.component';
import ConfigComponent from './config/config.component';
import ConfigGeneralComponent from './config/general/configGeneral.component';
import ConfigSubsonicComponent from './config/subsonic/configSubsonic.component';
import ConfigSabnzbdComponent from './config/sabnzbd/configSabnzbd.component';
import ActivityComponent from './activity/activity.component';
import ActivityQueueComponent from './activity/queue/activityQueue.component';
import ActivityHistoryComponent from './activity/history/activityHistory.component';
import ActivityBlacklistComponent from './activity/blacklist/activityBlacklist.component';
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
  .component('header', NavbarComponent)
  .component('playing', PlayingComponent)
  .component('playlist', PlaylistComponent)
  .component('playlists', PlaylistsComponent)
  .component('podcasts', PodcastsComponent)
  .component('sidenav', SideNavComponent)
  .component('config', ConfigComponent)
  .component('configgeneral', ConfigGeneralComponent)
  .component('configsubsonic', ConfigSubsonicComponent)
  .component('configsabnzbd', ConfigSabnzbdComponent)
  .component('activity', ActivityComponent)
  .component('activityqueue', ActivityQueueComponent)
  .component('activityhistory', ActivityHistoryComponent)
  .component('activityblacklist', ActivityBlacklistComponent)
  .component('starred', StarredComponent)
  .component('status', StatusComponent)
;
