var express = require('express');
var fs = require('fs');
var tmp = require('tmp');
var exec = require('child_process').exec;

var parseArgs = require('../parseArgs');
var videosJs = require('../videos');
var search = require('../search');

var router = module.exports = new express.Router();

router.get('/:args/:videoId.webm', function (req, res, next) {
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
  if (videoInfo.width < jsonGif.resolution) {
    jsonGif.resolution = videoInfo.width;
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

  // check if text exists
  var jsonText = search(jsonGif.textId, videosJs.jsonVideos.texts);
  if (jsonText !== null) {
    text = jsonText.text.replace(/ /g, '\\ ').replace(/'/g, '\\\'');
  } else {
    text = 'undefined';
    textStyle = 'undefined';
    console.log(jsonGif.textId + ' is not a valid textId.');
  }

  // command = ./videoEnc.sh videoId.mp4 time.mp4 fps start_time duration resolution quality text textColor textStyleLocation
  // $1=videoId.mp4, $2=time.mp4, $3=fps, $4=start_time, $5=duration, $6=resolution $7=quality $8=text $9=textColor $10=textStyleLocation
  var filePath = tmp.tmpNameSync({ prefix: 'webm-', postfix: '.webm' });
  var command = './videoEnc.sh' +
    ' videos/' + videoName + '.webm' +
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
      res.writeHead(200, { 'Content-Type': 'video/webm' });
      body.pipe(res);
    }
  });
});
