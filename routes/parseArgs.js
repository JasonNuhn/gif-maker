module.exports = function parseArgs(args) {
  var jsonGif = {
    gifUrl: '',
    videoId: '',
    fps: '24',
    startTime: '0',
    duration: '10',
    resolution: '480',
    quality: 'low',
    filterId: null,
    textId: null,
    textStyleId: '1',
    textColor: 'ffffff',
  };
  var paramsArray = args.split(',');
  for (var i = 0; i < paramsArray.length; i++) {
    var paramKey = paramsArray[i].split('_')[0];
    var paramValue = paramsArray[i].split('_')[1];

    switch (paramKey) {
      case 'fps':
        if (paramValue < 0 || paramValue > 60) {
          console.log('Invalid fps is given, it is set to the default value(24).');
        }
        jsonGif.fps = paramValue;
        break;
      case 'quality':
        paramValue = paramValue.toString().toLowerCase();
        if (paramValue == 'high' || paramValue == 'normal' || paramValue == 'low') {
          jsonGif.quality = paramValue;
        } else {
          console.log('Invalid quality is given, it is set to the default value(low).');
        }
        break;
      case 'startTime':
        jsonGif.startTime = paramValue;
        break;
      case 'duration':
        if (paramValue < 0) {
          console.log('Duration is negative, it is set to 0.');
          jsonGif.duration = 0;
        } else if (paramValue > 20) {
          console.log('Duration is higher than 20, it is set to 20.');
          jsonGif.duration = 20;
        } else {
          jsonGif.duration = paramValue;
        }
        break;
      case 'filterId':
        jsonGif.filterId = paramValue;
        break;
      case 'resolution':
        if (paramValue < 0) {
          console.log('Invalid resolution is given, it is set to the default value(480).');
        }
        if ((paramValue % 2) == 1) {
          paramValue--;
        }
        jsonGif.resolution = paramValue;
        break;
      case 'textId':
        jsonGif.textId = paramValue;
        break;
      case 'textStyleId':
        jsonGif.textStyleId = paramValue;
        break;
      case 'textColor':
        if (paramValue.length == 6) {
          jsonGif.textColor = paramValue;
        }
        break;
    }
  }
  return jsonGif;
};
