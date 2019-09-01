import LazyLoad from "./lazy-load";
import StringToNumber from "./string-to-number";
import ToolbarButton from "./ui/toolbarbutton";
import ToolbarSeperator from "./ui/toolbarseperator";
import NavButton from "./ui/navbutton";
import ItemTable from "./ui/itemtable";
import ThumbList from "./ui/thumblist";
import CacheImg from "./cacheimg";
import ItemList from "./ui/itemlist";
import TrackList from "./ui/tracklist";
import FolderList from "./ui/folderlist";
import DetailLabel from "./ui/detaillabel";
import ExpandButton from "./ui/expandbutton";
import PopoverButton from "./ui/popoverbutton";
import LinkButton from "./ui/linkbutton";
import PlaylistSelector from "./ui/playlistselector";
import StarRatingLabel from "./ui/starratinglabel";
import SearchBar from "./ui/searchbar";
import ScrollSaver from "./ui/scrollsaver";
import VolumeSlider from "./ui/volumeslider";

export default angular
  .module("app.directives", [])
  .directive("cacheimg", CacheImg)
  .directive("stringToNumber", StringToNumber)
  .directive("lazyLoad", LazyLoad)
  .directive("toolbarbutton", ToolbarButton)
  .directive("toolbarseperator", ToolbarSeperator)
  .directive("navbutton", NavButton)
  .directive("itemtable", ItemTable)
  .directive("thumblist", ThumbList)  
  .directive("itemlist", ItemList)
  .directive("tracklist", TrackList)
  .directive("folderlist", FolderList)
  .directive("detaillabel", DetailLabel)
  .directive("expandbutton", ExpandButton)
  .directive("popoverbutton", PopoverButton)
  .directive("linkbutton", LinkButton)
  .directive("starratinglabel", StarRatingLabel)
  .directive("volumeslider", VolumeSlider)
  .directive("searchbar", SearchBar)
  .directive("scrollsaver", ScrollSaver)
  .directive("playlistselector", PlaylistSelector)
;
