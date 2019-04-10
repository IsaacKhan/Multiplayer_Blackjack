module.exports = function Dealer(name, socket){

    this.singleCardScore = 0;
    this.singleCardAceScore = 0;
    this.secondCardRevealed = false;
    this.socket = socket;
    this.turn = false;

    this.currentHand = hand;
    this.currentScore = score;
    this.currentAceScore = aceScore;
    this.aceFound = false;
    this.blackjack = false;
    this.bust = false;
}