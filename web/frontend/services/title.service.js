export default class Title {
  constructor() {
    "ngInject";
  }
  setTitle(newTitle, newDescription){
    if (document.title != newTitle) {
      document.title = newTitle;
      $("meta[name=\"description\"]").attr("content", newDescription);
    }
  }
};