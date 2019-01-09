import angular from 'angular';

import ToolbarButton from './ui/toolbarbutton';
import ToolbarSeperator from './ui/toolbarseperator';
import AlbumList from './ui/albumlist';

export default angular
  .module('app.directives', [])
  .directive('toolbarbutton', ToolbarButton)
  .directive('toolbarseperator', ToolbarSeperator)
  .directive('albumlist', AlbumList)
;
