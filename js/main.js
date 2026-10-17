// --- 1. ПРОВЕРКА НАДЕЖНОСТИ ПАРОЛЯ ---
function checkPasswordStrength() {
    const passwordInput = document.getElementById('password-input');
    const resultDiv = document.getElementById('password-result');
    if (!passwordInput || !resultDiv) return;

    const password = passwordInput.value;
    if (!password) {
        resultDiv.textContent = '';
        return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length < 6) {
        resultDiv.textContent = "🔴 Очень слабый (взламывается мгновенно)";
        resultDiv.style.color = "#ef4444";
    } else if (score <= 2) {
        resultDiv.textContent = "🟠 Слабый (взлом за несколько секунд/минут)";
        resultDiv.style.color = "#f97316";
    } else if (score <= 4) {
        resultDiv.textContent = "🟡 Средний (хотелось бы длиннее и сложнее)";
        resultDiv.style.color = "#eab308";
    } else {
        resultDiv.textContent = "🟢 Отличный и надежный пароль!";
        resultDiv.style.color = "#22c55e";
    }
}

// --- 2. ЧЕК-ЛИСТ С СОХРАНЕНИЕМ (localStorage) ---
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach((cb, index) => {
        // Восстанавливаем состояние из памяти браузера
        const savedState = localStorage.getItem(`checklist_${index}`);
        if (savedState === 'true') {
            cb.checked = true;
        }

        // Сохраняем при клике
        cb.addEventListener('change', () => {
            localStorage.setItem(`checklist_${index}`, cb.checked);
            updateProgress();
        });
    });

    updateProgress();
});

function updateProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    if (!checkboxes.length || !progressBar) return;

    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = Math.round((checked / checkboxes.length) * 100);
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
}

// --- 3. КВИЗ ---
const quizData = [
    {
        question: "Что делать, если вам позвонили из 'службы безопасности банка' и требуют назвать код из СМС?",
        options: [
            "Назвать код, чтобы спасти деньги",
            "Сбросить трубку и перезвонить по официальному номеру банка",
            "Назвать только половину цифр"
        ],
        correct: 1
    },
    {
        question: "Какой пароль надежнее?",
        options: [
            "Qwerty12345",
            "1995alex",
            "K9#mP8$vL2!xR7"
        ],
        correct: 2
    },
    {
        question: "Зачем нужен менеджер паролей?",
        options: [
            "Чтобы записывать все пароли в бумажный блокнот",
            "Чтобы хранить уникальные сложные пароли в зашифрованном виде",
            "Чтобы замедлить работу браузера"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let quizScore = 0;

function loadQuiz() {
    const qText = document.getElementById('question-text');
    const optBox = document.getElementById('options-box');
    const resBox = document.getElementById('quiz-result');
    const nextBtn = document.getElementById('next-btn');
    if (!qText || !optBox) return;

    resBox.textContent = '';
    nextBtn.style.display = 'none';

    if (currentQuestion < quizData.length) {
        const q = quizData[currentQuestion];
        qText.textContent = `Вопрос ${currentQuestion + 1} из ${quizData.length}: ${q.question}`;
        optBox.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.className = 'btn';
            btn.style.cssText = 'background: #1e293b; color: var(--text-primary); border: 1px solid var(--border-color); text-align: left; padding: 0.75rem; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
            btn.onmouseover = () => btn.style.background = 'var(--bg-card-hover)';
            btn.onmouseout = () => btn.style.background = '#1e293b';
            btn.onclick = () => selectOption(index);
            optBox.appendChild(btn);
        });
    } else {
        qText.textContent = `Квиз завершен! Ваш результат: ${quizScore} из ${quizData.length}`;
        optBox.innerHTML = '';
        nextBtn.style.display = 'none';
    }
}

function selectOption(index) {
    const q = quizData[currentQuestion];
    const resBox = document.getElementById('quiz-result');
    const nextBtn = document.getElementById('next-btn');
    const buttons = document.querySelectorAll('#options-box button');

    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
            btn.style.background = 'rgba(16, 185, 129, 0.2)';
            btn.style.borderColor = 'var(--success-color)';
        } else if (i === index) {
            btn.style.background = 'rgba(239, 68, 68, 0.2)';
            btn.style.borderColor = 'var(--danger-color)';
        }
    });

    if (index === q.correct) {
        quizScore++;
        resBox.textContent = "✅ Правильно!";
        resBox.style.color = "var(--success-color)";
    } else {
        resBox.textContent = "❌ Неправильно.";
        resBox.style.color = "var(--danger-color)";
    }

    if (currentQuestion < quizData.length - 1) {
        nextBtn.style.display = 'inline-block';
    } else {
        const qText = document.getElementById('question-text');
        const optBox = document.getElementById('options-box');
        qText.textContent = `Тест окончен! Правильных ответов: ${quizScore} из ${quizData.length}`;
        optBox.innerHTML = '';
        nextBtn.style.display = 'none';
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuiz();
}

// --- 4. СИМУЛЯТОР ФИШИНГА ---
const phishingScenarios = [
    {
        text: "Отправитель: support@g00gle-security.com\nТекст: Срочно подтвердите вход в аккаунт, иначе он будет заблокирован через 24 часа. Ссылка: https://g00gle-security.com/login",
        isPhishing: true,
        explanation: "Это фишинг! Домен g00gle-security.com поддельный (вместо буквы 'o' используются нули '0')."
    },
    {
        text: "Отправитель: no-reply@github.com\nТекст: Безопасность: Обнаружен новый вход в ваш аккаунт с устройства в Варшаве.",
        isPhishing: false,
        explanation: "Это безопасное служебное уведомление с официального домена GitHub."
    },
    {
        text: "Отправитель: bonus@win-iphone-2026.ru\nТекст: Поздравляем! Вы выиграли новый iPhone! Заберите приз, оплатив лишь почтовую доставку 150 руб.",
        isPhishing: true,
        explanation: "Это классическое мошенничество: под предлогом оплаты 'доставки' воруются данные банковской карты."
    }
];

let currentScenarioIndex = 0;

function loadPhishingScenario() {
    const scenarioBox = document.getElementById('phishing-scenario');
    const feedbackBox = document.getElementById('phishing-feedback');
    if (!scenarioBox) return;

    feedbackBox.textContent = '';
    scenarioBox.textContent = phishingScenarios[currentScenarioIndex].text;
}

function checkPhishing(userChoice) {
    const feedbackBox = document.getElementById('phishing-feedback');
    const scenario = phishingScenarios[currentScenarioIndex];

    if (userChoice === scenario.isPhishing) {
        feedbackBox.textContent = "✅ Верно! " + scenario.explanation;
        feedbackBox.style.color = "var(--success-color)";
    } else {
        feedbackBox.textContent = "❌ Ошибка. " + scenario.explanation;
        feedbackBox.style.color = "var(--danger-color)";
    }

    setTimeout(() => {
        currentScenarioIndex = (currentScenarioIndex + 1) % phishingScenarios.length;
        loadPhishingScenario();
    }, 4500);
}

// --- 5. ФИЛЬТР ГЛОССАРИЯ ---
function filterGlossary() {
    const input = document.getElementById('glossary-search');
    if (!input) return;
    const query = input.value.toLowerCase();
    const items = document.querySelectorAll('.glossary-item');

    items.forEach(item => {
        const terms = item.getAttribute('data-term');
        if (terms.includes(query) || item.textContent.toLowerCase().includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Автозапуск квиза и симулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    loadPhishingScenario();
});