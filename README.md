# Alloy

[![Build Status](https://jessenelson.visualstudio.com/Alloy/_apis/build/status/Alloy-CI?branchName=master)](https://jessenelson.visualstudio.com/Alloy/_build/latest?definitionId=13&branchName=master)

## Major Features Include:
###Please use Issues page for any new feature requests
* Support for major platforms: Windows, Linux, macOS, Raspberry Pi, etc.
* Full Rest API with AlloyDB
* Database and UI can be deployed together or seperately
* SabNZBD API connection - In Progress
* Musicbrainz integration
* Last.FM integration

## Feature Requests
* Post am issue

## Media Structure
* Alloy DB expects a structure of the following folder format:
```
 {{root}}/{{artist}}/{{release name}}/{{media_name}}.{{ext}}
```

## Supported Formats
```
.mp3, .wav, .flac, .ogg, .aiff, .aac
```

## To run: 
* Powershell as admin npm i -g --production windows-build-tools@4.0.0
* npm install
* node ./setup.js -install
* node ./setup.js -run
* navigate to http://localhost:3000
* navigate to http://localhost:4000/api_docs for information on the database API

## setup.js
setupjs has some different commands for running and development: 
```
-ui      # runs the full UI frontend application for connecting to a remote database
-run     # runs the full UI frontend application and database server
-fonts   # rebuilds just the fonts
-build   # builds the resources
-install # includes build, installs and builds
```

### Now Playing Preview
![Alt text](/media/preview.png?raw=true "Overall interface")

### GIF Preview
![Alt Text](/media/preview.gif)