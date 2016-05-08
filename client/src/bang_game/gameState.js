var Player = require('./player.js');
var Game = require('./game.js');
var Dice = require('./dice.js');

var GameState = function(game){
  this.gamePassedIn = game;
  this.savedGame = null;
  this.hydratedGame = null;
  this.forceNew = false;
  this.gameToSave = null;
}; // constructor [end]

GameState.prototype.save = function(){
  localStorage.setItem("bang_the_JS_game_save", JSON.stringify(this.gameToSave));
  console.log("saved this game to localStorage:", this.gameToSave);
}

GameState.prototype.load = function(){
  var loadReturn =  JSON.parse(localStorage.getItem("bang_the_JS_game_save"));
  this.savedGame = loadReturn;
  console.log("retrieved this game from localStorage:", loadReturn);
  
  if (!this.savedGame || this.savedGame.wonBy || this.forceNew){
    this.gameToSave = this.gamePassedIn;
    return this.gamePassedIn;
  }

  if (this.savedGame && !this.savedGame.wonBy && !this.forceNew) {
    console.log("unfinished game found in storage - rehydrating objects...");

    var hydratedDice = new Dice(this.savedGame.dice);
    var hydratedPlayers = new Array();
    var hydratedAllPlayers = new Array();

    for (var i = 0; i < this.savedGame.allPlayers.length; i++){
      hydratedAllPlayers.push(new Player("dummy name", this.savedGame.allPlayers[i]))
    }

    for (var i = 0; i < hydratedAllPlayers.length; i++){
      for (var j = 0; j < this.savedGame.players.length; j++){
        if (hydratedAllPlayers[i].name === this.savedGame.players[j].name){
          hydratedPlayers[j] = hydratedAllPlayers[i].rehydrate(this.savedGame.players[j]);
        }
      }
    }
    var characterMaxHealthValues = this.savedGame.characterMaxHealthValues;
    this.hydratedGame = new Game(hydratedDice, hydratedPlayers, characterMaxHealthValues, this.savedGame, hydratedAllPlayers);
    this.gameToSave = this.hydratedGame;
    return this.hydratedGame;
  }// if we want to use saved game - if statement end
}

module.exports = GameState;