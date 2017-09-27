var npmProperties = require('../../../package.json');

module.exports = {
  title: 'Image Voter',
  description: npmProperties.description,
  port: 3017,
  liveReloadPort: 3018,
  mute: false,
  showStats: true,
  homeAndAway: false,
  size: {
    x: 1024,
    y: 768
  },
  //analyticsId: 'UA-50892214-2'
};
