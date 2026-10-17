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