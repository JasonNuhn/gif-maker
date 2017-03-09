var express = require('express');

var config = require('../config');
var parseArgs = require('../parseArgs');
var videosJs = require('../videos');
var search = require('../search');

var router = module.exports = new express.Router();

router.get('/:args/:videoId.json', function (req, res, next) {
  var host = 'https://yourwebsite.com';
  var gifUrl = host + req.originalUrl.replace('json', 'gif');
  var mp4Url = host + req.originalUrl.replace('json', 'mp4');

  host = 'yourwebsite/gifs';
  var shareUrl = host + req.originalUrl.replace('json', 'html');

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

  var jsonText = search(jsonGif.textId, videosJs.jsonVideos.texts);
  if (jsonText !== null) {
    text = jsonText.text.replace(/ /g, '\\ ');
  } else {
    text = 'undefined';
    textStyle = 'undefined';
    console.log(jsonGif.textId + ' is not a valid textId.');
  }

  var title = 'Saban\'s POWER RANGERS - Official Gif Creator - Coming To Theaters 2017';
  var description = 'Saban\'s Power Rangers follows five ordinary high school kids who must become something extraordinary. Coming to theaters 2017.';
  var author = 'LIONSGATE';
  // var keywords = 'gif, animated, image host, gif maker, 10mb, video, mp4, webm';

  var twitterSite = '@thepowerrangers';

  var facebookId = config.shares.facebook.appId;

  var siteName = 'POWER RANGERS';

  var data = {
    url: gifUrl,
    shares: [
      {
        provider: 'facebook',
        app_id: facebookId,
        display: 'popup',
        href: gifUrl,
        redirect_uri: shareUrl,
      },
      {
        provider: 'twitter',
        text: description,
        url: shareUrl,
        hashtags: '',
        via: 'movielala',
        related: '',
        'in-reply-to': 'movielala',
      },
      {
        provider: 'tumblr',
        canonicalUrl: gifUrl,
        posttype: 'gif',
        tags: '',
        title: description,
        content: gifUrl,
        caption: description,
        show_via: '',
      },
      {
        provider: 'google_plus',
        url: shareUrl,
      },
      {
        provider: 'pinterest',
        url: shareUrl,
        media: gifUrl,
        description: description,
        'data-pin-do': 'buttonPin',
        'data-pin-config': 'above',
      },
      {
        provider: 'email',
        subject: description,
        body: description + '\n' + shareUrl,
      },
      {
        provider: 'whatsapp',
        subject: description,
        body: description + '\n' + shareUrl,
      },
      {
        provider: 'imessage',
        subject: description,
        body: description + '\n' + shareUrl,
      },
      {
        provider: 'instagram',
        subject: description,
        body: description + '\n' + shareUrl,
      },
    ],

    title: title,
    canonicalUrl: shareUrl,

    metadata: [
      // Generic
      { name: 'description', content: description },
      { name: 'author', content: author },
      // { name: 'keywords', content: keywords },
      // Twitter
      { name: 'twitter:card', content: 'player' },
      { name: 'twitter:site', content: twitterSite },
      // { name: 'twitter:url', content: shareUrl },
      { name: 'twitter:url', content: gifUrl },
      { name: 'twitter:title', content: description },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: gifUrl },
      // { name: 'twitter:player', content: mp4Url },
      { name: 'twitter:player', content: gifUrl },
      { name: 'twitter:player:width', content: '480' },
      { name: 'twitter:player:height', content: '270' },
      // Facebook
      { property: 'fb:app_id', content: facebookId },
      { property: 'og:site_name', content: siteName },
      { property: 'og:type', content: 'video' },
      { property: 'og:type', content: 'video.other' },
      { property: 'og:url', content: gifUrl },
      { property: 'og:title', content: description },
      { property: 'og:description', content: description },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:image', content: gifUrl },
      { property: 'og:image:width', content: '480' },
      { property: 'og:image:height', content: '270' },
      { property: 'og:image:secure_url', content: gifUrl },
      { property: 'og:video', content: mp4Url },
      { property: 'og:video:secure_url', content: mp4Url },
      { property: 'og:video:type', content: 'video/mp4' },
      { property: 'og:video:width', content: '480' },
      { property: 'og:video:height', content: '270' },
    ],
  };
  res.send(data);
});
