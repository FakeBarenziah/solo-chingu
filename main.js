const gameBox = document.getElementById("game-area");

// A deck of eight pairs of unicode characters
const allCards = [
  "\u2620",
  "\u2620",
  "\u2744",
  "\u2744",
  "\u25cf",
  "\u25cf",
  "\u2318",
  "\u2318",
  "\u2465",
  "\u2465",
  "\u272a",
  "\u272a",
  "\u2b04",
  "\u2b04",
  "\u2714",
  "\u2714"
];

let cardDeck;

function shuffle() {
  cardDeck = [];
  for (let i = 16; i; i--) {
    const cardIdx = Math.floor(Math.random() * i);
    cardDeck.push(allCards.splice(cardIdx, 1));
  }
}

shuffle();

let openTurn = false;

const turnStatus = {
  shownCards: [],
  matchesMade: [],
  turnsTaken: 0,
  matches: 0,
  checkMatch: function() {
    if (this.shownCards.length === 2) {
      const cardA = this.shownCards.pop();
      const cardB = this.shownCards.pop();
      if (cardA === cardB && !this.matchesMade.includes(cardA)) {
        this.matches += 1;
        document.getElementById("match-num").innerHTML = this.matches;
        openTurn = false;
        this.matchesMade.push(cardA);
        if (this.matches === 8) {
          alert("you win!");
          this.matchesMade = [];
          this.turnBack();
          this.matches = 0;
          this.turnsTaken = 0;
          shuffle();
        }
      } else {
        openTurn = true;
      }
      this.turnsTaken += 1;
      setTimeout(this.turnBack, 2200);
    }
  },
  turnBack: function() {
    const unmatched = gameBox.querySelectorAll("div");
    unmatched.forEach(each => {
      if (!turnStatus.matchesMade.includes(each.dataset.symbol)) {
        each.innerHTML = "";
      }
    });
    openTurn = false;
  }
};

function clickHandler(event) {
  const symbol = event.target.dataset.symbol;
  if (!event.target.innerHTML && !openTurn) {
    event.target.innerHTML = symbol;
    turnStatus.shownCards.push(symbol);
    turnStatus.checkMatch();
  }
}

cardDeck.forEach(each => {
  const div = document.createElement("DIV");
  div.setAttribute("data-symbol", each);
  div.addEventListener("click", clickHandler);
  gameBox.appendChild(div);
});

document.getElementById("match-num").innerHTML = turnStatus.matches;
