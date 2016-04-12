var Game = function(dice, players){
  this.players = players;
  this.allPlayers = [];
  this.characters = [];
  this.totalArrows = 9;
  this.dice = dice;
  this.roles = ["Sheriff", "Deputy", "Deputy", "Outlaw", "Outlaw", "Outlaw", "Renegade", "Renegade"];

  var character1 = {
    name: "Jesse Jones",
    health: 9,
    imgUrl: "http://i.imgur.com/bRkKXmX.png",
    ability_description: "If you have four life points or less, you gain two if you use [Beer] for yourself."
  };
  var character2 = {
    name: "Kit Carlson",
    health: 7,
    imgUrl: "http://i.imgur.com/BZIfBge.png",
    ability_description: "For each [Gatling] you may discard one arrow from any player."
  };
  var character3 = {
    name: "Black Jack",
    health: 8,
    imgUrl: "http://i.imgur.com/KUrKkis.png",
    ability_description: "You may re-roll [Dynamite]. (Not if you roll three or more!)"
  };
  var character4 = {
    name: "Rose Doolan",
    health: 9,
    imgUrl: "http://i.imgur.com/Hdcp0p1.png",
    ability_description: "You may use [Shoot 1] or [Shoot 2] for players sitting one place further."
  };
  var character5 = {
    name: "Pedro Ramirez",
    health: 8,
    imgUrl: "http://i.imgur.com/WcU2f2w.png",
    ability_description: "Each time you lose a life point, you may discard one of your arrows."
  };
  var character6 = {
    name: "El Gringo",
    health: 7,
    imgUrl: "http://i.imgur.com/OF8OH13.png",
    ability_description: "When a player makes you lose one or more life points, they must take an arrow."
  };
  var character7 = {
    name: "Bart Cassidy",
    health: 8,
    imgUrl: "http://i.imgur.com/e8oZGYx.png",
    ability_description: "You may take an arrow instead of losing a life point (except to Arrows or Dynamite)."
  };
  var character8 = {
    name: "Vulture Sam",
    health: 9,
    imgUrl: "http://i.imgur.com/1HkWchT.png",
    ability_description: "Each time another player is eliminated, you gain two life points."
  };
  var character9 = {
    name: "Calamity Janet",
    health: 8,
    imgUrl: "http://i.imgur.com/OY1CiiX.png",
    ability_description: "You can use [Shoot 1] as [Shoot 2] and vice-versa."
  };
  var character10 = {
    name: "Jourdonnais",
    health: 7,
    imgUrl: "http://i.imgur.com/tXiiB6L.png",
    ability_description: "You never lose more than one life point to Arrows."
  };
  var character11 = {
    name: "Slab the Killer",
    health: 8,
    imgUrl: "http://i.imgur.com/hlVk73M.png",
    ability_description: "Once per turn, you can use a [Beer] to double a [Shoot 1] or [Shoot 2]."
  };
  var character12 = {
    name: "Sid Ketchum",
    health: 8,
    imgUrl: "http://i.imgur.com/cXVoKTA.png",
    ability_description: "At the beginning of your turn, any player of your choice gains one life point."
  };
  var character13 = {
    name: "Suzy Lafayette",
    health: 8,
    imgUrl: "http://i.imgur.com/KfiWFxk.png",
    ability_description: "If you didn't roll any [Shoot 1] or [Shoot 2] you gain two life points."
  };
  var character14 = {
    name: "Paul Regret",
    health: 9,
    imgUrl: "http://i.imgur.com/UFADg9e.png",
    ability_description: "You never lose life points to the Gatling Gun."
  };
  var character15 = {
    name: "Lucky Duke",
    health: 8,
    imgUrl: "http://i.imgur.com/F6GioiG.png",
    ability_description: "You may mae one extra re-roll"
  };
  var character16 = {
    name: "Willy the Kid",
    health: 8,
    imgUrl: "http://i.imgur.com/580j9rS.png",
    ability_description: "You only need 2x [Gatling] to use the Gatling Gun."
  };
  this.characters = [character1, character2, character3, character4, character5, character6, character7, character8, character9, character10, character11, character12, character13, character14, character15, character16];


};

var getUniqueRandomElement = function(array){
  var index = Math.floor((Math.random()*array.length));
  var choice = array[index];
  array.splice(index, 1);
  return choice;
};




Game.prototype.setup = function(){
  this.assignRoles();
  this.assignCharacters();
  this.setAllHealth();
  this.savePlayers();
  this.rotateSheriffToFirst();
};

Game.prototype.rotateSheriffToFirst = function(){
  var sheriffIndex;
  for (var i = 0; i < this.players.length; i++){
    if (this.players[i].role === "Sheriff"){
      sheriffIndex = i;
    }
  }
  this.rotatePlayers(sheriffIndex);
};

Game.prototype.setAllHealth = function(){
  for (var i = 0; i < this.players.length; i++){
    this.players[i].setHealth();
  }
};

Game.prototype.assignRoles = function(){
  for (var i = 0; i < this.players.length; i++){
    this.players[i].role = getUniqueRandomElement(this.roles);
  };
};


Game.prototype.assignCharacters = function(){
  for (var i = 0; i < this.players.length; i++){
    this.players[i].character = getUniqueRandomElement(this.characters);
  };//loop
};

Game.prototype.savePlayers = function(){
  if (this.players.length === 8) {
    this.allPlayers = this.players.slice();
  };
};

Game.prototype.rotatePlayers = function(numSteps){
  // rotates the array the number of times that is passed as an argument
  // if no argument is passed, the OR operator will set loops to 1 as numSteps will be undefined, which is falsey
  var loops = numSteps || 1;
  // ^ this could have been written:
  // - which might be better - passing 0 in deliberately would cause the loops to be set to 1, not 0, when using the OR operator method above - but there's no need to ever rotate the players array 0 times
  // if (numSteps === undefined){
  //   var loops = 1;
  // }
  // else{
  //   var loops = numSteps;
  // };

  for (var i = 0; i < loops; i++){
    //2nd array item becomes first - first becomes last:
    this.players.push(this.players.shift());
    // alternative to rotate the other way:
    // last array item becomes first - first becomes 2nd:
    // this.players.unshift(this.players.pop());
  };
};

Game.prototype.nextTurn = function(){

  ////////////////////////////////////////////////////
  // Adam has stuff to add to this function         //
  ////////////////////////////////////////////////////

  this.checkForDeaths();
  if(this.winCheck()){
    this.end(this.winCheck());
    endGame();
  }
  this.dice.reset();
  this.rotatePlayers();
  // add any other function calls for stuff that needs to happen every time a new turn starts
};

// checks if any players have 0 health - and call the game.removePlayer(player) function on them if so
Game.prototype.checkForDeaths = function(){
  for (var i = 0; i < this.players.length; i++){
    if (this.players[i].health <= 0){
      this.removePlayer(this.players[i]);
    }// "if health is 0" conditional [end]
  };// for loop [end]
  return this.players;
};

Game.prototype.removePlayer = function(player){
  this.players.splice(this.players.indexOf(player), 1);
  return this.players;
};

Game.prototype.winCheckOutlaws = function(){
  if (this.players.length === 0){
    console.log("game.players.length is 0 - winCheckOutlaws is returning an Outlaw victory");
    return "Outlaws win!"
  };
  for (var i = 0; i < this.players.length; i++){
    if (this.players[i].role === "Sheriff") {
      return null;
    }
    else{
      return "Outlaws win!"
    };// if else any player is Sheriff [end]
  }//for loop [end]
};// winConditionOutlaw [end]

Game.prototype.winCheckSheriff = function(){
  var sheriffLives = false;
  var outlawsDead = true;
  var renegadesDead = true;
  for (var i = 0; i < this.players.length;i++){
    if (this.players[i].role === "Sheriff"){
      var sheriffLives = true;
    }
    else if (this.players[i].role === "Outlaw"){
      outlawsDead = false;
    }
    else if (this.players[i].role === "Renegade"){
      renegadesDead = false;
    }
  };// loop end
  if (sheriffLives && outlawsDead && renegadesDead){
    return "Sheriff wins!";
  }
  else{
    return null;
  }

};

Game.prototype.winCheckRenegade = function(){
  if (this.players.length === 1 && this.players[0].role === "Renegade") {
    return "Renegade wins!"
  }
  else{
    return null;
  };
};

Game.prototype.winCheck = function(){
  //all win conditions checked in appropriate order

  // the if else if statement for renegade and outlaw is important, as if the sheriff is dead, the winCheckOutlaws function returns and outlaws win - this is often correct - but if a single renegade is alive, and just killed the sheriff - then the renegade wins - so we have to check if the renegade should win first, before reverting to checking if outlaws should win in the far more common case that the renegade is not the only player left alive.

  if (this.winCheckSheriff()){
    return this.winCheckSheriff();
  };

  var outlawCheckResult = this.winCheckOutlaws()
  var renegadeCheckResult = this.winCheckRenegade();

  if (renegadeCheckResult){
    return renegadeCheckResult;
  }
  else if (outlawCheckResult){
    return outlawCheckResult;
  }
  return null;
};


Game.prototype.updateArrows = function(){
  this.players[0].arrows += this.dice.arrowsRolled;
  this.totalArrows -= this.dice.arrowsRolled;
  if( this.totalArrows <= 0 ){
    this.arrowsDamage() /// see below//  would need to loop all players and do player.health - player.arrows;
    this.totalArrows = 9;  /// put arrows back in middle.
  }
};
Game.prototype.arrowsDamage = function(){
  for( var player of this.players){
    player.removeHealthPerArrow();
  }
}



module.exports = Game;
module.exports.randomElement = getUniqueRandomElement;



// create players and game before players have name, add names from form (on first turn?)
// API class to get char (+ role?) + statsData from DB/ our API
// AI - array of players suspected of being on its team - based on who heals / shoots the sheriff
// set of numbers of probability, one for each player being on each team based on actions
//requires log / stats class to check other players actions
// decisions - manually trigger click events


/// 2 - work out how far away other players are from you game.players.length -1 & game.players.length -2 for index 6 & 7.


Game.prototype.addToActionCounters = function(){
  for( var i of this.dice.all){
    this.players[0].actionCounters[i.toString()] += 1;
  };
};
///// counts how many of each dice result (arrow, beer etc) and saves this to the players actionsCounters. 


//// function to know if we should light up/make clickable the shoot button
Game.prototype.canShoot = function(distance){
  if (game.players[0].target === game.players[distance] || game.players[0].target === game.players[game.players.length - distance]){
    console.log("shoot button should light up");
    return true;
  }
  else{
    console.log("you can't reach that player!")
    return false;
  }
  // return (game.players[0].target === game.players[distance] || game.players[0].target === game.players[game.players.length - distance]) ? true : false;
}

