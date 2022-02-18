document.addEventListener('DOMContentLoaded', () => {

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

    let firstCard, secondCard;
    let hasFlippedCard = false;
    let blockFlip = false;

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

            card.addEventListener('click', (event) => flipCard(event.currentTarget));
        });

    }

    const flipCard = (elem) => {
        if (blockFlip || elem === firstCard) {
            return;
        }

        elem.classList.add('flip');

        if (!hasFlippedCard){
            hasFlippedCard = true;
            firstCard = elem;
        } else {
            secondCard = elem;
            checkCards();
        }
    }

    const checkCards = () => {
        if(firstCard.dataset.animal === secondCard.dataset.animal) {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);

            resetBoard();
        } else {
            unflipCards();
        }
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
        btnsLevel.querySelectorAll('.btn').forEach(btn => {
            if (btn.closest('.btn-active')) {
                btn.classList.remove('btn-active');
            }
        });
        elem.classList.add('btn-active');
    }

    btnsLevel.addEventListener('click', (event) => {
        if (event.target.closest('.btn')) {
            const activeBtn = event.target.dataset.btn;

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

            setActiveBtn(event.target);
        }
    });

    document.querySelector('.title').addEventListener('click', () => {
        renderField('320px', '320px', 'calc(50% - 10px)', 'calc(50% - 10px)', 'easy');
        setActiveBtn(btnsLevel.querySelector("[data-btn='easy']"));
    });

   

    

    

    
    




});