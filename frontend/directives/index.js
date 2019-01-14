import angular from 'angular';

import ToolbarButton from './ui/toolbarbutton';
import ToolbarSeperator from './ui/toolbarseperator';
import NavButton from './ui/navbutton';
import AlbumList from './ui/albumlist';
import DetailLabel from './ui/detaillabel';
import ExpandButton from './ui/expandbutton';
import PopoverButton from './ui/popoverbutton';

export default angular
  .module('app.directives', [])
  .directive('toolbarbutton', ToolbarButton)
  .directive('toolbarseperator', ToolbarSeperator)
  .directive('navbutton', NavButton)
  .directive('albumlist', AlbumList)
  .directive('detaillabel', DetailLabel)
  .directive('expandbutton', ExpandButton)
  .directive('popoverbutton', PopoverButton)
;
