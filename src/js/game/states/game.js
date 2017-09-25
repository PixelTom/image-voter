const WIN   = 'win'
const DRAW  = 'draw'
const PURGE = 'purge'
const BYE   = 'bye'

const game = {};
const _ = require('underscore');
const preloader = require('./preloader.js');
const allowedTypes = ['jpg', 'png', 'jpeg'];
let setID = 0;
let countID = 0;
let matchID = 0
let readingComplete = false;
let loadingComplete = false;
let sets = {};
let teams = []
let draw = []
let teamsToLoad = []
let loadedTeams = []
let reader = new FileReader();

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
  // Generate the teams
  let generateTeams = function(input){
    let i = 0

    let validateItem = function(item){
      let extension = item.name.split('.').pop();
      if(allowedTypes.indexOf(extension) >= 0){
        return true
      }
      console.log('Ignoring file:', item.name);
      return false
    }

    let newTeam = function(item, i){
      return {
        file: item,
        id: i,
        purged: false,
        win: 0,
        draw: 0,
        loss: 0,
        points: 0
      }
    }
    // Make each team
    for(let item of input.files){
      if(validateItem(item)){
        teams.push(newTeam(item, i))
        i++
      }
    }
    // Push a bye if odd teams
    if(teams.length % 2 != 0){
      teams.push(newTeam(BYE, i))
    }
    return teams
  }
  // Generate the draw
  let generateDraw = function(teams){
    console.log('generateDraw', teams.length, 'teams')
    let arr = []
    for(let i = 0; i < teams.length; i++){
      for(let j = 0; j < teams.length; j++){
        if(i != j){
          arr.push({
            home: teams[i],
            away: teams[j]
          })
        }
      }
    }
    arr = _.shuffle(arr)
    return arr
  }

  teams = generateTeams(input)
  draw = generateDraw(teams)
  console.log('Ready to play', draw.length, 'matches')

  game.generateMatch()
}

game.generateMatch = function(){
  let matchInfo = draw.pop()
  this.loadTeams(matchInfo.home, matchInfo.away)
}

game.endMatch = function(winner, loser, draw = false, purge = false){
  if(draw){
    winner.draw++
    loser.draw++
  }else{
    winner.win++
    loser.loss++
  }
  if(purge){
    loser.purged = true
  }
}

game.loadTeams = function(home, away){
  let readFiles = function(){
    const team = teamsToLoad.shift()
    if(teamsToLoad.length <= 0) readingComplete = true
    reader.readAsDataURL(team.file);
  }

  reader.onloadend = function(e){
    const result = reader.result;
    game.loadResult(result);
    if(teamsToLoad.length > 0) readFiles();
  }

  if(home.file === BYE){
    this.endMatch(away, home)
  }else if(away.file === BYE){
    this.endMatch(home, away)
  }else{
    teamsToLoad = [home, away]
    readFiles()
    /*for(team of [home, away]){
      reader.readAsDataURL(team.file);
    }*/
  }

    /*file = teams.shift().file
    let extension = file.name.split('.').pop();
    if(allowedTypes.indexOf(extension) >= 0){
      reader.readAsDataURL(file);
    }
    else {
      console.log('Ignoring file:', file.name);
      readFiles();
    }*/

}

game.loadResult = function (result) {
  console.log("loading image")
  countID++;
  let imgID = "set" + String(setID) + '_' + String(countID)
  this.game.load.image(imgID, result);
  this.game.load.start();
  sets['set' + String(setID)].push(imgID);
}

game.loadComplete = function () {
  console.log('loadComplete')
  if(readingComplete === true){
    loadingComplete = true;
    game.genNewPair();
  }
}

game.genNewPair = function () {
  console.log('genNewPair')
  const newPics = _.sample(sets['set' + String(setID)], 2)
  let img1 = this.addPic(0, newPics[0]);
  let img2 = this.addPic(1, newPics[1]);
}

game.addPic = function (pos, imgID) {
  console.log('addPic')
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
