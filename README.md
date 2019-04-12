# Alloy

## API Build Status
[![Build Status](https://jessenelson.visualstudio.com/Alloy/_apis/build/status/Alloy-API-CI?branchName=master)](https://jessenelson.visualstudio.com/Alloy/_build/latest?definitionId=20&branchName=master)
## Android Build Status
[![Build Status](https://jessenelson.visualstudio.com/Alloy/_apis/build/status/Alloy-Android-CI-import?branchName=master)](https://jessenelson.visualstudio.com/Alloy/_build/latest?definitionId=21&branchName=master)
## Codacy Status
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2556a29183de4164bf35935058a85c4f)](https://app.codacy.com/app/ic3y808/Alloy?utm_source=github.com&utm_medium=referral&utm_content=ic3y808/Alloy&utm_campaign=Badge_Grade_Dashboard)

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
