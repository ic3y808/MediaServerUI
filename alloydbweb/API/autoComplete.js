var dataAttribute = "data-result";
var select = {
  resultsList: "autoComplete_results_list",
  result: "autoComplete_result",
  highlight: "autoComplete_highlighted",
  divider: "autoComplete_divider",
};
var getInput = function getInput(selector) {
  return typeof selector === "string" ? document.querySelector(selector) : selector();
};
var createResultsList = function createResultsList(renderResults) {
  var resultsList = document.getElementById(select.resultsList);
  if (renderResults.container) {
    select.resultsList = renderResults.container(resultsList) || select.resultsList;
  }
  resultsList.setAttribute("id", select.resultsList);
  // renderResults.destination.insertAdjacentElement(renderResults.position, resultsList);

  return resultsList;
};
var highlight = function highlight(value) {
  return "<span class=".concat(select.highlight, ">").concat(value, "</span>");
};
var navigation = function navigation(selector, resultsList) {
  var input = getInput(selector);
  var first = resultsList.firstChild;
  document.onkeydown = function (event) {
    var active = document.activeElement;
    switch (event.keyCode) {
      case 38:
        if (active !== first && active !== input) {
          active.previousSibling.focus();
        } else if (active === first) {
          input.focus();
        }
        break;
      case 40:
        if (active === input && resultsList.childNodes.length > 0) {
          first.focus();
        } else if (active !== resultsList.lastChild) {
          active.nextSibling.focus();
        }
        break;
    }
  };
};
var clearResults = function clearResults(resultsList) {
  return resultsList.innerHTML = "";
};
var getSelection = function getSelection(field, resultsList, callback, resultsValues) {
  var results = resultsList.querySelectorAll(".".concat(select.result));


  results.forEach((selection) => {
    ["mousedown", "keydown"].forEach(function (eventType) {
      selection.addEventListener(eventType, function (event) {
        if (eventType === "mousedown" || event.keyCode === 13 || event.keyCode === 39) {
          callback({
            event: event,
            query: getInput(field) instanceof HTMLInputElement ? getInput(field).value : getInput(field).innerHTML,
            matches: resultsValues.matches,
            results: resultsValues.list,
            selection: resultsValues.list.find(function (value) {
              var resValue = value;
              return resValue.id === event.target.closest(".".concat(select.result)).getAttribute(dataAttribute);
            })
          });
          clearResults(resultsList);
        }
      });
    });
  });
};
var autoCompleteView = {
  getInput: getInput,
  createResultsList: createResultsList,
  highlight: highlight,
  navigation: navigation,
  clearResults: clearResults,
  getSelection: getSelection
};

export default class AutoComplete {
  constructor(config) {
    this.selector = config.selector || "#autoComplete";
    this.data = {
      src: function src() {
        return typeof config.data.src === "function" ? config.data.src() : config.data.src;
      },
      key: config.data.key,
      cache: typeof config.data.cache === "undefined" ? true : config.data.cache
    };
    this.searchEngine = config.searchEngine === "loose" ? "loose" : "strict";
    this.threshold = config.threshold || 0;
    this.debounce = config.debounce || 0;
    this.resultsList = {
      render: config.resultsList && config.resultsList.render ? config.resultsList.render : false,
      view: config.resultsList && config.resultsList.render ? autoCompleteView.createResultsList({
        container:
          config.resultsList && config.resultsList.container
            ? config.resultsList.container
            : false,
        destination:
          config.resultsList && config.resultsList.destination
            ? config.resultsList.destination
            : autoCompleteView.getInput(this.selector),
        position:
          config.resultsList && config.resultsList.position
            ? config.resultsList.position
            : "afterend",
        element: config.resultsList && config.resultsList.element ? config.resultsList.element : "ul"
      }) : null
    };
    this.sort = config.sort || false;
    this.placeHolder = config.placeHolder;
    this.maxResults = config.maxResults || 5;
    this.resultItem = {
      content: config.resultItem && config.resultItem.content ? config.resultItem.content : false,
      element: config.resultItem && config.resultItem.element ? config.resultItem.element : "li"
    };
    this.noResults = config.noResults;
    this.highlight = config.highlight || false;
    this.onSelection = config.onSelection;
    this.dataSrc;
    this.init();
  }

  search(query, record) {
    return record;
  }

  listMatchedResults(data) {
    var _this = this;
    return new Promise(function (resolve) {
      var resList = [];

      var artists = data.artists.slice(0, 3);
      var albums = data.albums.slice(0, 3);
      var genres = data.genres.slice(0, 3);
      var tracks = data.tracks.slice(0, _this.maxResults);


      if (_this.resultsList.render) {
        //autoCompleteView.addResultsToList(_this.resultsList.view, artists, _this.resultItem);

        if (artists.length > 0) {
          var result = document.createElement(_this.resultItem.element);
          result.setAttribute("class", select.divider);
          result.innerHTML = "Artists";
          _this.resultsList.view.appendChild(result);

          artists.forEach(function (event, record) {
            var result = document.createElement(_this.resultItem.element);
            var resultValue = artists[record].id;
            result.setAttribute(dataAttribute, resultValue);
            result.setAttribute("class", select.result);
            result.setAttribute("tabindex", "1");
            result.innerHTML = event.name;
            _this.resultsList.view.appendChild(result);
            artists[record].type = "artist";
            resList.push(artists[record]);
          });
        }

        if (albums.length > 0) {
          var result = document.createElement(_this.resultItem.element);
          result.setAttribute("class", select.divider);
          result.innerHTML = "Albums";
          _this.resultsList.view.appendChild(result);

          albums.forEach(function (event, record) {
            var result = document.createElement(_this.resultItem.element);
            var resultValue = albums[record].id;
            result.setAttribute(dataAttribute, resultValue);
            result.setAttribute("class", select.result);
            result.setAttribute("tabindex", "1");
            result.innerHTML = event.name;
            _this.resultsList.view.appendChild(result);
            albums[record].type = "album";
            resList.push(albums[record]);
          });
        }

        if (genres.length > 0) {
          var result = document.createElement(_this.resultItem.element);
          result.setAttribute("class", select.divider);
          result.innerHTML = "Genres";
          _this.resultsList.view.appendChild(result);

          genres.forEach(function (event, record) {
            var result = document.createElement(_this.resultItem.element);
            var resultValue = genres[record].id;
            result.setAttribute(dataAttribute, resultValue);
            result.setAttribute("class", select.result);
            result.setAttribute("tabindex", "1");
            result.innerHTML = event.name;
            _this.resultsList.view.appendChild(result);
            genres[record].type = "genre";
            resList.push(genres[record]);
          });
        }
        if (tracks.length > 0) {
          var result = document.createElement(_this.resultItem.element);
          result.setAttribute("class", select.divider);
          result.innerHTML = "Tracks";
          _this.resultsList.view.appendChild(result);

          tracks.forEach(function (event, record) {
            var result = document.createElement(_this.resultItem.element);
            var resultValue = tracks[record].id;
            result.setAttribute(dataAttribute, resultValue);
            result.setAttribute("class", select.result);
            result.setAttribute("tabindex", "1");
            result.innerHTML = event.title + " - " + event.artist;
            _this.resultsList.view.appendChild(result);
            tracks[record].type = "track";
            resList.push(tracks[record]);
          });
        }
        autoCompleteView.navigation(_this.selector, _this.resultsList.view);
      }
      return resolve({
        matches: resList.length,
        list: resList
      });
    });
  }

  ignite() {
    var _this2 = this;
    var selector = this.selector;
    var input = autoCompleteView.getInput(selector);
    var placeHolder = this.placeHolder;
    if (placeHolder) {
      input.setAttribute("placeholder", placeHolder);
    }
    var debounce = function debounce(func, delay) {
      var inDebounce;
      return function () {
        var context = this;
        var args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(function () {
          return func.apply(context, args);
        }, delay);
      };
    };
    var exec = function exec(event) {
      _this2.inputValue = input instanceof HTMLInputElement ? input.value.toLowerCase() : input.innerHTML.toLowerCase();
      var renderResultsList = _this2.resultsList.render;
      var triggerCondition = _this2.inputValue.length > _this2.threshold && _this2.inputValue.replace(/ /g, "").length;
      var eventEmitter = function eventEmitter(event, results) {
        input.dispatchEvent(new CustomEvent("autoComplete", {
          bubbles: true,
          detail: {
            event: event,
            query: _this2.inputValue,
            matches: results.matches,
            results: results.list
          },
          cancelable: true
        }));
      };
      if (renderResultsList) {
        var onSelection = _this2.onSelection;
        var resultsList = _this2.resultsList.view;
        var clearResults = autoCompleteView.clearResults(resultsList);
        if (triggerCondition) {
          _this2.listMatchedResults(_this2.dataSrc).then(function (list) {
            eventEmitter(event, list);
            if (list.list.length === 0 && _this2.noResults && _this2.resultsList.render) {
              _this2.noResults();
            } else {
              if (onSelection) {
                autoCompleteView.getSelection(selector, resultsList, onSelection, list);
              }
            }
          });
        }
      } else if (!renderResultsList && triggerCondition) {
        _this2.listMatchedResults(_this2.dataSrc).then(function (list) {
          eventEmitter(event, list);
        });
      }
    };
    input.addEventListener("keyup", debounce(function (event) {
      if (!_this2.data.cache) {
        var data = _this2.data.src();
        if (data instanceof Promise) {
          data.then(function (response) {
            _this2.dataSrc = response;
            exec(event);
          });
        } else {
          _this2.dataSrc = data;
          exec(event);
        }
      } else {
        exec(event);
      }
    }, this.debounce));
  }

  init() {
    var _this3 = this;
    var dataSrc = this.data.src();
    if (dataSrc instanceof Promise) {
      dataSrc.then(function (response) {
        _this3.dataSrc = response;
        _this3.ignite();
      });
    } else {
      this.dataSrc = dataSrc;
      this.ignite();
    }
  }
}