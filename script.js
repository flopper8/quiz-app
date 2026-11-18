// Обраний фреймворк: Vue 3.
// так як дл мене це все в новинку я звернувся до ШІ за порадою
// що саме мені обратиі в чому  перевага обраного варіанта, ось
// що він мені сказав
//Обґрунтування: Vue дозволяє працювати з існиючою HTML-розміткою
//через директиви без необхідності компіляції JSX через Babel у браузері.

console.log('script.js підключено');

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const QuizQuestion = {
    props: ['question', 'options', 'questionIndex'], 
    emits: ['answer'],
    template: `
        <div class="quiz-question-item">
            <p style="text-align: center; margin-bottom: 20px; font-weight: bold;">{{ question }}</p>
            
            <div class="options">
                <template v-for="(option, optIndex) in options" :key="optIndex">
                    <input 
                        type="radio" 
                        :id="'q-' + questionIndex + '-opt-' + optIndex" 
                        :name="'question-' + questionIndex" 
                        :value="option" 
                        @change="$emit('answer', option)"
                    >
                    <label :for="'q-' + questionIndex + '-opt-' + optIndex">
                        {{ option }}
                    </label>
                </template>
            </div>
        </div>
    `
};

const quizApp = Vue.createApp({
    
    components: {
        QuizQuestion
    },

    data() {
        return {
            score: 0,
            currentQuestionIndex: 0,
            isAnswering: false,
            quizQuestions: []
        };
    },

    computed: {
        progressPercentage() {
            if (this.quizQuestions.length === 0) return 0;
            return ((this.currentQuestionIndex + 1) / this.quizQuestions.length) * 100;
        }
    },

    methods: {
        handleAnswer(selectedOption, correctAnswer) {

            if (this.isAnswering) return; 
            this.isAnswering = true;
            
            let isCorrect = (selectedOption === correctAnswer);
            
            if (isCorrect) {
                this.score++; 
            }
            console.log(`Обрано: ${selectedOption}. Правильно? ${isCorrect}. Поточний бал: ${this.score}`);
            

            setTimeout(() => {
                if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
                    this.currentQuestionIndex++; 
                    this.isAnswering = false; 
                } else {
                    alert(`Вікторину завершено! Твій рахунок: ${this.score} з ${this.quizQuestions.length}`);
                }
            }, 500);
        },
        
        async loadQuizData() {
            try {
                const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple', { cache: 'no-store' });
                
                if (!response.ok) {
                    throw new Error(`Помилка сервера: код ${response.status}`);
                }
                
                const data = await response.json();
                

                this.quizQuestions = data.results.map(item => {
                    const qText = decodeHTML(item.question);
                    const correct = decodeHTML(item.correct_answer);
                    const incorrect = item.incorrect_answers.map(ans => decodeHTML(ans));
                    
                    const allOptions = [...incorrect, correct];
                    allOptions.sort(() => Math.random() - 0.5);
                    
                    return {
                        question: qText,
                        options: allOptions,
                        answer: correct
                    };
                });
            } catch (error) {
                console.error('Деталі помилки для розробника:', error);
                alert("Не вдалося завантажити питання вікторини. Будь ласка, перевірте інтернет-з'єднання.");
            }
        }
    },
    mounted() {
        this.loadQuizData();
    }
});
quizApp.mount('main');

/*функцію рендеру (renderQuestions), ручне отримання даних та 
   обробники подій (addEventListener) замінено реактивним компонентом Vue 
   та директивою v-for.

const staticExample = document.querySelector('#static-example');
if (staticExample) {
    staticExample.remove();
}

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';



// Отримую питання для вікторини з публічного API: Open Trivia Database
async function loadQuizData() {
    console.log('Починаємо завантаження даних...');
    
    const submitBtn = document.querySelector('#submit-btn');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Завантаження...';
    }


    try {
        const response = await fetch(API_URL, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Помилка сервера: код ${response.status}`);
        }

        console.log('Статус HTTP перевірено, все ОК!');

        const data = await response.json();
        console.log('Отримані дані з API:', data);

        quizQuestions.length = 0; 

        for (const item of data.results) {
            const qText = decodeHTML(item.question);
            const correct = decodeHTML(item.correct_answer);
            const incorrect = item.incorrect_answers.map(ans => decodeHTML(ans));

            const allOptions = [...incorrect, correct];
            
            allOptions.sort(() => Math.random() - 0.5);

            quizQuestions.push({
                question: qText,
                options: allOptions,
                answer: correct
            });
        }
        renderQuestions(quizQuestions);

        const firstQ = quizQuestions[0];
        const questionTitle = document.querySelector('#current-question p');
        if (questionTitle) questionTitle.textContent = firstQ.question;
        
        const radioInputs = document.querySelectorAll('#current-question input[type="radio"]');
        const radioLabels = document.querySelectorAll('#current-question label');
        
        for (let i = 0; i < radioInputs.length; i++) {
            radioInputs[i].value = firstQ.options[i];
            radioLabels[i].textContent = firstQ.options[i];
        }

    } catch (error) {
        console.error('Деталі помилки для розробника:', error);

        const questionsSection = document.querySelector('#all-questions-section');
        
        let errorMsg = document.querySelector('#error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.id = 'error-message';
            errorMsg.style.color = '#b12323';
            errorMsg.style.fontWeight = 'bold';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.fontSize = '1.2rem';
            
            questionsSection.prepend(errorMsg); 
        }
        errorMsg.textContent = 'Не вдалося завантажити питання вікторини. Будь ласка, перевірте інтернет-з\'єднання та спробуйте пізніше.';
        

        let retryBtn = document.querySelector('#retry-btn');
        if (!retryBtn) {
            retryBtn = document.createElement('button');
            retryBtn.id = 'retry-btn';
            retryBtn.textContent = 'Спробувати знову';
            retryBtn.style.display = 'block';
            retryBtn.style.margin = '10px auto';
            
            
            retryBtn.addEventListener('click', () => {
                errorMsg.remove();
                retryBtn.remove();
                loadQuizData();
            });
            errorMsg.after(retryBtn);
        }

        const currentQuestionSection = document.querySelector('#current-question');
        if (currentQuestionSection) {
            currentQuestionSection.style.display = 'none';
        }
    }finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Відповісти';
        }
    }
}
    loadQuizData();

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
    */
