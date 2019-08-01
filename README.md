# Alloy

master [![Build Status](https://jessenelson.visualstudio.com/Alloy/_apis/build/status/Alloy-API-CI?branchName=master)](https://jessenelson.visualstudio.com/Alloy/_build/latest?definitionId=20&branchName=master)
dev [![Build Status](https://jessenelson.visualstudio.com/Alloy/_apis/build/status/Dev%20Build?branchName=develop)](https://jessenelson.visualstudio.com/Alloy/_build/latest?definitionId=26&branchName=develop)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2556a29183de4164bf35935058a85c4f)](https://app.codacy.com/app/ic3y808/Alloy?utm_source=github.com&utm_medium=referral&utm_content=ic3y808/Alloy&utm_campaign=Badge_Grade_Dashboard)

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
### requires node-v10.11.0
* Powershell as admin npm i -g --production windows-build-tools@4.0.0
* npm install
* npm run build
* navigate to the Alloy\dist folder and install the package

### Now Playing Preview
![Alt text](/common/media/webui.png?raw=true "Web interface")

### Server Interface
![Alt Text](/common/media/server.png?raw=true "Server interface")
