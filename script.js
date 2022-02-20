document.addEventListener('DOMContentLoaded', () => {

    let namePlayer = 'Unknown';

    const arrCards = {
        'easy': [
            'fox', 'fox', 
            'panda', 'panda'
        ],
        'middle': [
            'fox', 'bear', 'fox', 'panda', 
            'panda', 'bear', 'hare', 'hare'
        ],
        'difficult': [
            'fox', 'bear', 'fox', 'panda',
            'mouse', 'elk', 'tiger', 'tiger', 
            'panda', 'bear', 'hare', 'hare',
            'elk', 'raccoon', 'mouse', 'raccoon', 
        ],
    };
    
    let cards = document.querySelectorAll('.memory-card');
    const fieldCards = document.querySelector('.field-cards');
    const btnsLevel = document.querySelector('.btns-levels');
    const btnsLevelNav = document.querySelector('.nav-item-levels');

    let firstCard, secondCard;
    let hasFlippedCard = false;
    let blockFlip = false;
    let countOfMoves = 0;

    let currentGame = '';
    let countOpenCards = 0;

    let timer;

    const hamburger = document.querySelector('.hamburger-nav');
    const nav = document.querySelector('.nav');
    const blackout = document.querySelector('.blackout-box');

    function toggleMenu() {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open-nav');
        blackout.classList.toggle('blackout');

        document.querySelector('.nav-item-input-player').style.display = 'none';
        document.querySelector('.nav-item-levels').style.display = 'none';
        document.querySelector('.results').innerHTML = '';
    }
    hamburger.addEventListener('click', toggleMenu);

    const createElement = (html, className, dataAttr) => {
        const el = document.createElement('div');
        el.innerHTML = html;
        el.className = className; 
        el.dataset.animal = dataAttr;
        return el;
    } 

    const shuffleArray = (arrayCards) => {
        return arrayCards.sort(() => Math.random() - 0.5);     
    }

    const renderCard = (nameCard) => {
        const card = createElement(
            `
            <img class="front-side" src="./assets/img/back/${nameCard}.jpg" alt="${nameCard}">
            <img class="back-side" src="./assets/img/cover.jpg" alt="Memory card">
            `,
            'memory-card',
            nameCard
        );
        fieldCards.append(card);
    }

    const renderField = (widthField, heightField, widthCard, heightCard, level) => {
        fieldCards.style.width = widthField;  
        fieldCards.style.height = heightField;
        
        const nameAnimals = shuffleArray(arrCards[level]);
        
        fieldCards.innerHTML = '';
        nameAnimals.forEach(card => renderCard(card));

        cards = document.querySelectorAll('.memory-card');

        cards.forEach(card => {
            card.style.setProperty('width', widthCard);
            card.style.setProperty('height', heightCard);

            //card.addEventListener('click', (event) => flipCard(event.currentTarget));
            card.addEventListener('click', flipCard);
        });

    }


    const renderWinners = () => {
        const winnerLS = JSON.parse(localStorage.getItem('winners'));
        const blockResults = document.querySelector('.results');

        if (winnerLS.length !== 0) {
            blockResults.innerHTML = '';
            winnerLS.reverse().length = 10;
            winnerLS.forEach(elem => {
                const winner = createElement(
                    `<div class="item-result">${elem.name}</div>
                    <div class="item-result">${elem.level}</div>
                    <div class="item-result">${elem.countOfMoves}</div>
                    <div class="item-result">${elem.time}</div>`,
                    'item-winner',
                    null
                );
                blockResults.append(winner);
            });

            const titleResult = createElement(
                `<div class="item-result">Name</div>
                <div class="item-result">Level</div>
                <div class="item-result">Moves</div>
                <div class="item-result">Time</div>`,
                'title-results',
                null
            );
            blockResults.prepend(titleResult);

        } else {
            blockResults.innerHTML = 'No results!';
        }   
    }

    function flipCard() {
        if (blockFlip || this === firstCard) {
            return;
        }

        this.classList.add('flip');

        if (!hasFlippedCard){
            hasFlippedCard = true;
            firstCard = this;
        } else {
            secondCard = this;
            checkCards();
        }
    }

    const setCountOfMoves = () => {
        const dMovies = document.querySelector('.moves');
        dMovies.innerHTML = countOfMoves;
    }

    const checkEndGame = () => {
        return (currentGame === 'easy' && countOpenCards === 4) 
                || (currentGame === 'middle' && countOpenCards === 8)
                || (currentGame === 'difficult' && countOpenCards === 16) 
                ? true : false;
    }

    const checkCards = () => {
        if(firstCard.dataset.animal === secondCard.dataset.animal) {
            countOpenCards += 2;
            countOfMoves++;
            disabledCards();
            resetBoard();

            if(checkEndGame()) {
                const modalContent = document.querySelector('.modal-body');
                modalContent.innerHTML = `
                    <div><b>Level:</b> ${currentGame}</div> 
                    <div><b>Count of moves:</b> ${countOfMoves}</div>
                    <div><b>Time:</b> ${document.querySelector('.time').textContent}</div>
                `;
                setTimeout(() => {document.querySelector('.modal-container').style.display = 'flex';}, 1000);
                clearTimeout(timer);
                setValuesLocalStorage();
            }

        } else {
            unflipCards();
            countOfMoves++;
        }

        setTimeout(() => {setCountOfMoves()}, 1400);
    }

    const setValuesLocalStorage = () => {
        const endTime = document.querySelector('.time').textContent;
        winners = JSON.parse(localStorage.getItem('winners'));
        winners.push({name: namePlayer, level: currentGame, countOfMoves: countOfMoves, time: endTime});
        localStorage.setItem('winners', JSON.stringify(winners));
    }

    function disabledCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
    }

    const unflipCards = () => {
        blockFlip = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    const resetBoard = () => {
        [hasFlippedCard, blockFlip] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
 
    const setActiveBtn = (elem) => {
        const deleteLastActiveBtn = (listBtn) => {
            listBtn.forEach(btn => {
                if (btn.closest('.btn-active')) {
                    btn.classList.remove('btn-active');
                }
            });
        }

        deleteLastActiveBtn(btnsLevel.querySelectorAll('.btn'));
        deleteLastActiveBtn(btnsLevelNav.querySelectorAll('.btn'));
        
        const level = elem.dataset.btn;
        btnsLevel.querySelector(`[data-btn="${level}"]`).classList.add('btn-active');
        btnsLevelNav.querySelector(`[data-btn='${level}']`).classList.add('btn-active');  

    }

    const setTimer = () => {
        let time = 0;
        timer = setInterval(function () {
            time++;
            const seconds = time % 60;
            const minutes = Math.floor(time / 60);
            const hours = Math.floor(time / 60 / 60);

            const formattedTime = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');

            document.querySelector('.time').innerHTML = formattedTime;
        }, 1000);
    }

    const startGame = (elem) => {
        if (elem.closest('.btn')) {
            countOfMoves = 0;
            clearInterval(timer);
            setCountOfMoves();

            const activeBtn = elem.dataset.btn;

            switch (activeBtn) {
                case 'easy': 
                    renderField('320px', '320px', 'calc(50% - 10px)', 'calc(50% - 10px)', activeBtn);
                    break;
                case 'middle':
                    renderField('640px', '320px', 'calc(25% - 10px)', 'calc(50% - 10px)', activeBtn); 
                    break;
                case 'difficult':
                    renderField('640px', '640px', 'calc(25% - 10px)', 'calc(25% - 10px)', activeBtn);
                    break;
                default:
                    renderField('320px', '320px', 'calc(50% - 10px)', 'calc(50% - 10px)', 'easy');
                    break;
            }
            currentGame = activeBtn;
            countOpenCards = 0;
            setActiveBtn(elem);
            setTimer();
        }
    }

    btnsLevel.addEventListener('click', (event) => {
        startGame(event.target);
    });

    btnsLevelNav.addEventListener('click', (event) => {
        startGame(event.target);
        toggleMenu();
    });

    document.querySelector('.title').addEventListener('click', () => {
        renderField('320px', '320px', 'calc(50% - 10px)', 'calc(50% - 10px)', 'easy');
        setActiveBtn(btnsLevel.querySelector("[data-btn='easy']"));
        currentGame = 'easy';
        setTimer();
    });

    document.querySelector('.btn-modal-ok').addEventListener('click', () => {
        document.querySelector('.modal-container').style.display = 'none';
    });

    document.querySelector('.btn-modal-new-game').addEventListener('click', () => {
        document.querySelector('.modal-container').style.display = 'none';
        startGame(btnsLevel.querySelector(`[data-btn="${currentGame}"]`));
    });

    document.querySelector('.nav').addEventListener('click', (event) => {
        if (event.target.closest('.nav-item-player')) {
            document.querySelector('.nav-item-input-player').style.display = 'block';
            document.querySelector('.nav-item-levels').style.display = 'none';
            document.querySelector('.results').innerHTML = '';
        }
        if (event.target.closest('.nav-items-levels')) {
            document.querySelector('.nav-item-levels').style.display = 'block';
            document.querySelector('.nav-item-input-player').style.display = 'none';
            document.querySelector('.results').innerHTML = '';
        }
        if (event.target.closest('.nav-item-last-results')) {
            renderWinners();
            document.querySelector('.nav-item-input-player').style.display = 'none';
            document.querySelector('.nav-item-levels').style.display = 'none';
        }
 
    });

    document.querySelector('.repeat-game').addEventListener('click', () => {
        if(currentGame) {
           startGame(btnsLevel.querySelector(`[data-btn="${currentGame}"]`)); 
        } 
    });

    document.querySelector('.input-name').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            enterNamePlayer = document.querySelector('.input-name').value;
            
            if (enterNamePlayer.length !== 0) {
               namePlayer = enterNamePlayer;
               document.querySelector('.block-name').innerHTML = `Hello, ${namePlayer}. Enter button "Start game" or choose level.`; 
               document.querySelector('.nav-item-input-player').placeholder = `Current player: ${namePlayer}`;
            }
        }
    }); 

    document.querySelector('.nav-item-input-player').addEventListener('keypress', (event) => {
        if (event.keyCode === 13) {
            enterNamePlayer = document.querySelector('.nav-item-input-player').value;

            if (enterNamePlayer.length !== 0) {
                namePlayer = enterNamePlayer;
                document.querySelector('.nav-item-input-player').placeholder = `Current player: ${namePlayer}`;
                document.querySelector('.nav-item-input-player').value = '';
                document.querySelector('.field-cards').innerHTML = `Hello, ${namePlayer}!`; 
                toggleMenu();
            }
        }
    }); 

});