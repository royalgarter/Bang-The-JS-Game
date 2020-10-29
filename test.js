var Game = require('./client/src/bang_game/game');
var Player = require('./client/src/bang_game/player');
var Dice = require('./client/src/bang_game/dice');

var players = new Array(8);
for (var i = 0; i < players.length; i++) {
	players[i] = new Player("Player " + (i + 1))
};

var game = new Game(new Dice(), players, true);
game.setup();

const fs = require('fs');
const async = require('async');
const readline = require('readline-sync');
const chalk = require('chalk')
const { inspect, promisify, callbackify } = require('util');
const ip = inspect;
inspect.defaultOptions.depth = 3;

const G = {};

G.r = G.rollDice = function() {
	game.dice.roll();
	game.resolveArrows();
	G.currentPlayerDied();
	game.checkForDeaths();
	if (game.dice.canRoll() === false) {
		game.addToActionCounters();
	}

	if (game.dice.threeDynamite()) {
		game.dynamiteExplodes();
	}

	G.currentPlayerDied();
};

G.pa = G.pickAllDice = function() {
	for (var i = 1; i <=5; i++) {
		G.pickDice(i);
	}
};

G.p = G.pickDice = function(diceNumber) {
	diceNumber = parseInt(diceNumber) - 1;
	var diceValue = game.dice.all[diceNumber]
	if (diceValue !== 5) game.dice.save(diceValue)
	G.diceRollFinished();
};

G.e = G.endTurn = function() {
	G.fireGatling();
	game.nextTurn(false, null);
	// gameState.save(); // save state of the game at another time without resetting dice and rotating players and in theory we could possibly continue the turn with the dice and rerolls remembered
}

G.t = G.targetPlayer = function(playerIndex) {
	playerIndex = parseInt(playerIndex) - 1;
	game.players[0].target = game.allPlayers[playerIndex];
};

G.t0 = G.cleartargetPlayer = function() {
	game.players[0].target = null;
};

G.h = G.healTarget = function(...targets) {
	if (!targets.length) {
		game.beerTarget();
		game.checkActions()	
	} else {
		for (var i = 0; i < targets.length; i++) {
			G.targetPlayer(targets[i]);
			game.beerTarget();
			game.checkActions()
		}
	}
};

G.s = G.shootTarget = function(...targets) {
	if (!targets.length) {
		game.shootTarget();
		game.checkActions()	
	} else {
		for (var i = 0; i < targets.length; i++) {
			G.targetPlayer(targets[i]);
			game.shootTarget();
			game.checkActions()
		}
	}
};

G.currentPlayerDied = function() {
	if (game.players[0].health > 0) return false;
	return true
};

G.diceRollFinished = function() {
	if (game.dice.canRoll() === false) {
		game.addToActionCounters();
		if (game.checkActions()) {}
		game.addToActionCounters();
		if (game.checkActions() <= 0) {
			G.fireGatling();
		}
	}
};

G.fireGatling = function() {
	if (game.gatlingCheck()) {
		game.fireGatling();
		game.checkForDeaths();
	}
};

G.renderAction = (actionCounters, meaning) => {
	let text = [];

	for (let k in actionCounters) {
		let item = ` ${meaning[k].replace(/\s/g,'')}: ${actionCounters[k]} `

		switch (k) {
			case '1':
			case '2':
				text.push(chalk.inverse(item));
				break;
			case '3':
				text.push(chalk.bgYellow(item));
				break;
			case '4':
				text.push(chalk.bgGreen(item));
				break;
			case '5':
				text.push(chalk.bgRed(item));
				break;
			case '6':
				text.push(chalk.bgCyan(item));
				break;
		}
	}

	return text.join('');
};

G.render = function() {
	let ps = ['\n'];

	for (var i = 0; i < game.players.length; i++) {
		let p = game.players[i];

		let text = [
			chalk.green(`${p.name}`),
			chalk.cyan(`${p.character.name.substr(0,8)}`),
			chalk.magenta(`${p.role.name.substr(0,6)}`),
			chalk.blue(`<Arrow: ${p.arrows}>`),
			chalk.red(`[Health: ${p.health}/${p.maxHealth}]\t`),
			`${G.renderAction(p.actionCounters, game.dice.meaningOf)}`,
			chalk.gray(`\n${p.character.abilityDescription}`),
		];

		ps.push(i==0?chalk.bold(text.join(' ')):text.join(' '));
	}

	let d = { ...game.dice};
	delete d.imageUrl;
	delete d.meaningOf;
	ps.push(chalk.yellow(`DICE:\n${ip(d)}`))

	ps.push(chalk.magenta(`${game.players[0].name} <target>>> ${game.players[0].target?game.players[0].target.name:''}`))
	ps.push(chalk.green(`HEAL:${game.canHeal()} SHOOT1:${game.canShoot1()} SHOOT2:${game.canShoot2()}`))

	return ps.join('\n---\n')
};

// console.log("Active game:", game);
let step = 0;
const log = (...agrs) => {
	step++;
	console.clear();
	fs.writeFileSync('STEP.js', inspect(game));
	console.log.apply(null, ['STEP', step, ...agrs]);
}

log(G.render());
async.forever(
	next => {
		let line = readline.question('\n\n>>>:');
		let words = line.split(' ');
		let fn = words[0];
		let args = words.slice(1);
		// console.log('fn', fn, 'args', args)

		if (!G[fn]) return next();

		G[fn].apply(null, args);

		log(G.render());

		next();
	},
	err => console.log(err)
);