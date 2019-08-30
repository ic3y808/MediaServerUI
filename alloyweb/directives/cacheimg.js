var LOG_TAG = "DIR_IMGCACHE: ";
var FOLDER_IMAGE_CACHE = "IMAGE_CACHE";
var DIRIMG_LastUsedMap = null;
var hasRunClearup = false;
var ORIGINAL_PATH = "originalpath";

// Check if we have initialised our session url cache
if (sessionStorage.imageurlcache === null || sessionStorage.imageurlcache === undefined) {
  console.log(LOG_TAG + "Setting up the temp session storage image cache");
  sessionStorage.setItem("imageurlcache", JSON.stringify({}));
}


// Find or Download the image and set onto our element
var getImage = function (src, elem) {
  var isImageSource = false;

  // Work out if this element requires an src or background-image tag to be set
  isImageSource = elem[0].nodeName == "IMG";

  // First attempt to get from the url cache
  GetFromCache(src, function (imgPath) {

    // Got the image, set it now
    if (isImageSource) {
      elem.attr("src", imgPath);
    } else {
      elem.css("background-image", "url(" + imgPath + ")");
    }

  }, function () {

    // Retrieve from the cache (or download if we havent already)
    GetFromFileSystem(src, function (imgPath) {
      console.log(LOG_TAG + "Got image - setting now");

      // Got the image, set it now
      if (isImageSource) {
        elem.attr("src", imgPath);
      } else {
        elem.css("background-image", "url(" + imgPath + ")");
      }

    }, function (err) {
      console.log(LOG_TAG + "Failed to get image from cache");

      // SET BROKEN LINK IMAGE HERE
      if (isImageSource) {
        elem.attr("src", "");
      } else {
        elem.css("background-image", "url(\"\")");
      }

    });

  });

};

// Build a file key - this will be what the filename is within the cache
var buildFileKey = function (url) {
  console.log(LOG_TAG + "Building file key for url: " + url);
  var parts = url.split(".");
  var result = (parts.slice(0, -1).join("") + "." + parts.slice(-1)).toString().replace(/[^A-Za-z0-9]/g, "_").toLowerCase();
  console.log(LOG_TAG + "Built file key: " + result);
  return result;
};

// Store the local URL in a temporary session variable for speed
var GetFromCache = function (sourceUrl, success, fail) {
  console.log(LOG_TAG + "Getting image from the cache. Source: " + sourceUrl);

  var startTime = new Date().getTime();
  var fileKey = buildFileKey(sourceUrl);
  var cacheObj = JSON.parse(sessionStorage.getItem("imageurlcache"));

  if (cacheObj !== undefined && cacheObj.hasOwnProperty(fileKey)) {
    console.log(LOG_TAG + "Found Cached URL: " + cacheObj[fileKey]);
    console.log(LOG_TAG + "Time Taken: " + (new Date().getTime() - startTime));
    return success(cacheObj[fileKey]);
  } else {
    console.log(LOG_TAG + "Image is not yet cached in our URL store");
    return fail();
  }

};

// Either get hold of the file from the cache or if we don't currently have it
// then attempt to download and store in the cache ready for next time
var GetFromFileSystem = function (sourceUrl, success, fail) {
  console.log(LOG_TAG + "Getting image from the File System. Source: " + sourceUrl);

  var startTime = new Date().getTime();
  var fileKey = buildFileKey(sourceUrl);
  var cacheExpiry = new Date().getTime() - (86400000 * 3); // 3 days

  // Get the file system for temporary storage
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, function (fs) {

    console.log(LOG_TAG + "Opened File System: " + fs.name);

    // Get hold of the directory (Or create if we haven't already)
    fs.root.getDirectory(FOLDER_IMAGE_CACHE, { create: true }, function (dirEntry) {

      var downloadToPath = dirEntry.toURL() + fileKey;
      console.log(LOG_TAG + "Local Path: " + downloadToPath);

      // Check to see if we have the file
      doesFileExist(dirEntry, fileKey, function (fileEntry) {
        console.log(LOG_TAG + "Image already exists");

        // Update the last time this image was requested so we can
        // clear out anything that hasn't been requested in a while
        updateLastRequested(fileKey);

        // Store in the url cache to speed up our next get for this image
        console.log(LOG_TAG + "Storing in cache for quicker get next time around");
        var obj = JSON.parse(sessionStorage.getItem("imageurlcache"));
        obj[fileKey] = fileEntry.toURL();
        sessionStorage.setItem("imageurlcache", JSON.stringify(obj));

        // File exists - check if it needs to be renewed
        if (new Date(fileEntry.lastModifiedDate).getTime() < cacheExpiry) {
          console.log(LOG_TAG + "Image has passed the expiry threshold - re-getting the file");
          downloadFile(sourceUrl, downloadToPath, success, fail);
        }

        // Return the file path
        console.log(LOG_TAG + "Passing back the image path " + fileEntry.toURL());
        console.log(LOG_TAG + "Time Taken: " + (new Date().getTime() - startTime));
        return (success(fileEntry.toURL()));

      }, function () {

        // File does not exist so download
        console.log(LOG_TAG + "Image doesnt exist - getting file");
        downloadFile(sourceUrl, downloadToPath, success, fail);

      });

    }, fail);

  }, fail);

};


// Check to see if the given image already exists in our cache
var doesFileExist = function (dir, fileKey, existsCallback, notExistsCallback) {

  console.log(LOG_TAG + "Checking if file exists " + fileKey);

  // Check the directory for this file
  dir.getFile(fileKey, { create: false }, function (fileEntry) {
    console.log(LOG_TAG + "File: " + fileKey + " does exist already");
    return (existsCallback(fileEntry));
  }, function () {
    console.log(LOG_TAG + "File: " + fileKey + " does not exist");
    return (notExistsCallback());
  });

};


// Download a file into the cache
var downloadFile = function (url, downloadToPath, success, fail) {

  console.log(LOG_TAG + "Downloading file " + url);
  var fileTransfer = new FileTransfer();

  // File download function with URL and local path
  fileTransfer.download(encodeURI(url), downloadToPath,
    function (fileEntry) {
      console.log(LOG_TAG + "Download Complete to path: " + fileEntry.toURL());
      success(fileEntry.toURL());
    },
    function (error) {
      //Download abort errors or download failed errors
      console.log(LOG_TAG + "Download Failed: " + error.source);
      //alert("download error target " + error.target);
      //alert("upload error code" + error.code);
    }
  );

};


// Download a file into the cache
var deleteFile = function (filekey, success, fail) {

  console.log(LOG_TAG + "Deleting file " + filekey);

  // Get hold of the filesystem object
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, function (fs) {

    console.log(LOG_TAG + "Opened File System: " + fs.name);

    // Get the correct directory
    fs.root.getDirectory(FOLDER_IMAGE_CACHE, { create: false }, function (dirEntry) {

      console.log(LOG_TAG + "Found Folder, searching for file to delete...");

      // Find the file
      dirEntry.getFile(filekey, { create: false, exclusive: false }, function (fileEntry) {

        // Found the file - remove
        fileEntry.remove(function () {

          // Log the success
          console.log(LOG_TAG + "Deleted File Successfully");

          // Call success
          success();

        }, fail);

      }, fail);

    }, fail);

  }, fail);

};


// Setup the last used cache
var setupLastUsedCache = function (complete) {

  // Check if we have initialise our last used map
  if (DIRIMG_LastUsedMap === null) {

    // We will populate the variable using data stored in the localstorage
    var lastused = localStorage["DIR_IMGCACHE_LASTUSED"];
    DIRIMG_LastUsedMap = lastused !== undefined && lastused.length > 0 ? JSON.parse(lastused) : {};

  }

  return (complete());
};


// Clear out any items that have not been requested for a while
// Remove any image that is older than a week
var clearUnusedCache = function () {

  console.log(LOG_TAG + "Clearing unused cache");
  setupLastUsedCache(function () {

    var _clearOlderThan = new Date().getTime() - (86400000 * 7);
    var _totalCount = Object.keys(DIRIMG_LastUsedMap).length;
    var _clearCount = 0;

    var removefile = function (key) {
      console.log(LOG_TAG + "Removing key " + key);

      // Delete file
      deleteFile(key, function () {

        // Deleted
        console.log(LOG_TAG + "Deleted cached image file " + key);

        // Remove from the map
        delete DIRIMG_LastUsedMap[key];

        // Update the local storage cache
        localStorage["DIR_IMGCACHE_LASTUSED"] = JSON.stringify(DIRIMG_LastUsedMap);

      }, function (err) {

        // Remove from the map
        delete DIRIMG_LastUsedMap[key];

        // Update the local storage cache
        localStorage["DIR_IMGCACHE_LASTUSED"] = JSON.stringify(DIRIMG_LastUsedMap);

        // Failed
        console.log(LOG_TAG + err);

      });
    };

    for (var key in DIRIMG_LastUsedMap) {
      if (DIRIMG_LastUsedMap.hasOwnProperty(key)) {
        // Check date
        if (DIRIMG_LastUsedMap[key] <= _clearOlderThan) {

          // Increment the quantity of items we are removing
          _clearCount++;

          // Delete file
          removefile(key);

        }

      }
    }

    // Log the quantity we are expecting to delete
    console.log(LOG_TAG + "Expecting to delete " + _clearCount + " unused files of " + _totalCount + " total files");

  });
};


// Update the last time this url was requested
var updateLastRequested = function (urlkey) {
  setupLastUsedCache(function () {

    // Set the last used time for this image url
    DIRIMG_LastUsedMap[urlkey] = new Date().getTime();

    // Update the local storage cache
    localStorage["DIR_IMGCACHE_LASTUSED"] = JSON.stringify(DIRIMG_LastUsedMap);

  });
};


export default function () {
  "ngInject";
  return {
    restrict: "A",
    scope: {
      imgSrc: "="
    },
    link: function (scope, elem, attrs) {
      console.log(LOG_TAG + "Starting Directive.");

      // Run a clear up initialy if we haven't already
      if (!hasRunClearup) {
        hasRunClearup = true;
        clearUnusedCache();
      }

      // Watch any value changes
      scope.$watch(function () {
        return scope.imgSrc;
      }, function (src) {
        console.log(LOG_TAG + "Watch has been triggered - a change to the imgSrc has occured: " + src);

        // Check we have a valid src to process
        if (src !== null && src !== undefined && src.trim().length > 0) {
          console.log(LOG_TAG + "Valid Source found: " + src);
          getImage(src, elem);
        }

      }, true);

    }
  };
}


