
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
import LoginComponent from "./login/login.component";
import NavbarComponent from "./navbar/navbar.component";
import NeverPlayed from "./neverPlayed/neverPlayed.component";
import PlayingComponent from "./playing/playing.component";
import PlaylistComponent from "./playlist/playlist.component";
import PlaylistsComponent from "./playlists/playlists.component";
import PodcastsComponent from "./podcasts/podcasts.component";
import SideNavComponent from "./sidenav/sidenav.component";
import ConfigComponent from "./config/config.component";
import ConfigGeneralComponent from "./config/general/configGeneral.component";
import ConfigAlloyDbComponent from "./config/alloydb/configAlloyDb.Component";
import ConfigMediaPathsComponent from "./config/mediapaths/configMediaPaths.component";
import ConfigSchedulerComponent from "./config/scheduler/configScheduler.component";
import ConfigSharesComponent from "./config/shares/configShares.component";
import RegisterComponent from "./register/register.component";
import ShareComponent from "./share/share.component";
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
  .component("login", LoginComponent)
  .component("navbar", NavbarComponent)
  .component("neverplayed", NeverPlayed)
  .component("playing", PlayingComponent)
  .component("playlist", PlaylistComponent)
  .component("playlists", PlaylistsComponent)
  .component("podcasts", PodcastsComponent)
  .component("sidenav", SideNavComponent)
  .component("config", ConfigComponent)
  .component("configgeneral", ConfigGeneralComponent)
  .component("configalloydb", ConfigAlloyDbComponent)
  .component("configmediapaths", ConfigMediaPathsComponent)
  .component("configscheduler", ConfigSchedulerComponent)
  .component("configshares", ConfigSharesComponent)
  .component("register", RegisterComponent)
  .component("share", ShareComponent)
  .component("starred", StarredComponent)
  .component("status", StatusComponent)
  ;
