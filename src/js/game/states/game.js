const game = {};
const _ = require('underscore');
const preloader = require('./preloader.js');
const allowedTypes = ['jpg', 'png', 'jpeg'];
let setID = 0;
let countID = 0;
let readingComplete = false;
let loadingComplete = false;
let sets = {};

game.create = function () {
  game.prepSet();
  document.getElementById('getval').addEventListener('change', this.readURL, true);
  this.game.load.onLoadComplete.add(game.loadComplete, this);
};

game.prepSet = function () {
  setID++;
  sets['set' + String(setID)] = [];
}

game.readURL = function(){
  console.log('Loading...');
  const input = document.getElementById("getval");
  let reader = new FileReader();
  let fileArr = []
  let file;

  for(let item of input.files){
    fileArr.push(item);
  }

  let readFiles = function() {
    if(fileArr.length > 0){
      file = fileArr.shift()
      let extension = file.name.split('.').pop();
      if(allowedTypes.indexOf(extension) >= 0){
        reader.readAsDataURL(file);
      }
      else {
        console.log('Ignoring file:', file.name);
        readFiles();
      }
    }
    else
    {
      readingComplete = true;
    }
  }

  reader.onloadend = function(e){
    let result = reader.result;
    game.loadResult(result);
    readFiles();
  }
  readFiles();
}

game.loadResult = function (result) {
  countID++;
  let imgID = "set" + String(setID) + '_' + String(countID)
  this.game.load.image(imgID, result);
  this.game.load.start();
  sets['set' + String(setID)].push(imgID);
}

game.loadComplete = function () {
  if(readingComplete === true){
    loadingComplete = true;
    game.genNewPair();
  }
}

game.genNewPair = function () {
  const newPics = _.sample(sets['set' + String(setID)], 2)
  let img1 = this.addPic(0, newPics[0]);
  let img2 = this.addPic(1, newPics[1]);
}

game.addPic = function (pos, imgID) {
  const posArr = [[256, this.game.world.centerY], [768, this.game.world.centerY]];
  const pic = this.game.add.sprite(posArr[pos][0], posArr[pos][1], imgID);
  const maxX = this.game.world.width / 2;
  const maxY = this.game.world.height;
  console.log(maxX, maxY);
  const scaleX = maxX / pic.width;
  const scaleY = maxY / pic.height;
  pic.anchor.setTo(0.5, 0.5);
  pic.scale.x = pic.scale.y = Math.min(scaleX, scaleY);
  return pic
}

module.exports = game;
