const gameBox = document.getElementById("game-area");
const matchNum = document.getElementById("match-num");
const turnNum = document.getElementById("turn-num");
const newGameButton = document.getElementById("new-game");

// A deck of eight pairs of unicode characters
const mainCards = [
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

/*
If there are nodes in the gameBox already, remove them.
Make a deck of cards by adding the unicode characters in a random order.
Add them all to the gameBox.
*/

function shuffle() {
  while (gameBox.hasChildNodes()) {
    gameBox.removeChild(gameBox.childNodes[0]);
  }
  const allCards = [...mainCards];
  const cardDeck = [];
  for (let i = 16; i > 0; i--) {
    const cardIdx = Math.floor(Math.random() * i);
    cardDeck.push(allCards.splice(cardIdx, 1));
  }
  cardDeck.forEach(each => {
    const div = document.createElement("DIV");
    div.setAttribute("data-symbol", each);
    div.addEventListener("click", clickHandler);
    gameBox.appendChild(div);
  });
}

shuffle();

/*
The openTurn flag prevents the player from clicking
more than two cards to display at a time.
*/

let openTurn = false;

let timer = false;

/*
The turnStatus object manages the state of the game.

*/

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
        matchNum.innerHTML = this.matches;
        this.matchesMade.push(cardA);
        openTurn = false;
        if (this.matches === 8) {
          alert("you win!");
          this.newGame();
          return;
        }
      } else {
        openTurn = true;
        timer = setTimeout(this.turnBack, 2350);
      }
      this.turnsTaken += 1;
      turnNum.innerHTML = this.turnsTaken;
      if (this.turnsTaken === 8) {
        alert("you lose!");
        this.newGame();
      }
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
  },
  newGame: function() {
    if (timer) clearTimeout(timer);
    this.matchesMade = [];
    this.turnBack();
    this.matches = 0;
    this.turnsTaken = 0;
    matchNum.innerHTML = this.matches;
    turnNum.innerHTML = this.turnsTaken;
    shuffle();
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

newGameButton.addEventListener("click", turnStatus.newGame.bind(turnStatus));

matchNum.innerHTML = turnStatus.matches;
turnNum.innerHTML = turnStatus.turnsTaken;
