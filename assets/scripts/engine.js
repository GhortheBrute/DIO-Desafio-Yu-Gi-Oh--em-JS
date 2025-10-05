const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBOX: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    }
};

const pathImages = '/assets/medias/icons/';
const downCard = '/assets/medias/icons/card-back.png';
let playCount = 0;

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll('img');
    imgElements.forEach(img => img.remove());
    
    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach(img => img.remove());
}

async function checkDuelResults(cardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[cardId];
    
    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);
    return duelResults;
}

async function drawButton(duelResults) {
    state.actions.button.innerHTML = duelResults.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function updateScore() {
    state.score.scoreBox.innerHTML = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId();
    
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
    
    let duelResults = await checkDuelResults(cardId, computerCardId);
    
    await updateScore();
    await drawButton(duelResults);
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", downCard);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");
    
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", async () => {
            await setCardsField(cardImage.getAttribute("data-id"));
        })

        cardImage.addEventListener("mouseover", async () => {
            await drawSelectedCard(IdCard);
        })
    }
    
    
    
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage);
    }
    
}

async function resetDuel(){
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';
    
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';
    
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';
    
    init();
}

async function playAudio(status) {
    const audio = new Audio(`/assets/medias/audios/${status}.wav`);
    audio.volume = 0.2;
    await audio.play();
}

function init(){
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.volume = 0.1;
    bgm.play();
}

init();