import angular from 'angular';

import ToolbarButton from './ui/toolbarbutton';
import ToolbarSeperator from './ui/toolbarseperator';
import NavButton from './ui/navbutton';
import AlbumsList from './ui/albumslist';
import ArtistList from './ui/artistlist';
import GenreList from './ui/genrelist';
import TrackList from './ui/tracklist';
import QueueList from './ui/sabnzbd/queuelist';
import BlackList from './ui/sabnzbd/blacklist';
import HistoryList from './ui/sabnzbd/historylist';
import JumpBar from './ui/jumpbar';
import DetailLabel from './ui/detaillabel';
import ExpandButton from './ui/expandbutton';
import PopoverButton from './ui/popoverbutton';
import CoverFlow from './ui/coverflow';

export default angular
  .module('app.directives', [])
  .directive('toolbarbutton', ToolbarButton)
  .directive('toolbarseperator', ToolbarSeperator)
  .directive('navbutton', NavButton)
  .directive('albumslist', AlbumsList)
  .directive('artistlist', ArtistList)
  .directive('genrelist', GenreList)
  .directive('tracklist', TrackList)
  .directive('queuelist', QueueList)
  .directive('historylist', HistoryList)
  .directive('blacklist', BlackList)
  .directive('jumpbar', JumpBar)
  .directive('detaillabel', DetailLabel)
  .directive('expandbutton', ExpandButton)
  .directive('popoverbutton', PopoverButton)
  .directive('coverflow', CoverFlow)
;
