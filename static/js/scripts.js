var Player = require('./player');

// Notes //
// Things to work on:
//  - Fine tuning House "AI".
//  - Make function to check if player has gone over 21
//      ran into issue where the compareScore function would call
//      the game before the house could do anything (like reveal second card).
//  - Refactor code: Some porttions could be moved to the table.js file
//      this point is up for disccusion.
//

// Global Variables //
var player1 = new Player();
var house = new Player(true);
var currentDeck;

// Set listeners on-load //
window.onload = function ()
{
    document.getElementById('start').addEventListener('click', start);
    document.getElementById('deal').addEventListener('click', deal);
    document.getElementById('hitMe').addEventListener('click', hitMe);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('log').addEventListener('click', logData);
}

// Functions tied to buttons //
function start()
{
    createDeck();
    changeHandVisibility();

    // disable start button so user won't constantly push it
    disableButton("start");
}

function deal()
{
    clearHands();

    // let players play again
    enableButton("hitMe");
    enableButton("stay");

    dealNewHands();
    changeHandVisibility();
}

function hitMe()
{
    hitPlayer();
}

function stay()
{
    houseDecision()

    // player no longer does anything
    disableButton("hitMe");
    disableButton("stay");
}

// This functionality will only exist for debugging purposes
function logData()
{
    console.log("*****************");
    console.log("createDeck() Data")
    console.log("currentDeck Info: ", currentDeck);
    console.log("ID: ", currentDeck);
    console.log("-----------------");
    console.log("dealPlayer() Data");
    console.log("Player Hand Info: ", player1);
    console.log("-----------------");
    console.log("dealHouse() Data");
    console.log("House Hand Info: ", house);
    console.log("*****************");
}

// Functions that support button functions //
function clearHands()
{
    // set CSS to hide the currently shown hands, assuming they are shown
    changeHandVisibility();

    // reset hands to an empty state
    // this is to ensure no data from previous rounds is used
    house.resetHand();
    player1.resetHand();

    // setting values to null or empty string 
    // so nothing will shown up when we reveal hands again
    document.getElementById("deckcount").textContent = "";
    document.getElementById("status").textContent = "";

    document.getElementById("houseScore").textContent = "Score goes here";
    document.getElementById("HouseC1").src = "";
    document.getElementById("HouseC2").src = "";
    document.getElementById("HouseC3").src = "";
    document.getElementById("HouseC4").src = "";

    document.getElementById("playerScore").textContent = "Score goes here";
    document.getElementById("PlayerC1").src = "";
    document.getElementById("PlayerC2").src = "";
    document.getElementById("PlayerC3").src = "";
    document.getElementById("PlayerC4").src = "";    
}

function createDeck()
{
    // Since this is in testing phase and I don't want to run into any API issues
    // I've retrived a deck_id from the API and hardcoded that id so I won't
    // be create hundreds of different decks while testing
    // "add three deck support"
    fetch(`https://deckofcardsapi.com/api/deck/8m9l3ke6yf8f/shuffle/?deck_count=3`)
        .then(function (response)
        {
            // we get the response from the API and return the JSON format of it
            // not sure if this step is needed, but can be tested later...
            return response.json();
        })
        .then((data) => 
            {
                // now we have data, so we store it for long term use
                currentDeck = data;

                // adjust some HTML elements to help with data consistency and debugging
                document.getElementById("deckcount").textContent = currentDeck.remaining;
                document.getElementById("status").textContent = currentDeck.shuffled;

                // gotta love debugging
                console.log('Initial Deck Creation');
                console.log(`Data: `, data);
                console.log(`currentDeck: `, currentDeck);
                console.log('-----------------');

                // Then we make our calls to deal the player's hand and then the house's hand
                // I don't know if it is correct to return to the playerhand/houseHand
                // but for the .then promise to work it needs to return to something
                // can test later...
            })
        .then(data2 => dealPlayer(currentDeck))
        .then(data3 => dealHouse(currentDeck))
}

function changeHandVisibility()
{
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

function dealPlayer(currentDeck)
{
    // API call to draw the two inital cards from our current deck
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                // store data for long term use
                player1.setCurrentHand(data.cards);

                // show the drawn cards in the HTML file
                document.getElementById("PlayerC1").src = data.cards[0].image;
                document.getElementById("PlayerC2").src = data.cards[1].image;

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to player');
                console.log(`Data: `, data);
                console.log(`playerHand: `, player1.getCurrentHand());
                console.log('-----------------');

                // Now we can call out function to calculate the score for the player
                // this score will be shown on screen for the user to easily now the value of their hand
            })
        .then ((data2) => player1.calculateScore()) 
}

function dealHouse(currentDeck)
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
        .then(function (response)
        {
            return response.json();
        })
        .then((data) => 
            {
                // store data for long term use
                house.setCurrentHand(data.cards);
                
                // show the drawn cards in the HTML file
                document.getElementById("HouseC1").src = data.cards[0].image;
                document.getElementById("HouseC2").src = "../iamges/temp_card-Back.png";

                // adjust the deck count and update value within our currentDeck variable
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Dealing to House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, house.getCurrentHand());
                console.log('-----------------');

                // Now we can call out function to calculate the score for the house
                // this score will be shown on screen for the user to easily now the value of the house's hand
            })
        .then ((data2) => house.calculateScore()) 
}

function dealNewHands()
{
     // API call to draw the two inital cards from our current deck
     fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
     .then(function (response)
     {
         return response.json();
     })
     .then((data) => 
         {
             // store data for long term use
             player1.setCurrentHand(data.cards);

             // show the drawn cards in the HTML file
             document.getElementById("PlayerC1").src = data.cards[0].image;
             document.getElementById("PlayerC2").src = data.cards[1].image;

             // adjust the deck count and update value within our currentDeck variable
             document.getElementById("deckcount").textContent = data.remaining;
             currentDeck.remaining = data.remaining;

             // gotta love debugging
             console.log('Dealing to player');
             console.log(`Data: `, data);
             console.log(`playerHand: `, player1.getCurrentHand());
             console.log('-----------------');

             // Now we can call out function to calculate the score for the player
             // this score will be shown on screen for the user to easily now the value of their hand
         })
     .then ((data2) => player1.calculateScore())
     .then ((data3) => dealNewHandsHelper());
}

function dealNewHandsHelper()
{
    fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=2')
    .then(function (response)
    {
        return response.json();
    })
    .then((data) => 
        {
            // store data for long term use
            house.setCurrentHand(data.cards);
            
            // show the drawn cards in the HTML file
            document.getElementById("HouseC1").src = data.cards[0].image;
            document.getElementById("HouseC2").src = "../iamges/temp_card-Back.png";

            // adjust the deck count and update value within our currentDeck variable
            document.getElementById("deckcount").textContent = data.remaining;
            currentDeck.remaining = data.remaining;

            // gotta love debugging
            console.log('Dealing to House');
            console.log(`Data: `, data);
            console.log(`houseHand: `, house.getCurrentHand());
            console.log('-----------------');

            // Now we can call out function to calculate the score for the house
            // this score will be shown on screen for the user to easily now the value of the house's hand
        })
        .then ((data2) => house.calculateScore())
}

// This function is currently under construction (:
function compareScores()
{

    // setting up for a one time check on aceScore
    var isPlayerAceScoreOver21 = false;
    var isHouseAceScoreOver21 = false;

    // Check's if either players' (house is  player) aceScore is over 21
    if (player1.getCurrentAceScore() > 21)
    {
        isPlayerAceScoreOver21 = true;
    }
    if (house.getCurrentAceScore() > 21)
    {
        isHouseAceScoreOver21 = true;
    }


    // check if either both players have blackjack, just the player, or just the house has blackjack
    if (player1.getblackjack() == true && house.getblackjack() == true)
    {
        declareDraw();
        console.log("what are the odds..."); // make a draw function
    }
    else if (player1.getblackjack() == true)
    {
        declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
    }
    else if (house.getblackjack() == true)
    {
        declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
    }
    else
    {
        // For this case, there is no blackjack, so we need to compare
        // the scores of the house and the player

        // can start by seeing if either player has gone over 21
        if(house.getBust() == true) 
        {
            declareWinnerLoser(player1, house, true, isHouseAceScoreOver21);
        }
        else if (player1.getBust() == true)
        {
            house.revealCard();
            declareWinnerLoser(house, player1, true, isPlayerAceScoreOver21);
        }

        // now we can check if any aces are in play
        if (player1.getAceFound() == true || house.getAceFound() == true)
        {
            // check if the player ace is over 21
            if(isPlayerAceScoreOver21 == true)
            {
                // check if the house ace is over 21
                if(isHouseAceScoreOver21 == true)
                {
                    // both are over, so compare the ace low scores
                    if(player1.getCurrentScore() > house.getCurrentScore())
                    {
                        // player wins
                        declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
                    }
                    else if (player1.getCurrentScore() < house.getCurrentScore())
                    {
                        // house wins
                        declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
                    }
                    else
                    {
                        declareDraw();
                    }
                }
                // House ace high doesn't go over 21, so use aceScore
                else
                {
                    if(player1.getCurrentScore() > house.getCurrentAceScore())
                    {
                        // player wins
                        declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
                    }
                    else if (player1.getCurrentScore() < house.getCurrentAceScore())
                    {
                        // house wins
                        declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
                    }
                    else
                    {
                        declareDraw();
                    }
                }
            }
            // Player ace high isn't over 21, so use aceScore
            else
            {
                // check if the house ace is over 21
                if(isHouseAceScoreOver21 == true)
                {
                    if (player1.getCurrentAceScore() > house.getCurrentScore())
                    {
                        // player wins
                        declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
                    }
                    else if (player1.getCurrentAceScore() < house.getCurrentScore())
                    {
                        // house wins
                        declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
                    }
                    else
                    {
                        declareDraw();
                    }
                }
                // House ace high doesn't go over 21, so use aceScore
                else
                {
                    if(player1.getCurrentAceScore() > house.getCurrentAceScore())
                    {
                        // player wins
                        declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
                    }
                    else if (player1.getCurrenAcetScore() < house.getCurrentAceScore())
                    {
                        // house wins
                        declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
                    }
                    else
                    {
                        declareDraw();
                    }
                }
            }
        }
        // neither player has an ace in their hand; just use score variable
        else
        {
            // both are over, so compare the ace low scores
            if(player1.getCurrentScore() > house.getCurrentScore())
            {
                // player wins
                declareWinnerLoser(player1, house, house.getBust(), isHouseAceScoreOver21);
            }
            else if (player1.getCurrentScore() < house.getCurrentScore())
            {
                // house wins
                declareWinnerLoser(house, player1, player1.getBust(), isPlayerAceScoreOver21);
            }
            else
            {
                declareDraw();
            }
        }
    }
}

function declareWinnerLoser(winner, loser, didLoserBust, AS_Over21)
{
    var winnerID, loserID;

    // check if house or player
    if(winner.getIsHouse() == true)
    {
        winnerID = "houseScore";
        loserID = "playerScore";
    }
    else
    {
        winnerID = "playerScore";
        loserID = "houseScore";
    }

    // check if we need to output aceScore or normal score
    // the change winner score HTML element
    if(winner.getAceFound == true)
        document.getElementById(winnerID).textContent = `You won with a score of ${winner.getCurrentAceScore()}`;
    else
        document.getElementById(winnerID).textContent = `You won with a score of ${winner.getCurrentScore()}`;

    // check if we need to output aceScore or normal score
    // the change loser score HTML element
    if(loser.getAceFound() == true)
    {
        if(AS_Over21 == true)
        {
            document.getElementById(loserID).textContent = `You lost with a score of ${loser.getCurrentScore()}`;
        }
        else
        {
            document.getElementById(loserID).textContent = `You lost with a score of ${loser.getCurrentAceScore()}`;
        }
    }
    else
    {
        if(didLoserBust == true)
            document.getElementById(loserID).textContent = `You Bust with a score of ${loser.getCurrentScore()}`;
        else
            document.getElementById(loserID).textContent = `You lost with a score of ${loser.getCurrentScore()}`;
    }
}

function declareDraw()
{
    if(house.getAceFound() == true)
    {
        document.getElementById("houseScore").textContent = `Draw! You ended with a score of ${hosue.getCurrentAceScore()}`;
        document.getElementById("playerScore").textContent = `Draw! You ended with a score of ${player1.getCurrentAceScore()}`;
    }
    else
    {
        document.getElementById("houseScore").textContent = `Draw! You ended with a score of ${hosue.getCurrentScore()}`;
        document.getElementById("playerScore").textContent = `Draw! You ended with a score of ${player1.getCurrentScore()}`;
    }
}

function hitPlayer()
{
    // set variables to some HTML elements
    var card3 = document.getElementById("PlayerC3");
    var card4 = document.getElementById("PlayerC4");

    // check if there isn't an image value
    if (card3.getAttribute('src') == "") 
    {
        // since there isn't we can do our API call to draw a card form the current deck
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                // Add the new card to the end of the cards array for playerHand
                player1.addCardtoHand(data.cards[0]);

                // set the 3rd card html element to the drawn cards' image
                // and update the number of remaining cards in HTML and currentDeck
                document.getElementById("PlayerC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, player1.getCurrentHand());
                console.log('-----------------');

                // Calling calulcate score to update player's score
            })
        .then ((data2) => player1.calculateScore())
    }
    else if (card4.getAttribute('src') == "")
    {
        // similar to the above code section, just for the fourth card drawn
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                player1.addCardtoHand(data.cards[0]);
                document.getElementById("PlayerC4").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the Player');
                console.log(`Data: `, data);
                console.log(`playerHnad: `, player1.getCurrentHand());
            })
        .then ((data2) => player1.calculateScore())
    }
    else
    {   
        // so this happens when the "Hit Me" button is press more than 4 times within a round
        // I wasn't sure what else to do for this, but before it would just replace the fourth card image
        // ...Which is something we don't want
        console.log("player say wut");
    }
}

function hitHouse()
{
    // This function is very similar to htiPlayer()
    // this could be merged later on...
    var card3 = document.getElementById("HouseC3");
    var card4 = document.getElementById("HouseC4");

    if (card3.getAttribute('src') == "") 
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                house.addCardtoHand(data.cards[0]);
                document.getElementById("HouseC3").src = data.cards[0].image;
                document.getElementById("deckcount").textContent = data.remaining;
                currentDeck.remaining = data.remaining;

                // gotta love debugging
                console.log('Hitting the House');
                console.log(`Data: `, data);
                console.log(`houseHand: `, house.getCurrentHand());
                console.log('-----------------');
            })
        .then ((data2) => house.calculateScore())
        .then ((data3) => compareScores());
    }
    else if (card4.getAttribute('src') == "")
    {
        fetch('https://deckofcardsapi.com/api/deck/' + currentDeck.deck_id + '/draw/?count=1')
        .then(function (response)
            {
            return response.json();
            })
        .then((data) =>
            {
                 house.addCardtoHand(data.cards[0]);
                 document.getElementById("HouseC4").src = data.cards[0].image;
                 document.getElementById("deckcount").textContent = data.remaining;
                 currentDeck.remaining = data.remaining;
 
                 // gotta love debugging
                 console.log('Hitting the House');
                 console.log(`Data: `, data);
                 console.log(`houseHand: `, house.getCurrentHand());
                 console.log('-----------------');
            })
        .then ((data2) => house.calculateScore())
        .then ((data3) => compareScores());
    }
    else
    {
        console.log("house say wut");
    }
}

function houseDecision()
{
    var houseHits = false;

    // show second card to players
    house.revealCard();
    // update the displayed score
    house.displayScore();

    // add AI for house here
    houseHits = house.checkHandValue();

    if (houseHits == true)
        hitHouse();
    else{console.log("--house stays--")};

    compareScores();
}

function disableButton(elementName)
{
    document.getElementById(elementName).disabled = true;
}
function enableButton(elementName)
{
    document.getElementById(elementName).disabled = false;
}