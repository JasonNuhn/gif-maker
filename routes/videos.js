var express = require('express');

var router = new express.Router();

var jsonVideos = {
  videos: [{
    id: '1',
    name: 'Mad Max Fury Road',
    source: {
      type: 'video/mp4',
      url: 'https://player.vimeo.com/external/127227869.hd.mp4?s=2cb6c587a7d2fe98746702a2031de5fa9d4a4f17&profile_id=113',
    },

    width: 1280,
    height: 666,
    duration: 133,
    thumbnailUrl: 'https://i.vimeocdn.com/video/586643055.jpg',
    filteredSources: {
      hue: {
        source: {
          type: 'video/mp4',
          url: 'https://player.vimeo.com/external/178894917.hd.mp4?s=2a95227c3d29a0228332a9f8377d29ecb3356bc5&profile_id=174',
        },
        thumbnailUrl: 'https://i.vimeocdn.com/video/586644659.webp',
      },
    },
    filters: [
      {
        id: 'hue',
        name: 'Black and White',
        thumbnailUrl: 'https://i.vimeocdn.com/video/586644659.webp',
      },
    ],
  }],

  texts: [{
    id: '1',
    text: 'Go go Power Rangers!',
  }, {
    id: '2',
    text: "It's Morphin' Time",
  }, {
    id: '3',
    text: 'SquadGoals', 
  }, {
    id: '4',
    text: 'Together We Are More',
  }],

  textStyles: [
    {
      id: '1',
      fontFamily: "'Courgette', handwriting",
      name: 'Courgette',
      fontSize: 18,
      fileUrl: 'https://fonts.googleapis.com/css?family=Courgette',
      localFileName: 'Courgette-Regular.ttf',
      cloudinaryFontName: '',
    },
    {
      id: '2',
      fontFamily: "'Open Sans', sans-serif",
      name: 'Open Sans',
      fontSize: 18,
      fileUrl: 'https://fonts.googleapis.com/css?family=Open+Sans',
      localFileName: 'OpenSans-Regular.ttf',
      cloudinaryFontName: '',
    },
    {
      id: '3',
      fontFamily: "'Lora', sans-serif",
      name: 'Lora',
      fontSize: 18,
      fileUrl: 'https://fonts.googleapis.com/css?family=Lora',
      localFileName: 'Lora-Regular.ttf',
      cloudinaryFontName: '',
    },
    {
      id: '4',
      fontFamily: "'Patrick Hand', handwriting",
      name: 'Patrick Hand',
      fontSize: 18,
      fileUrl: 'https://fonts.googleapis.com/css?family=Patrick+Hand',
      localFileName: 'PatrickHand-Regular.ttf',
      cloudinaryFontName: '',
    },
    {
      id: '5',
      fontFamily: "'Playfair Display', sans-serif",
      name: 'Playfair Display',
      fontSize: 18,
      fileUrl: 'https://fonts.googleapis.com/css?family=Playfair+Display',
      localFileName: 'PlayfairDisplay-Regular.ttf',
      cloudinaryFontName: '',
    },
  ],

};

router.get('/', function (req, res) {
  res.json(jsonVideos);
});


module.exports = router;
module.exports.jsonVideos = jsonVideos;
