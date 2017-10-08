const WIN   = 'win'
const DRAW  = 'draw'
const PURGE = 'purge'
const BYE   = 'bye'
const HOME  = 'home'
const AWAY  = 'away'
const BOTH  = 'both'

const game = {};
const _ = require('underscore');
const preloader = require('./preloader.js');
const properties = require('./../properties');
const allowedTypes = ['jpg', 'png', 'jpeg', 'gif'];
let countID = 0;
let total = 0
let teams = []
let draw = []
let teamsToLoad = []
let loadedTeams = []
let toBeDeleted = []
let imageGroup;
let uiGroup;

// ============================================================0
//
// ============================================================0
game.create = function () {
  game.add.sprite(0, 0, 'background');
  imageGroup = game.add.group()
  console.log('imageGroup', imageGroup)
  uiGroup = game.add.group()
  game.createButtons()
  game.createMatchCounter()
  document.getElementById('getval').addEventListener('change', this.readURL, true);
};

// ============================================================0
//
// ============================================================0
game.createButtons = function(){
  let btnHomeWin    = this.genButton(152, 640, 'btnWin', HOME, WIN)
  let btnAwayWin    = this.genButton(695, 640, 'btnWin', AWAY, WIN)
  let btnDraw       = this.genButton(424, 677, 'btnDraw', BOTH, DRAW)
  let btnHomePurge  = this.genButton(152, 704, 'btnPurge', HOME, PURGE)
  let btnAwayPurge  = this.genButton(695, 704, 'btnPurge', AWAY, PURGE)
}


// ============================================================0
//
// ============================================================0
game.createMatchCounter = function(){
  let txtCounter  = game.make.text(0, 0, "Load files to begin...")
  txtCounter.name = 'txtCounter'
  uiGroup.add(txtCounter)
}

// ============================================================0
//
// ============================================================0
game.genButton = function(x, y, key, side, result){
    let btn = uiGroup.add(new Phaser.Button(this.game, x, y, key))
    btn.side = side
    btn.result = result
    btn.events.onInputDown.add(game.clickHandler)
  }

// ============================================================0
//
// ============================================================0
game.clickHandler = function(button, mouse){
  if(loadedTeams.length < 2){
    console.error("loadedTeams.length error: does not match 2, result:", loadedTeams.length)
    return
  }
  let side = button.side
  let result = button.result
  let home = loadedTeams[0]
  let away = loadedTeams[1]
  switch(side){
    case BOTH:
      game.endMatch(home, away, true)
    break
    case HOME:
      if(result == WIN){
        game.endMatch(home, away)
      }else{
        game.endMatch(away, home, false, true)
      }
    break
    case AWAY:
      if(result == WIN){
        game.endMatch(away, home)
      }else{
        game.endMatch(home, away, false, true)
      }
    break
  }
}

// ============================================================0
//
// ============================================================0
game.readURL = function(){
  console.log('Loading...');
  const input = document.getElementById("getval");
  // Generate the teams
  // --------------------------------------------------o
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

    // --------------------------------------------------o
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
  // --------------------------------------------------o
  // Generate the draw
  let generateDraw = function(teams){
    console.log('generateDraw', teams.length, 'teams')
    let arr = []
    // Every team plays every team twice
    if(properties.homeAndAway === true){
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
    // Every team plays every team once
    }else{
      for(let i = 0; i < teams.length; i++){
        for(let j = i + 1; j < teams.length; j++){
          let shuff = _.shuffle([i, j])
          arr.push({
            home: teams[shuff[0]],
            away: teams[shuff[1]]
          })
        }
      }
    }
    arr = _.shuffle(arr)
    return arr
  }

  teams = generateTeams(input)
  draw = generateDraw(teams)
  total = draw.length
  game.updateText('Ready to play ' + total + ' matches')

  game.generateMatch()
}

// ============================================================0
//
// ============================================================0
game.updateText = function(text){
  let txtCounter = uiGroup.getByName('txtCounter')
  txtCounter.text = text
}

// ============================================================0
//
// ============================================================0
game.generateMatch = function(){
  console.log('=============================')
  console.log('Generate Match')
  console.log('test', teams.length)
  if(draw.length <= 0){
    console.log("Done son")
    let toBeDeleted = []
    for(var team of teams){
      if(team.purged || team.file === BYE){
        team.points = -1
        toBeDeleted.push(team)
      }
    }
    for(team in toBeDeleted){
      teams = _.without(teams, team)
    }
    console.log('toBeDeleted', toBeDeleted)
    console.log('test', teams.length)
    game.showTen(0)
  }else{
    const matchInfo = draw.pop()
    game.updateText('Match: ' + (total - draw.length) + '/' + total)
    this.loadTeams(matchInfo.home, matchInfo.away)
  }
}

// ============================================================0
//
// ============================================================0
game.showTen = function(id){
  const frameWidth = properties.size.x / 5
  const frameHeight = properties.size.y / 2
}

// ============================================================0
//
// ============================================================0
game.dudMatch = function(home, away){
  home.loss++
  away.loss++
  game.generateMatch()
}

// ============================================================0
//
// ============================================================0
game.endMatch = function(winner, loser, draw = false, purge = false){
  console.log('End Match')
  console.log('=============================')
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
  // Remove images from the imageGroup (should be only two)
  for(let team of loadedTeams){
    if(team.pic) team.pic.destroy(true, true)
  }
  game.generateMatch()
}

// ============================================================0
//
// ============================================================0
game.loadTeams = function(home, away){
  console.log('Load Teams')
  console.log('Home:', home)
  console.log('Away:', away)
  let team
  let readingComplete = false
  let reader = new FileReader();

  // --------------------------------------------------o
  let readFiles = function(){
    console.log('readFiles', teamsToLoad.length, 'files to go')
    team = teamsToLoad.shift()
    loadedTeams.push(team)
    if(teamsToLoad.length <= 0) readingComplete = true
    reader.readAsDataURL(team.file);
  }
  // --------------------------------------------------o
  reader.onloadend = function(e){
    const result = reader.result;
    console.log('Loadend, loadingResult')
    countID++;
    team.imgID = 'teamImg_' + String(countID)
    game.load.image(team.imgID, result);
    game.load.start();
  }
  // --------------------------------------------------o
  let loadComplete = function () {
    if(readingComplete === true){
      game.load.onLoadComplete.remove(loadComplete, this)
      this.addPic(0, loadedTeams[0]);
      this.addPic(1, loadedTeams[1]);
    }else{
      readFiles();
    }
  }

  teamsToLoad = []
  loadedTeams = []

  let skip = (home.file === BYE || home.purged === true) && (away.file === BYE || away.purged === true)
  if(skip){
    this.dudMatch(away, home)
  }else{
    // If one of the teams is a BYE team, auto-complete the match
    if(home.file === BYE || home.purged === true){
      console.log('AWAY vs BYE or PURGED')
      this.endMatch(away, home)
    }else if(away.file === BYE || away.purged === true){
      console.log('HOME vs BYE or PURGED')
      this.endMatch(home, away)
    }else{
      game.load.onLoadComplete.add(loadComplete, this);
      teamsToLoad = [home, away]
      readFiles()
    }
  }
}

// ============================================================0
// Add a loaded image to the canvas
// ============================================================0
game.addPic = function (pos, team) {
  let clickPic = function(target, pointer){
    // Scale up the image and move it to the middle
    // Hide UI and other image
    // On second click, send everything back to their original position
  }

  const posArr  = [[256, this.game.world.centerY], [768, this.game.world.centerY]];
  const pic     = this.game.make.sprite(posArr[pos][0], posArr[pos][1], team.imgID);
  const maxX    = this.game.world.width / 2;
  const maxY    = this.game.world.height;
  const scaleX  = maxX / pic.width;
  const scaleY  = maxY / pic.height;
  imageGroup.add(pic)
  pic.anchor.setTo(0.5, 0.5);
  pic.scale.x = pic.scale.y = Math.min(scaleX, scaleY);
  pic.inputEnabled = true
  pic.events.onInputDown.add(clickPic)
  team.pic = pic
}

module.exports = game;
