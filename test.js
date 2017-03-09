/**
 * Created by alkin on 29.08.2016.
 */
var request = require('request');
var othersTestSize = 3;
var gifTestSize = 10;
var count = 0;
var server = 'http://localhost:3000';
//var server = 'http://lionsgate-gifs-api.movielala.com'
start();

function testGif(callback) {
  var url = server + createUrl(createRandomJSON()) + ".gif";
  console.log("-" + url);
  request.get(
    url,
    {json: {key: 'value'}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("#" + count + " " + response.statusCode + " " + url);
        if (callback) callback();
      } else {
        if (response.statusCode == 500) {
          throw new Error("Expected 200 but got 500");
        }
      }
    }
  );
}

function testVideo(callback) {
  var url = server + createUrl(createRandomJSON()) + ".mp4";

  console.log("-" + url);
  request.get(
    url,
    {json: {key: 'value'}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("#" + count + " " + response.statusCode + " " + url);
        if (callback) callback();
      } else {
        if (response.statusCode == 500) {
          throw new Error("Expected 200 but got 500");
        }
      }
    }
  );
}
function testFrame(callback) {
  var url = server + "/createFrames" + createUrl(createRandomJSON()) + ".jpg";
  console.log("-" + url);
  request.get(
    url,
    {json: {key: 'value'}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("#" + count+ " " + response.statusCode + " " + url);
        if (callback) callback();
      } else {
        if (response.statusCode == 500) {
          throw new Error("Expected 200 but got 500");
        }
      }
    }
  );
}

function testWrong(callback) {
  var gif = createRandomJSON();
  gif.videoId = "-1";
  var url = server + createUrl(gif) + ".gif";
  console.log("-" + url);
  request.get(
    url,
    {json: {key: 'value'}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Expected 500 but got 200");
      } else {
        if (response.statusCode == 500) {
          console.log("#" + count + " " + response.statusCode + " " + url);
          if (callback) callback();
        }
      }
    }
  );
}

function createRandomJSON() {
  var jsonGif = {
    "gifUrl": "",
    "videoId": "1",
    "fps": "10",
    "startTime": "0",
    "duration": "10",
    "resolution": "480",
    "quality": "high",
    filterId: null,
    textId: null,
    textStyleId: "1",
    textColor: "ffffff"
  };

  jsonGif.startTime = Math.floor(Math.random() * 120) + 1;
  jsonGif.duration = Math.floor(Math.random() * 10) + 1;
  jsonGif.resolution = Math.floor(Math.random() * 500) + 1;
  
  if (Math.random() >= 0.5) {
    jsonGif.quality = "high";
  }

  if (Math.random() >= 0.8) {
    jsonGif.filterId = "wrong";
  }

  if (Math.random() >= 0.8) {
    jsonGif.textId = Math.floor(Math.random() * 8) + 1;
  }
  if (Math.random() >= 0.5) {
    jsonGif.textStyleId = Math.floor(Math.random() * 5) + 1;
  }

  return jsonGif;
}

function createUrl(jsonGif) {
  var url = "/fps_" + jsonGif.fps + ",startTime_" + jsonGif.startTime + ",duration_" + jsonGif.duration
    + ",resolution_" + jsonGif.resolution + ",quality_" + jsonGif.quality;
  if (jsonGif.textId !== null) {
    url += ",textId_" + jsonGif.textId + ",textStyleId_" + jsonGif.textStyleId
      + ",textColor_" + jsonGif.textColor;
  }
  if (jsonGif.filterId !== null) {
    url += ",filterId_" + jsonGif.filterId;
  }
  url += "/" + jsonGif.videoId;
  return url;
}

function testGifs(num, callback) {
  for (var i = 0; i < num; i++) {
    testGif(function () {
      count++;
      if (callback && count == num) {
        count=0;
        callback();
      }
    });
  }
}


function testFrames(num, callback) {
  for (var i = 0; i < num; i++) {
    testFrame(function () {
      count++;
      if (callback && count == num) {
        count=0;
        callback();
      }
    });
  }
}
function testVideos(num, callback) {
  for (var i = 0; i < num; i++) {
    testVideo(function () {
      count++;
      if (callback && count == num) {
        count=0;
        callback();
      }
    })
  }
}

function testWrongs(num, callback) {
  for (var i = 0; i < num; i++) {
    testWrong(function () {
      count++;
      if (callback && count == num) {
        count=0;
        callback();
      }
    });
  }
}

function start(callback) {
  testGifs(gifTestSize, function () {
    console.log('\nSuccess creating Gifs.\n');
    testVideos(othersTestSize , function () {
      console.log('\nSuccess creating videos.\n');
      testFrames(othersTestSize , function () {
        console.log('\nSuccess creating frames.\n');
        testWrongs(othersTestSize, function () {
          console.log('\nSuccess getting 500.\n');
          console.log('***************\n\nTEST WAS SUCCESFULL\n\n***************');
        });
      });
    });
  });
}


