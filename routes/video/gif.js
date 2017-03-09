var exec = require('child_process').exec;
var fs = require('fs');
var express = require('express');
var tmp = require('tmp');

var parseArgs = require('../parseArgs');
var videosJs = require('../videos');
var search = require('../search');

var router = module.exports = new express.Router();

router.get('/:args/:videoId.gif', function (req, res, next) {
  var text = 'undefined';
  var textStyle = 'undefined';
  var args = req.params.args;
  var jsonGif = parseArgs(args);
  jsonGif.videoId = req.params.videoId;

  var videoInfo = search(jsonGif.videoId, videosJs.jsonVideos.videos);

  if (videoInfo == null) {
    next(new Error('VideoId is not valid, check /videos for available videoIds.'));
    return;
  }

  // check starting time
  if (videoInfo.duration < jsonGif.startTime) {
    console.log('Given start time is not valid.');
    jsonGif.startTime = 0;
  }

  // check resolution
  if (jsonGif.resolution > 480) {
    jsonGif.resolution = 480;
  }

  var videoName = jsonGif.videoId;
  // check if filter exists
  if (jsonGif.filterId !== null) {
    var videoFilters = search(jsonGif.videoId, videosJs.jsonVideos.videos).filters;
    var filter = search(jsonGif.filterId, videoFilters);
    if (filter !== null) {
      videoName += '_' + jsonGif.filterId;
    } else {
      console.log('Given filter id is not valid or the filter does not exist.');
    }
  }

  var jsonTextStyle = search(jsonGif.textStyleId, videosJs.jsonVideos.textStyles);
  if (jsonTextStyle !== null) {
    textStyle = 'fonts/' + jsonTextStyle.localFileName;
  } else {
    textStyle = 'fonts/OpenSans-Regular.ttf';
    console.log(jsonGif.textStyleId + ' is not a valid textStyleId. The default textStyle is OpenSans-Regular');
  }

  var jsonText = search(jsonGif.textId, videosJs.jsonVideos.texts);
  if (jsonText !== null) {
    text = jsonText.text.replace(/ /g, '\\ ');
  } else {
    text = 'undefined';
    textStyle = 'undefined';
    console.log(jsonGif.textId + ' is not a valid textId.');
  }


  // command = ./gifenc.sh videoId.mp4 videoId.gif fps start_time duration resolution quality textColor text textStyleLocation
  // $1=videoId.mp4, $2=videoId.gif, $3=fps, $4=start_time, $5=duration, $6=resolution $7=quality $8=textColor $9=text  $10=textStyleLocation
  var filePath = tmp.tmpNameSync({ prefix: 'gif-', postfix: '.gif' });
  var command = './gifenc.sh' +
    ' videos/' + videoName + '.mp4' +
    ' ' + filePath +
    ' ' + jsonGif.fps +
    ' ' + jsonGif.startTime +
    ' ' + jsonGif.duration +
    ' ' + jsonGif.resolution +
    ' ' + jsonGif.quality +
    ' ' + jsonGif.textColor +
    ' ' + text +
    ' ' + textStyle;

  console.log(command);
  exec(command, { cwd: __PROJECT_ROOT__ }, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var body = fs.createReadStream(filePath);
      body.pipe(res);
      /*
       console.log('Uploading to AWS');
       var data = {
       Bucket: 'gifmakeraws',
       ACL: 'public-read',
       Key: jsonGif.videoId + '-' +
       jsonGif.startTime + '-' +
       jsonGif.duration + '-' +
       jsonGif.fps,
       Body: body,
       ContentType: 'image/gif'
       };

       if (req.query.filterId) data.Key = data.Key + '-' + jsonGif.filterId;
       if (req.query.resolution) data.Key = data.Key + '-' + jsonGif.resolution;
       if (req.query.textId) data.Key = data.Key + '-' + jsonGif.textId;
       data.Key = data.Key + '.gif';

       s3.upload(data).
       on('httpUploadProgress', function(evt) { console.log(evt); }).
       send(function(err, data) {
       console.log(err, data);
       jsonGif.gifUrl = data.Location;
       for (var i in jsonGif) {
       if (jsonGif[i] === null || jsonGif[i] === "") delete jsonGif[i];
       }
       res.send(
       jsonGif
       );
       });
       */
    }
  });
});
