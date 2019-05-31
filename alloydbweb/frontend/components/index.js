import angular from "angular";

//Page Components
import ArtistComponent from "./artist/artist.component";
import ArtistsComponent from "./artists/artists.component";
import AlbumComponent from "./album/album.component";
import AlbumsComponent from "./albums/albums.component";
import ChartsComponent from "./charts/charts.component";
import DatabaseComponent from "./database/database.component";
import FreshComponent from "./fresh/fresh.component";
import FooterComponent from "./footer/footer.component";
import GenreComponent from "./genre/genre.component";
import GenresComponent from "./genres/genres.component";
import HistoryComponent from "./history/history.component";
import HomeComponent from "./home/home.component";
import IndexComponent from "./index/index.component";
import NavbarComponent from "./navbar/navbar.component";
import PlayingComponent from "./playing/playing.component";
import PlaylistComponent from "./playlist/playlist.component";
import PlaylistsComponent from "./playlists/playlists.component";
import PodcastsComponent from "./podcasts/podcasts.component";
import SideNavComponent from "./sidenav/sidenav.component";
import ConfigComponent from "./config/config.component";
import ConfigGeneralComponent from "./config/general/configGeneral.component";
import ConfigAlloyDbComponent from "./config/alloydb/configAlloyDb.Component";
import ConfigMediaPathsComponent from "./config/mediapaths/configMediaPaths.component";
import ConfigSabnzbdComponent from "./config/sabnzbd/configSabnzbd.component";
import ConfigSchedulerComponent from "./config/scheduler/configScheduler.component";
import ActivityComponent from "./activity/activity.component";
import ActivityGeneralComponent from "./activity/general/activityGeneral.component";
import ActivityQueueComponent from "./activity/queue/activityQueue.component";
import ActivityHistoryComponent from "./activity/history/activityHistory.component";
import ActivityBlacklistComponent from "./activity/blacklist/activityBlacklist.component";
import StarredComponent from "./starred/starred.component";
import StatusComponent from "./status/status.component";

export default angular
  .module("app.components", [])
  .component("artist", ArtistComponent)
  .component("artists", ArtistsComponent)
  .component("album", AlbumComponent)
  .component("albums", AlbumsComponent)
  .component("charts", ChartsComponent)
  .component("database", DatabaseComponent)
  .component("fresh", FreshComponent)
  .component("footbar", FooterComponent)
  .component("genre", GenreComponent)
  .component("genres", GenresComponent)
  .component("home", HomeComponent)
  .component("history", HistoryComponent)
  .component("index", IndexComponent)
  .component("navbar", NavbarComponent)
  .component("playing", PlayingComponent)
  .component("playlist", PlaylistComponent)
  .component("playlists", PlaylistsComponent)
  .component("podcasts", PodcastsComponent)
  .component("sidenav", SideNavComponent)
  .component("config", ConfigComponent)
  .component("configgeneral", ConfigGeneralComponent)
  .component("configalloydb", ConfigAlloyDbComponent)
  .component("configmediapaths", ConfigMediaPathsComponent)
  .component("configsabnzbd", ConfigSabnzbdComponent)
  .component("configscheduler", ConfigSchedulerComponent)
  .component("activity", ActivityComponent)
  .component("activitygeneral", ActivityGeneralComponent)
  .component("activityqueue", ActivityQueueComponent)
  .component("activityhistory", ActivityHistoryComponent)
  .component("activityblacklist", ActivityBlacklistComponent)
  .component("starred", StarredComponent)
  .component("status", StatusComponent)
  ;
