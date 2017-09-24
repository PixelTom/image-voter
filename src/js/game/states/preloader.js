const preloader = {};
let picArray = [];

preloader.preload = function () {
  for(let i = 1; i <= 20; i++)
  /*{ Old Pool, no longer used.
    this.game.load.image('pic' + String(i), 'images/pool/' + String(i) + '.jpg');
    picArray.push('pic' + String(i));
  }*/
  this.game.load.image('logo', 'images/phaser.png');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = {
  preloader,
  picArray
}