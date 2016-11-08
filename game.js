exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function(output) {
  this.players          = new Array();
  this.places           = new Array(6);
  this.purses           = new Array(6);
  this.inPenaltyBox     = new Array(6);

  this.popQuestions     = new Array();
  this.scienceQuestions = new Array();
  this.sportsQuestions  = new Array();
  this.rockQuestions    = new Array();

  this.currentPlayer    = 0;
  this.isGettingOutOfPenaltyBox = false;

  this.outputHandler = output;

  this.didPlayerWin = function(){
    return !(this.purses[this.currentPlayer] == 6)
  };

  this.currentCategory = function(){
    if(this.places[this.currentPlayer] == 0)
      return 'Pop';
    if(this.places[this.currentPlayer] == 4)
      return 'Pop';
    if(this.places[this.currentPlayer] == 8)
      return 'Pop';
    if(this.places[this.currentPlayer] == 1)
      return 'Science';
    if(this.places[this.currentPlayer] == 5)
      return 'Science';
    if(this.places[this.currentPlayer] == 9)
      return 'Science';
    if(this.places[this.currentPlayer] == 2)
      return 'Sports';
    if(this.places[this.currentPlayer] == 6)
      return 'Sports';
    if(this.places[this.currentPlayer] == 10)
      return 'Sports';
    return 'Rock';
  };

  this.createRockQuestion = function(index){
    return "Rock Question "+index;
  };

  for(var i = 0; i < 50; i++){
    this.popQuestions.push("Pop Question "+i);
    this.scienceQuestions.push("Science Question "+i);
    this.sportsQuestions.push("Sports Question "+i);
    this.rockQuestions.push(this.createRockQuestion(i));
  };

  this.isPlayable = function(){
    return this.howManyPlayers() >= 2;
  };

  this.add = function(playerName){
    this.players.push(playerName);
    this.places[this.howManyPlayers() - 1] = 0;
    this.purses[this.howManyPlayers() - 1] = 0;
    this.inPenaltyBox[this.howManyPlayers() - 1] = false;

    this.outputHandler(playerName + " was added");
    output("They are player number " + this.players.length);

    return true;
  };

  this.howManyPlayers = function(){
    return this.players.length;
  };


  this.askQuestion = function(){
    if(this.currentCategory() == 'Pop')
      this.outputHandler(this.popQuestions.shift());
    if(this.currentCategory() == 'Science')
      this.outputHandler(this.scienceQuestions.shift());
    if(this.currentCategory() == 'Sports')
      this.outputHandler(this.sportsQuestions.shift());
    if(this.currentCategory() == 'Rock')
      this.outputHandler(this.rockQuestions.shift());
  };

  this.roll = function(roll){
    this.outputHandler(this.players[this.currentPlayer] + " is the current player");
    this.outputHandler("They have rolled a " + roll);

    if(this.inPenaltyBox[this.currentPlayer]){
      if(roll % 2 != 0){
        this.isGettingOutOfPenaltyBox = true;

        this.outputHandler(this.players[this.currentPlayer] + " is getting out of the penalty box");
        this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
        if(this.places[this.currentPlayer] > 11){
          this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
        }

        this.outputHandler(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
        this.outputHandler("The category is " + this.currentCategory());
        this.askQuestion();
      }else{
        this.outputHandler(this.players[this.currentPlayer] + " is not getting out of the penalty box");
        this.isGettingOutOfPenaltyBox = false;
      }
    }else{

      this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
      if(this.places[this.currentPlayer] > 11){
        this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
      }

      this.outputHandler(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
      this.outputHandler("The category is " + this.currentCategory());
      this.askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function(){
    if(this.inPenaltyBox[this.currentPlayer]){
      if(this.isGettingOutOfPenaltyBox){
        this.outputHandler('Answer was correct!!!!');
        this.purses[this.currentPlayer] += 1;
        this.outputHandler(this.players[this.currentPlayer] + " now has " +
                    this.purses[this.currentPlayer]  + " Gold Coins.");

        var winner = this.didPlayerWin();
        this.currentPlayer += 1;
        if(this.currentPlayer == this.players.length)
          this.currentPlayer = 0;

        return winner;
      }else{
        this.currentPlayer += 1;
        if(this.currentPlayer == this.players.length)
          this.currentPlayer = 0;
        return true;
      }



    }else{

      this.outputHandler("Answer was correct!!!!");

      this.purses[this.currentPlayer] += 1;
      this.outputHandler(this.players[this.currentPlayer] + " now has " +
                  this.purses[this.currentPlayer]  + " Gold Coins.");

      var winner = this.didPlayerWin();

      this.currentPlayer += 1;
      if(this.currentPlayer == this.players.length)
        this.currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = function(){
		this.outputHandler('Question was incorrectly answered');
		this.outputHandler(this.players[this.currentPlayer] + " was sent to the penalty box");
		this.inPenaltyBox[this.currentPlayer] = true;

    this.currentPlayer += 1;
    if(this.currentPlayer == this.players.length)
      this.currentPlayer = 0;
		return true;
  };
};

//Function that handles the out put
var outputHandler = function(text) {
  console.log(': >>> ' + text)
}

var notAWinner = false;

var game = new Game(outputHandler);

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(notAWinner);
