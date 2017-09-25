const preloader = {};
let picArray = [];

preloader.preload = function () {
  this.game.load.image('btnDraw', 'images/draw.png')
  this.game.load.image('btnWin', 'images/win.png')
  this.game.load.image('btnPurge', 'images/purge.png')
  this.game.load.image('logo', 'images/phaser.png');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = {
  preloader,
  picArray
}