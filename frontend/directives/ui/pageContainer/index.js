import './style.scss';


class PageContainerController {
  constructor(Backend) {
    "ngInject";
    this.Backend = Backend;
    this.Backend.debug('PageContainerController');
  }

}

export default {
  bindings: {},
  controller: PageContainerController,
  templateUrl: '/template/pagecontainer.jade'
};