console.log('script.js підключено');


const quizQuestions = [
    { 
        question: "Якою мовою написане питання?", 
        options: ["українською", "ukrainian", "ukrainisch", "ucraino"],
        answer: ["українською","ukrainian","ukrainisch","ucraino"] 
    },
    { 
        question: "Яка столиця України?", 
        options: ["Львів", "Київ", "Одеса", "Харків"],
        answer: "Київ" 
    },
    { 
        question: "Скільки кольорів на прапорі України?", 
        options: ["один", "два", "три", "чотири"],
        answer: "два" 
    },
    { 
        question: "Яка найбільша планета Сонячної системи?", 
        options: ["Марс", "Венера", "Юпітер", "Сатурн"],
        answer: "Юпітер" 
    }
];


const staticExample = document.querySelector('#static-example');
if (staticExample) {
    staticExample.remove();
}

const listContainer = document.querySelector('#questions-list');


//Функція рендеру: очищає контейнер і динамічно
// виводить список питань вікторини на сторінку.
function renderQuestions(questions) {
    listContainer.innerHTML = '';

    for (const item of questions) {
    const listItem = document.createElement('li');
        listItem.textContent = item.question;

        listItem.dataset.answer = item.answer;

        if (Array.isArray(item.answer)) {
            listItem.classList.add('multiple-choice'); 
        } else {
            listItem.classList.add('answered');  
        }

        listContainer.append(listItem);
    }

const countElement = document.querySelector('#questions-count');
    if (countElement) {
        countElement.textContent = `Кількість питань: ${questions.length}`;
    }

}
renderQuestions(quizQuestions);


// Функція перебирає масив питань вікторини, порівнює жорстко задану 
// відповідь користувача з правильними варіантами та виводить результат у консоль.
function checkAnswers() {
    console.log("=== Запуск вікторини ===");
    
    const userAnswer = "українською"; 
    
    for (const item of quizQuestions) {
        console.log(`Питання: ${item.question}`);
        console.log(`Відповідь гравця: ${userAnswer}`);
        
        let isCorrect = false;

        if (Array.isArray(item.answer)) {
    
            if (item.answer.includes(userAnswer)) {
                isCorrect = true;
            }
        } else {
            if (userAnswer === item.answer) {
                isCorrect = true;
            }
        }
        
        if (isCorrect) {
            console.log("Результат: правильно");
        } else {
            console.log("Результат: неправильно");
        }
        
        console.log("---------------------------");
    }
}
checkAnswers();

// Стрілкова функція для обчислення відсотка правильних відповідей.
// Приймає кількість правильних відповідей та загальну кількість питань, повертаючи округлений відсоток.
const calcScorePercent = (correctCount, total) => Math.round(correctCount / total * 100);

//До прикладу 8 з 10 правильні
const finalScore = calcScorePercent(8, 10);
console.log(`Відсоток правильних відповідей: ${finalScore}%`);


let currentQuestionIndex = 0; 


const historyAttempts = [];

const form = document.querySelector('#quiz-form');

const submitBtn = document.querySelector('#submit-btn');
const nextBtn = document.querySelector('#next-btn');

const historyContainer = document.querySelector('.history-grid');


// Обробник надсилання форми: зупиняє перезавантаження, перевіряє відповідь, 
// зберігає результат в історію та перемикає кнопки вікторини
form.addEventListener('submit', (event) => {
    event.preventDefault();


    const selectedRadio = document.querySelector('input[name="question1"]:checked');

    const userAnswer = selectedRadio.value;

    
    const currentQuestionObj = quizQuestions[currentQuestionIndex];
    let isCorrect = false;
    

    if (Array.isArray(currentQuestionObj.answer)) {
        isCorrect = currentQuestionObj.answer.includes(userAnswer);
    } else {
        isCorrect = (userAnswer === currentQuestionObj.answer);
    }

    const newAttempt = {
        date: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }), 
        result: isCorrect ? "1/1 балів" : "0/1 балів"
    };

    historyAttempts.push(newAttempt);

    renderHistory(historyAttempts);
    
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';

    console.log(`Користувач обрав ${userAnswer}`); 
});

// Обробник другої події, очищає форму та повертає інтерфейс 
// до початкового стану для наступного питання
nextBtn.addEventListener('click', () => {

    currentQuestionIndex++; 

    if (currentQuestionIndex < quizQuestions.length) {
        
        const currentObj = quizQuestions[currentQuestionIndex];

        const questionTitle = document.querySelector('#current-question p');
        if (questionTitle) {
            questionTitle.textContent = currentObj.question;
        }

        const radioInputs = document.querySelectorAll('#current-question input[type="radio"]');
        const radioLabels = document.querySelectorAll('#current-question label');

        for (let i = 0; i < radioInputs.length; i++) {
            if (currentObj.options[i]) {
                radioInputs[i].value = currentObj.options[i];
                radioLabels[i].textContent = currentObj.options[i];
            }
        }

        form.reset();
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';

        console.log('Інтерфейс скинуто, готові до наступного питання!');
    } else {
        console.log('Вікторину завершено!');
        const questionTitle = document.querySelector('#current-question p');
        if (questionTitle) {
            questionTitle.textContent = "Вікторину завершено! Дякуємо за участь.";
        }
        
        const optionsContainer = document.querySelector('.options');
        if (optionsContainer) {
            optionsContainer.style.display = 'none';
        }

        form.reset();
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'none';
    }
});


function renderHistory(attempts) {
    historyContainer.innerHTML = '';

    for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];
        
        const article = document.createElement('article');
        
        const h3 = document.createElement('h3');
        h3.textContent = `Спроба ${i + 1}: ${attempt.date}`;
        
        const p = document.createElement('p');
        p.textContent = `Результат: ${attempt.result}`;
        
        article.append(h3);
        article.append(p);
        
        historyContainer.append(article);
    }
}