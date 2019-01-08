import angular from 'angular';

import PageContainer from './ui/pageContainer';
import PageToolbar from './ui/pageToolbar';

export default angular
  .module('app.directives', [])
  .directive('pagecontainer', PageContainer)
  .directive('pagetoolbar', PageToolbar)
;
