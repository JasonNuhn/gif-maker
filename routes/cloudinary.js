var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var videosJs = require('./videos');

cloudinary.config({
  cloud_name: 'alkinsen',
  api_key: '******************************',
  api_secret: '*****************************'
});

router.get('/:args/:videoId', function (req, res, next) {
  var jsonGif = {
    "gifUrl": "",
    "videoId": "0",
    "fps": "24",
    "startTime": "00:00:00",
    "duration": "3",
    "resolution": "480",
    "quality": "low",
    filterId: null,
    textId: null,
    textStyleId: 6
  };

  var args = req.params.args;
  jsonGif.videoId = req.params.videoId.split('.')[0];
  var paramsArray = args.split(',');
  for (var i = 0; i < paramsArray.length; i++) {
    var paramKey = paramsArray[i].split('_')[0];
    var paramValue = paramsArray[i].split('_')[1];

    switch (paramKey) {
      case 'fps':
        jsonGif.fps = paramValue;
        break;
      case 'quality':
        jsonGif.quality = paramValue;
        break;
      case 'startTime':
        jsonGif.startTime = paramValue;
        break;
      case 'duration':
        jsonGif.duration = paramValue;
        break;
      case 'filterId':
        jsonGif.filterId = paramValue;
        break;
      case 'resolution':
        if (paramValue < 480) jsonGif.resolution = paramValue;
        else jsonGif.resolution = 480;
        break;
      case 'textId':
        jsonGif.textId = paramValue;
        break;
      case 'textStyleId':
        jsonGif.textStyleId = paramValue;
        break;
    }
  }


  var quality = 35;
  if (jsonGif.quality == 'normal') {
    quality = 70;
  } else if (jsonGif.quality == 'high') {
    quality = 100;
  }

  var jsonText = search(jsonGif.textId, videosJs.jsonVideos.texts);
  if (jsonText !== null) {
    var text = jsonText.text
  } else {
    var text = 'undefined';
    console.log(jsonGif.textId + ' is not a valid textId.')
  }
  var textSize = 30;
  var jsonTextStyle = search(jsonGif.textStyleId, videosJs.jsonVideos.textStyles);
  if (jsonTextStyle !== null && jsonTextStyle.cloudinaryFontName !== 'undefined') {
    textStyle = jsonTextStyle.cloudinaryFontName;
    textSize = jsonTextStyle.fontSize;
  } else {
    var textStyle = "arial";
    console.log(jsonGif.textStyleId + " is not a valid textStyleId for cloudinary. The default textStyle is Ubuntu-R");
  }

  var videoName = jsonGif.videoId;
  if (jsonGif.filterId !== null) videoName += '_' + jsonGif.filterId;

  if (text != 'undefined') {
    jsonGif.gifUrl = cloudinary.url(videoName + ".gif", {
      resource_type: "video", transformation: [
        {
          duration: jsonGif.duration,
          quality: quality,
          start_offset: jsonGif.startTime,
          width: jsonGif.resolution,
          crop: "scale"
        },
        {y: 0.35, gravity: "south", overlay: "text:" + textStyle + "_" + textSize + ":" + text}
      ]
    });
  } else {
    jsonGif.gifUrl = cloudinary.url(videoName + ".gif", {
      duration: jsonGif.duration, quality: quality, start_offset: jsonGif.startTime,
      width: jsonGif.resolution, crop: "scale", resource_type: "video"
    })
  }

  for (var i in jsonGif) {
    if (jsonGif[i] === null || jsonGif[i] === "") delete jsonGif[i];
  }
  res.send(
    jsonGif
  );
});

module.exports = router;

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].id == nameKey) {
      return myArray[i];
    }
  }
  return null;
}
