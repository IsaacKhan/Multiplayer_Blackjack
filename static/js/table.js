var Player = require('./player');
var Dealer = require('./dealer');

module.exports = function Table() {

    // some of these variables may end up being removed
    // somewhat depends on how the API is going to interact with this class

    var players = [];
    var waitingPlayers = [];
    var offlinePlayers = [];
    var currentPlayerIndex;
    var isGameActive = false;
    var deck;
    var playerTurnTimeoutID;
    var discardedCards = [];
    var id = id;
    var chips;
    var cards;
    var gamePhase;

    this.addPlayer = function(player) {
        if (isGameActive) {
            waitingPlayers.push(player);

        }
        players.push(player);
        createActionsListener(player);
    }
    // Remove players??
    this.removePlayer = function(player) {
        if (waitingPlayers.contains(player)) {

        }
        if (players.contains(player)) {
            players.splice();
        }

    }
    this.getPlayers = function() {
        return players;
    }

    // Moves player into offlinePlayers
    this.moveOffline = function(player){

    }

    this.createDeck = function() {
        fetch(`https://deckofcardsapi.com/api/deck/8m9l3ke6yf8f/shuffle/?deck_count=3`)
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                this.deck = data;

                // TODO: Once We start using real webpages, these will need to change
                document.getElementById("deckcount").textContent = deck.remaining;
                document.getElementById("status").textContent = deck.shuffled;
            })
    }

    // TODO: Modify to fit 
    function changeHandVisibility() {
        // set variables to some HTML elements
        var dHand = document.getElementById("house")
        var pHand = document.getElementById("player")

        // if the hands are hidden, reveal
        // if the hands are revealed, hide them
        if (dHand.style.display === "none")
            dHand.style.display = "block";
        else
            dHand.style.display = "none";

        if (pHand.style.display === "none")
            pHand.style.display = "block";
        else
            pHand.style.display = "none";
    }

    function shuffleDeck(){

        fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)
        .then(function (response){
            return response.json();
        })
        .then((data)=>{
            deck = data;

            // TODO: Once We start using real webpages, these will need to change
            document.getElementById("deckcount").textContent = deck.remaining;
            document.getElementById("status").textContent = deck.shuffled;
        })
    }

    function dealCards() {
        // For(i = 0, i -> 2, i++ )
        // For each player in players:
        // If deck is not empty
        // Deal one card
        // Give dealer cards


        // get the number of players in table
        var playersAtTable = players.length; 
        
        if (playersAtTable != 0){
            // inital, give each player two cards
            var drawCount = playersAtTable * 2;

            fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${drawCount}`)
            .then(function(response){
                return response.json();
            })
            .then((data)=>{
                players[currentPlayerIndex].setCurrentHand(data.cards);

                // TODO: Modify to fit new webpage structure

                document.getElementById("PlayerC1").src = data.cards[0].image;
                document.getElementById("PlayerC2").src = data.cards[1].image;

                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;                
            });
        }
        
    }

    function getPlayers() {
        // return players - used for socket.emit()
        // Only player data - sockets not included
    }

    // TODO: This should be modified later
    function compareScores(dealer, player){
        var isPlayerAceScoreOver21 = false;
        var isHouseAceScoreOver21 = false;

        if (player1.getCurrentAceScore() > 21){
            isPlayerAceScoreOver21 = true;
        }
        if (house.getCurrentAceScore() > 21){
            isHouseAceScoreOver21 = true;
        }

        if (player1.getblackjack() == true && house.getblackjack() == true){
            return "draw";
        }
        else if (player1.getblackjack() == true){
            declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
        }
        else if (house.getblackjack() == true){
            declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
        }
        else{

            if(house.getBust() == true) {
                return {winner: "player", loser: "dealer", bust: true, aceOver21: isHouseAceScoreOver21}
            }
            else if (player1.getBust() == true){
                house.revealCard();
                return {winner: "dealer", loser: "player", bust: true, aceOver21: isPlayerAceScoreOver21};

            }

            if (player1.getAceFound() == true || house.getAceFound() == true){
                if(isPlayerAceScoreOver21 == true){
                    if(isHouseAceScoreOver21 == true){
                        if(player1.getCurrentScore() > house.getCurrentScore()){
                            // player wins
                            return {winner: "player", loser: "dealer", bust: dealer.getBust(), aceOver21: isHouseAceScoreOver21};
                        }
                        else if (player1.getCurrentScore() < house.getCurrentScore()){
                            // house wins
                            return {winner: "dealer", loser: "player", bust: player.getBust() , aceOver21: isPlayerAceScoreOver21};
                        }
                        else{
                            return "draw";
                        }
                    }
                    else{
                        if(player1.getCurrentScore() > house.getCurrentAceScore()){
                            // player wins
                            return {winner: "player", loser: "dealer", bust: dealer.getBust(), aceOver21: isHouseAceScoreOver21};
                        }
                        else if (player1.getCurrentScore() < house.getCurrentAceScore()){
                            // house wins
                            return {winner: "dealer", loser: "player", bust: player.getBust() , aceOver21: isPlayerAceScoreOver21};
                        }
                        else{
                            return "draw";
                        }
                    }
                }
                else{
                    if(isHouseAceScoreOver21 == true){
                        if (player1.getCurrentAceScore() > house.getCurrentScore()){
                            // player wins
                            return {winner: "player", loser: "dealer", bust: dealer.getBust(), aceOver21: isHouseAceScoreOver21};
                        }
                        else if (player1.getCurrentAceScore() < house.getCurrentScore()){
                            // house wins
                            return {winner: "dealer", loser: "player", bust: player.getBust() , aceOver21: isPlayerAceScoreOver21};
                        }
                        else{
                            return "draw";
                        }
                    }
                    else{
                        if(player1.getCurrentAceScore() > house.getCurrentAceScore()){
                            // player wins
                            return {winner: "player", loser: "dealer", bust: dealer.getBust(), aceOver21: isHouseAceScoreOver21};
                        }
                        else if (player1.getCurrenAcetScore() < house.getCurrentAceScore()){
                            // house wins
                            return {winner: "dealer", loser: "player", bust: player.getBust() , aceOver21: isPlayerAceScoreOver21};
                        }
                        else{
                            return "draw";
                        }
                    }
                }
            }
            else{
                if(player1.getCurrentScore() > house.getCurrentScore()){
                    // player wins
                    return {winner: "player", loser: "dealer", bust: dealer.getBust(), aceOver21: isHouseAceScoreOver21};
                }
                else if (player1.getCurrentScore() < house.getCurrentScore()){
                    // house wins
                    return {winner: "dealer", loser: "player", bust: player.getBust() , aceOver21: isPlayerAceScoreOver21};
                }
                else{
                    return "draw";
                }
            }
        }
    }

    function declareOutcome(outcome){
        if (outcome == "draw"){
            // do the thing
        }
        else{
            // do opposite thing
        }

    }

    // Decides if player or dealer won
    function getWinner(dealer, player){
        var outcumte = compareScores(dealer, player);
        declareOutcome(dealer, player, outcome);
    }

    function createActionsListener(player) {
        player.socket.on('disconnect', function() {
            //Placeholder for branch merge
            this.moveOffline(player);
            // Player moved offline, then removed after hand is finished
        });
        // This will contain the functions and logic when a player hits
        player.socket.on('hit', function() {
            // Placeholder for branch merge
        });
        // This will contain the functions and logic when a player bets
        player.socket.on('bet', function() {
            //Placeholder for branch merge
        });
           // This will contain the functions and logic when a player stands
        player.socket.on('stand', function() {
            // TODO: Might want to send some flag or trigger player's turn variable here
            console.log("Player stands");
        });
    };

    // This will be called everytime an action above is finished to update the game on changes
	function emitGameState(gamePhase){
        _.each(players, function(player){
            player.socket.emit('gameState', {players: getPlayers(), dealer: getDealer(), gamePhase: gamePhase});
        })
    }
};