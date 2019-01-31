import angular from 'angular';

//Page Components
import ArtistComponent from './artist/artist.component';
import ArtistsComponent from './artists/artists.component';
import AlbumComponent from './album/album.component';
import AlbumsComponent from './albums/albums.component';
import FreshComponent from './fresh/fresh.component';
import FooterComponent from './footer/footer.component';
import GenreComponent from './genre/genre.component';
import GenresComponent from './genres/genres.component';
import HomeComponent from './home/home.component';
import IndexComponent from './index/index.component';
import NavbarComponent from './navbar/navbar.component';
import PlayingComponent from './playing/playing.component';
import PlaylistComponent from './playlist/playlist.component';
import PlaylistsComponent from './playlists/playlists.component';
import PodcastsComponent from './podcasts/podcasts.component';
import SideNavComponent from './sidenav/sidenav.component';
import ConfigComponent from './config/config.component';
import ConfigGeneralComponent from './config/general/configGeneral.component';
import ConfigAlloyDbComponent from './config/alloydb/configAlloyDb.Component';
import ConfigSabnzbdComponent from './config/sabnzbd/configSabnzbd.component';
import ConfigSchedulerComponent from './config/scheduler/configScheduler.component';
import ActivityComponent from './activity/activity.component';
import ActivityGeneralComponent from './activity/general/activityGeneral.component';
import ActivityQueueComponent from './activity/queue/activityQueue.component';
import ActivityHistoryComponent from './activity/history/activityHistory.component';
import ActivityBlacklistComponent from './activity/blacklist/activityBlacklist.component';
import StarredComponent from './starred/starred.component';
import StatusComponent from './status/status.component';

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
  .component('configalloydb', ConfigAlloyDbComponent)
  .component('configsabnzbd', ConfigSabnzbdComponent)
  .component('configscheduler', ConfigSchedulerComponent)
  .component('activity', ActivityComponent)
  .component('activitygeneral', ActivityGeneralComponent)
  .component('activityqueue', ActivityQueueComponent)
  .component('activityhistory', ActivityHistoryComponent)
  .component('activityblacklist', ActivityBlacklistComponent)
  .component('starred', StarredComponent)
  .component('status', StatusComponent)
;
