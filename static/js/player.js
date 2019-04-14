module.exports = function Player(name, socket){

    this.name = "";
    this.id = "";
    this.chips = 5000;
    this.numberOfWins = 0;
    this.numberOfLosses = 0;
    this.socket = socket;
    this.showControls = false;
    this.turn = false;
    this.currentHand;
    this.currentScore;
    this.currentAceScore;
    this.aceFound = false;
    this.blackjack = false;
    this.bust = false;
}