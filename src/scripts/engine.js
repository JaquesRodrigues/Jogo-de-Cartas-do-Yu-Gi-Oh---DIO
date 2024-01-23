const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprite: {
    avatar: document.getElementById("card-img"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  button: document.getElementById("next-duel"),
};

const playersSide = {
  player1: "player-cards",
  computer: "computer-cards",
};

// const players = {
//   player1: "player-cards",
// };

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: "./src/assets/icons/dragon.png",
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: "./src/assets/icons/magician.png",
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: "./src/assets/icons/exodia.png",
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randIndex].id;
}

async function createCardImage(randId, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", randId);

  cardImage.classList.add("card");

  if (fieldSide === playersSide.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(randId);
    });
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(id) {
  await removerAllCards();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[id].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelRes = await checkResult(id, computerCardId);

  await updateScores();
  await drawButton(duelRes);
}

async function drawButton(text) {
  state.button.innerText = text;
  state.button.style.display = "block";
}

async function updateScores() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose ${state.score.computerScore}`;
}

async function resetDuel() {
  state.cardSprite.avatar.src = "";
  state.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

async function removerAllCards() {
  let cards = document.querySelector("#computer-cards");
  let imageElements = document.querySelectorAll("img");
  imageElements.forEach((img) => img.remove());

  cards = document.querySelector("#player-cards");
  imageElements = document.querySelectorAll("img");
  imageElements.forEach((img) => img.remove());
}

async function checkResult(playerId, computerId) {
  let duelResusts = "Empate";
  let playerCard = cardData[playerId];

  if (playerCard.WinOf.includes(computerId)) {
    duelResusts = "Ganhou";
    await playAudio("Win");
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(computerId)) {
    duelResusts = "Perdeu";
    await playAudio("Lose");
    state.score.computerScore++;
  }

  return duelResusts;
}

async function drawSelectedCard(index) {
  state.cardSprite.name.innerText = cardData[index].name;
  state.cardSprite.avatar.src = cardData[index].img;
  state.cardSprite.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

function init() {
  drawCards(5, playersSide.player1);
  drawCards(5, playersSide.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
