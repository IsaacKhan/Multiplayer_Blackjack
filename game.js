var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

socket.on('start', function() {
  console.log("starting game");
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
});