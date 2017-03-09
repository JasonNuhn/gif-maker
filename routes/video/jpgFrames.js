var express = require('express');
var exec = require('child_process').exec;
var fs = require('fs');
var tmp = require('tmp');

var parseArgs = require('../parseArgs');
var videosJs = require('../videos');
var search = require('../search');

var router = module.exports = new express.Router();

router.get('/:args/:videoId.frames.jpg', function (req, res, next) {
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
    next(new Error('StartTime is not valid, it should be between 0 and ' + videoInfo.duration));
    return;
  }

  // limit fps
  if (jsonGif.fps > 24) {
    jsonGif.fps = 24;
  }


  // check resolution
  //jsonGif.resolution = videoInfo.width;

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

  if (jsonGif.quality === 'low') {
    jsonGif.quality = 30;
  } else if (jsonGif.quality === 'normal') {
    jsonGif.quality = 70;
  } else if (jsonGif.quality === 'high') {
    jsonGif.quality = 100;
  } else {
    jsonGif.quality = 100;
  }

  /*  command = ./createFrames.sh videoId.webm /tmp/0.jpg time fps startTime duration resolution quality fontFile text
   *    $1=videoId, $2=finalJpgDest, $3=time  $4=fps $5=startTime $6=duration $7=resolution $8=fontFile $9=text*/
  var filePath = tmp.tmpNameSync({ prefix: 'jpgFrames-', postfix: '.frames.jpg' });
  var command = './createFrames.sh ' +
    'videos/' + videoName + '.mp4' +
    ' ' + filePath +
    ' ' + jsonGif.fps +
    ' ' + jsonGif.startTime +
    ' ' + jsonGif.duration +
    ' ' + jsonGif.resolution +
    ' ' + jsonGif.quality + '%' +
    ' ' + Math.floor(jsonGif.duration * jsonGif.fps);

  console.log(command);
  exec(command, { cwd: __PROJECT_ROOT__ }, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      var body = fs.createReadStream(filePath);
      body.pipe(res);
    }
  });
});
