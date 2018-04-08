function initializeMemoryGame() {
    flippedCards.length = 0;
    hideCongratulationsPopup();
    resetTimer();
    resetRating();
    createNewBoard();
    addEventListenersToCards();
    addEventListenersToReloadButtons();
    moves = 0;
    matchedCards = [];
    firstCardIsFlipped = false;
    updateMovesLabel();
    setupTimer();
}

const board = document.getElementById('board');
const cards = [
    {
        id: 'img-1-1',
        img: 'img/sock_1.png',
    },
    {
        id: 'img-2-1',
        img: 'img/sock_2.png',
    },
    {
        id: 'img-3-1',
        img: 'img/sock_3.png',
    },
    {
        id: 'img-4-1',
        img: 'img/sock_4.png',
    },
    {
        id: 'img-5-1',
        img: 'img/sock_5.png',
    },
    {
        id: 'img-6-1',
        img: 'img/sock_6.png',
    },
    {
        id: 'img-7-1',
        img: 'img/sock_7.png',
    },
    {
        id: 'img-8-1',
        img: 'img/sock_8.png',
    },
    {
        id: 'img-1-2',
        img: 'img/sock_1.png',
    },
    {
        id: 'img-2-2',
        img: 'img/sock_2.png',
    },
    {
        id: 'img-3-2',
        img: 'img/sock_3.png',
    },
    {
        id: 'img-4-2',
        img: 'img/sock_4.png',
    },
    {
        id: 'img-5-2',
        img: 'img/sock_5.png',
    },
    {
        id: 'img-6-2',
        img: 'img/sock_6.png',
    },
    {
        id: 'img-7-2',
        img: 'img/sock_7.png',
    },
    {
        id: 'img-8-2',
        img: 'img/sock_8.png',
    },
];

const cardsLabels = {
    'img-1-1': 'sock_1',
    'img-1-2': 'sock_1',
    'img-2-1': 'sock_2',
    'img-2-2': 'sock_2',
    'img-3-1': 'sock_3',
    'img-3-2': 'sock_3',
    'img-4-1': 'sock_4',
    'img-4-2': 'sock_4',
    'img-5-1': 'sock_5',
    'img-5-2': 'sock_5',
    'img-6-1': 'sock_6',
    'img-6-2': 'sock_6',
    'img-7-1': 'sock_7',
    'img-7-2': 'sock_7',
    'img-8-1': 'sock_8',
    'img-8-2': 'sock_8',
};

// stores cards flipped in 1 move
const flippedCards = [];
// condition to start counting time
let firstCardIsFlipped = false;
// stores all matched cards
let matchedCards = [];

const starOne = document.getElementById('star-one');
const starTwo = document.getElementById('star-two');
const starThree = document.getElementById('star-three');


let moves = 0;

let countTime;
let seconds = 0;


// CLEARING AND CREATING BOARD
function createNewBoard() {
    // clears the board if there is any
    board.innerHTML = '';

    const shuffledBoard = shuffle(cards);

    // creates HTML structure to display the board
    for (let i = 0; i < shuffledBoard.length; i++) {
        const cardContainer = document.createElement('li');
        const singleCard = document.createElement('div');
        const figure = document.createElement('figure');
        const secondFigure = document.createElement('figure');
        const imgNode = document.createElement('img');

        board.appendChild(cardContainer);
        cardContainer.appendChild(singleCard);
        singleCard.appendChild(figure);
        singleCard.setAttribute('id', shuffledBoard[i].id);
        const figureFront = singleCard.insertBefore(secondFigure, figure);

        imgNode.classList.add('sock');
        imgNode.setAttribute('src', shuffledBoard[i].img);
        figure.appendChild(imgNode);

        cardContainer.classList.add('card-container');
        singleCard.classList.add('card');
        figure.classList.add('back');
        figureFront.classList.add('front');
    }
}

// SHUFFLING CARDS
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = cards.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
}

// block: ADDING EVENT LISTENERS

function addEventListenersToCards() {
    const clickedFigures = document.querySelectorAll('.front');
    for (let i = 0; i < clickedFigures.length; i++) {
        clickedFigures[i].addEventListener('click', handleCardClick);
    }
}

function addEventListenersToReloadButtons() {
    const shuffleButton = document.getElementById('reload-btn');
    shuffleButton.addEventListener('click', initializeMemoryGame);

    const modalButton = document.getElementById('modal-btn');
    modalButton.addEventListener('click', initializeMemoryGame);
}

// block: FLIPPING AND MATCHING CARDS

function handleCardClick(event) {
    const clickedFigure = event.target;
    const parentCard = clickedFigure.parentElement;
    parentCard.classList.add('flipped');
    const figureId = parentCard.getAttribute('id');

    // stores flipped cards id's, max. 2
    flippedCards.push(figureId);
    firstCardIsFlipped = true;

    // temporarily removes event listener from the first clicked card to prevent doubleclick and incorrect match
    clickedFigure.removeEventListener('click', handleCardClick);
    setTimeout(function () {
        clickedFigure.addEventListener('click', handleCardClick);
    }, 600);

    if (flippedCards.length === 2) {
        moves = moves + 1;
        updateMovesLabel();
        rateWithStars();

        const figureTwo = flippedCards.pop();
        const figureOne = flippedCards.pop();
        const previousCard = document.querySelector('#' + figureOne);

        if (pairIsMatched(figureOne, figureTwo)) {
            setTimeout(function () {
                // adds style for matched cards
                previousCard.lastChild.classList.add('matched');
                parentCard.lastChild.classList.add('matched');
            }, 1000);
            // stores id's of matched cards
            matchedCards.push(figureTwo);
            // passes matching id to function displaying info about flag's owner
            checkWinningCondition();
        } else {
            setTimeout(function () {
                // flips not matched cards face down
                previousCard.classList.remove('flipped');
                parentCard.classList.remove('flipped');
            }, 600);
        }
    }
}

// checks if socks' id's are equal and not the same
function pairIsMatched(figureOne, figureTwo) {
    const figureOneId = figureOne.substr(0, 5);
    const figureTwoId = figureTwo.substr(0, 5);

    if (figureOne === figureTwo) {
        return false;
    }
    if (figureOneId === figureTwoId) {
        return true;
    } else {
        return false;
    }
}

function updateMovesLabel() {
    const displayedMovesNumber = document.getElementById('moves-counter');
    if (moves === 1) {
        displayedMovesNumber.innerHTML = moves + ' move';
    } else {
        displayedMovesNumber.innerHTML = moves + ' moves';
    }
}

// block: STAR RATING

function rateWithStars() {
    const starOne = document.getElementById('star-one');
    const starTwo = document.getElementById('star-two');
    const starThree = document.getElementById('star-three');

    // changes full star for empty one
    if (moves >= 30) {
        starTwo.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i>';
    } else if (moves >= 20) {
        starThree.innerHTML = '<i class="fa fa-star-o" aria-hidden="true"></i>';
    }
}

function displayRating() {
    // shows full stars
    const ratingInfo = document.getElementById('rating-info');
    if (moves >= 30) {
        ratingInfo.innerHTML = '<i class="fa fa-star" aria-hidden="true">';
    } else if (moves >= 20) {
        ratingInfo.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i></i><i class="fa fa-star" aria-hidden="true"></i>';
    } else {
        ratingInfo.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
    }
}

function checkWinningCondition() {
    if (matchedCards.length === 8) {
        resetTimer();
        displayRating();
        displayTime();
        showCongratulationsPopup();
    }
}

// adds to the score panel only full stars
function resetRating() {
    starOne.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
    starTwo.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
    starThree.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
}

// block: TIMER

// sets proper display of seconds
function timer(time) {
    return time > 9 ? time : '0' + time;
}

function getTime() {
    let totalSeconds = timer(seconds % 60);
    let totalMinutes = timer(parseInt(seconds / 60));
    return `${totalMinutes}:${totalSeconds}`;
}

function startCountingTime() {
    if (firstCardIsFlipped) {
        ++seconds;
        displayTime();
    }
}

// adds time to timer elements in the score panel and modal
function displayTime() {
    document.getElementsByClassName('time')[0].innerHTML = getTime();
    document.getElementsByClassName('time')[1].innerHTML = getTime();
}

// counts time every second
function setupTimer() {
    countTime = setInterval(startCountingTime, 1000);
    document.getElementById('timer').innerHTML = '00:00';
    seconds = 0;
}

function resetTimer() {
    clearInterval(countTime);
}

// block: SHOWING AND HIDING CONGRATULATIONS POPUP

function showCongratulationsPopup() {
    setTimeout(function () {
        const modal = document.getElementById('popup-window');
        modal.style.display = 'block';
    }, 900);
}

function hideCongratulationsPopup() {
    const modal = document.getElementById('popup-window');
    modal.style.display = 'none';
}


initializeMemoryGame();
