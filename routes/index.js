var express = require('express');

var dataRoute = require('./video/data');
var gifRoute = require('./video/gif');
var mp4Route = require('./video/mp4');
var webmRoute = require('./video/webm');
var jpgFramesRoute = require('./video/jpgFrames');

var router = module.exports = new express.Router();

router.use(dataRoute);
router.use(gifRoute);
router.use(mp4Route);
router.use(webmRoute);
router.use(jpgFramesRoute);
