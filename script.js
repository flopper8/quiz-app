console.log('script.js підключено');

const quizQuestions = [
    { 
        question: "Якою мовою написане питання?", 
        answer: ["українською","ukrainian","ukrainisch","ucraino"] 
    },
    { 
        question: "Яка столиця України?", 
        answer: "Київ" 
    },
    { 
        question: "Скільки кольорів на прапорі України?", 
        answer: "два" 
    },
    { 
        question: "Яка найбільша планета Сонячної системи?", 
        answer: "Юпітер" 
    }
];


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


