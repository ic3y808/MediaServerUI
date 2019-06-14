import AutoComplete from "../../../API/autoComplete";
import "./searchbar.scss";
export default function (AlloyDbService, $location, AppUtilities) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      direction: "@"
    },
    templateUrl: "/template/searchbar.jade",

    replace: true,
    link: ($scope, $element, attrs) => {
      $scope.selectedObject = null;
      $element.bind("click", (event) => {

      });

      var jumpTo = (to) => {
        $location.path(to);
        AppUtilities.apply();
      };

      const autoCompletejs = new AutoComplete({
        data: {
          src: async function () {
            const query = document.querySelector("#autoComplete").value;
            if (query === "") { return ""; }
            var source = await AlloyDbService.search(query);
            return source;
          },
          key: ["title"],
          cache: false,
        },
        sort: function (a, b) {
          if (a.match < b.match) {
            return -1;
          }
          if (a.match > b.match) {
            return 1;
          }
          return 0;
        },
        selector: "#autoComplete",
        threshold: 0,
        debounce: 300,
        searchEngine: "strict",
        highlight: true,
        maxResults: Infinity,
        resultsList: {
          render: true,
          container: function () {
            const resultsListID = "autoComplete_results_list";
            return resultsListID;
          },
          destination: document.querySelector("#autoComplete"),
          position: "afterend",
          element: "ul",
        },
        resultItem: {
          content: function (data) {
            return `${data.match}`;
          },
          element: "li",
        },
        noResults: function () {
          const result = document.createElement("li");
          result.setAttribute("class", "no_result");
          result.setAttribute("tabindex", "1");
          result.innerHTML = "No Results";
          document.querySelector("#autoComplete_results_list").appendChild(result);
        },
        onSelection: function (feedback) {
          switch (feedback.selection.type) {
            case "artist": jumpTo("/artist/" + feedback.selection.id); break;
            case "album": jumpTo("/album/" + feedback.selection.id); break;
            case "genre": jumpTo("/genre/" + feedback.selection.id); break;
            case "track": jumpTo("/album/" + feedback.selection.album_id); break;
          }
        }
      });

      ["focus", "blur", "mousedown", "keydown"].forEach(function (eventType) {
        const input = document.querySelector("#autoComplete");
        const resultsList = document.querySelector("#autoComplete_results_list");

        document.querySelector("#autoComplete").addEventListener(eventType, function () {
          // Hide results list & show other elemennts
          if (eventType === "blur") {
           // resultsList.style.display = "none";
          } else if (eventType === "focus") {
            // Show results list & hide other elemennts
            resultsList.style.display = "block";
          }
        });

        // Hide Results list when not used
        document.addEventListener(eventType, function (event) {
          const current = event.target;
          if (
            current === input ||
            current === resultsList ||
            input.contains(current) ||
            resultsList.contains(current)
          ) {
            resultsList.style.display = "block";
          } else {
            //resultsList.style.display = "none";
          }
        });
      });

      // Toggle Input Classes on results list focus to keep style
      ["focusin", "focusout", "keydown"].forEach(function (eventType) {
        document.querySelector("#autoComplete_results_list").addEventListener(eventType, function (event) {
          if (eventType === "focusin") {
            if (event.target && event.target.nodeName === "LI") {
              document.querySelector("#autoComplete").classList.remove("out");
              document.querySelector("#autoComplete").classList.add("in");
            }
          } else if (eventType === "focusout" || event.keyCode === 13) {
            document.querySelector("#autoComplete").classList.remove("in");
            document.querySelector("#autoComplete").classList.add("out");
          }
        });
      });

      $("#autoComplete").mouseenter(() => {
        $(this).focus();
        const resultsList = document.querySelector("#autoComplete_results_list");
        resultsList.style.display = "block";
      });
    }
  };
}