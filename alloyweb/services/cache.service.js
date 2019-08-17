export default class Cache {
  constructor($cacheFactory) {
    "ngInject";
    return $cacheFactory("alloy");
  }
}