var Game = require('./client/src/bang_game/game');
var Player = require('./client/src/bang_game/player');
var Dice = require('./client/src/bang_game/dice');
var Hint = require('./client/src/bang_game/hint');
var GameState = require("./client/src/bang_game/gameState.js");
var View = require("./client/src/bang_game/view.js");
var hint = new Hint;
var players = new Array(8);
for (var i = 0; i < players.length; i++) {
	players[i] = new Player("Player " + (i + 1))
};
var characterMaxHealthValues = true;
var game = new Game(new Dice(), players, characterMaxHealthValues);
game.setup();
var gameState = new GameState(game);
game = gameState.load();

var view = new View(gameState, game);
view.hint = hint;

const fs = require('fs');
const async = require('async');
const readline = require('readline-sync');
const {inspect, promisify, callbackify} = require('util');
const ip = inspect;
inspect.defaultOptions.depth = 3;

const G = {};

G.r = G.rollDice = function(){
	game.dice.roll();
	game.resolveArrows();
	G.currentPlayerDied();
	game.checkForDeaths();
	if(game.dice.canRoll() === false){
		game.addToActionCounters();
	}

	if (game.dice.threeDynamite()) {
		game.dynamiteExplodes();
	}

	G.currentPlayerDied();
}

G.sa = G.setAllDice = function(){
	for (var i = 0; i < 5; i++){
    	G.setDice(i);
  	}
}

G.s = G.setDice = function(diceNumber){
	diceNumber = parseInt(diceNumber) - 1;
	var diceValue = game.dice.all[diceNumber]
    if (diceValue !== 5) game.dice.save(diceValue)
    G.diceRollFinished();
}

G.e = G.endTurn = function(){
	G.fireGatling();
    game.nextTurn(false, gameState);
    gameState.save(); // save state of the game at another time without resetting dice and rotating players and in theory we could possibly continue the turn with the dice and rerolls remembered
}

G.t = G.targetPlayer = function(playerIndex){
	playerIndex = parseInt(playerIndex) - 1;
	if(game.players[0].target === game.allPlayers[playerIndex]){
      game.players[0].target = null;
    }else{
      game.players[0].target = game.allPlayers[playerIndex];
    }

    
}

G.h = G.healTarget = function(){
	game.beerTarget();
	game.checkActions()
}

G.sh = G.shootTarget = function(){
	if(game.players[0].target.health < 2){
      var shootMessage = 'You killed ' + game.players[0].target.name
    } else {
      var shootMessage = 'You shot ' + game.players[0].target.name
    }
    game.shootTarget();
    game.checkActions()
}

G.currentPlayerDied = function(){
	if(game.players[0].health > 0) return false;
	return true
};

G.diceRollFinished = function(){
  if (game.dice.canRoll() === false){
    game.addToActionCounters();
    if (game.checkActions()){
    }
    game.addToActionCounters();
    if (game.checkActions() <= 0){
      G.fireGatling();
    }
  }
};

G.fireGatling = function(){
  if(game.gatlingCheck()){
    game.fireGatling();
    game.checkForDeaths();
  }
};

G.renderAction = (actionCounters, meaning) => {
	let obj = {};

	for (let k in actionCounters) {
		obj[meaning[k]] = actionCounters[k];
	}

	return obj;
}

G.render = function(){
	let ps = ['\n'];
	game.players.forEach(p => {
		let text = `${p.name} - ${p.character.name.substr(0,8)} - ${p.role.name.substr(0,6)} ${p.target?'@'+p.target.name:''}\t<A:${p.arrows}> [H:${p.health}/${p.maxHealth}]\t${JSON.stringify(G.renderAction(p.actionCounters, game.dice.meaningOf))}`;
		ps.push(text);
	})

	let d = {...game.dice};
	delete d.imageUrl;
	delete d.meaningOf;
	ps.push(`${ip(d)}`)

	ps.push(`HEAL:${game.canHeal()} SHOOT1:${game.canShoot1()} SHOOT2:${game.canShoot2()}`)

	return ps.join('\n---\n')
}

// console.log("Active game:", game);
let step = 0;
const log = (...agrs) => {
	step++;
	console.clear();
	fs.writeFileSync('STEP.js', inspect(game));
	console.log.apply(null, ['STEP', step, ...agrs]);
}

async.forever(
    next => {
    	let line = readline.question('\n\n>>>:');
    	let words = line.split(' ');
    	let fn = words[0];
    	let args = words.slice(1);
    	console.log('fn', fn, 'args', args)

    	if (!G[fn]) return next();

    	G[fn].apply(null, args);

    	log(G.render());

    	next();
    },
    err => console.log(err)
);