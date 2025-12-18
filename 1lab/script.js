// ==================== Часть 1: Уведомление о загрузке страницы ====================

/**
 * Функция, которая выполняется после полной загрузки страницы
 * Уведомляет пользователя о том, что страница полностью загружена
 */
function onPageLoaded() {
    const statusElement = document.getElementById('loadStatus');
    statusElement.textContent = 'Страница полностью загружена!';
    statusElement.style.color = '#2ecc71';
    statusElement.style.fontWeight = 'bold';
    
    // Также можно вывести уведомление в консоль для отладки
    console.log('Страница полностью загружена! DOM готов к работе.');
    
    // Загружаем сохраненные данные из localStorage (если есть)
    loadSavedCredentials();
}

// Назначение обработчика события загрузки страницы
if (document.readyState === 'loading') {
    // Документ еще загружается, ждем события DOMContentLoaded
    document.addEventListener('DOMContentLoaded', onPageLoaded);
} else {
    // DOM уже загружен
    onPageLoaded();
}

// Альтернативный вариант - обработчик события load (ждет все ресурсы)
window.addEventListener('load', function() {
    console.log('Все ресурсы страницы загружены (изображения, стили и т.д.)');
});

// ==================== Часть 2: Счетчик с разными подходами ====================

// Инициализация переменной счетчика
let counter = 0;
const counterElement = document.getElementById('counterValue');

/**
 * Функция для обновления отображения счетчика на странице
 */
function updateCounterDisplay() {
    counterElement.textContent = counter;
    counterElement.style.color = counter < 0 ? '#e74c3c' : '#2c3e50';
}

/**
 * Функция увеличения счетчика на 1
 * Используется подход с onclick в HTML
 */
function incrementCounter() {
    counter++;
    updateCounterDisplay();
    console.log(`Счетчик увеличен. Текущее значение: ${counter}`);
}

/**
 * Функция уменьшения счетчика на 1
 * Будет вызвана через addEventListener
 */
function decrementCounter() {
    counter--;
    updateCounterDisplay();
    console.log(`Счетчик уменьшен. Текущее значение: ${counter}`);
}

/**
 * Функция сброса счетчика
 */
function resetCounter() {
    counter = 0;
    updateCounterDisplay();
    console.log('Счетчик сброшен.');
}

// Получаем кнопку для уменьшения счетчика
const decrementButton = document.getElementById('decrementBtn');

// Назначаем обработчик события click с помощью addEventListener
decrementButton.addEventListener('click', decrementCounter);

// ==================== Часть 3: Форма аутентификации ====================

// Получаем элементы формы
const authForm = document.getElementById('authForm');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('authMessage');
const clearFormButton = document.getElementById('clearFormBtn');
const loadSavedButton = document.getElementById('loadSavedBtn');
const clearStorageButton = document.getElementById('clearStorageBtn');

// Ключи для localStorage
const STORAGE_KEYS = {
    LOGIN: 'webAppLab_login',
    PASSWORD: 'webAppLab_password'
};

/**
 * Функция для отображения сообщения
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип сообщения ('success' или 'error')
 */
function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = 'message ' + type;
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        authMessage.className = 'message';
    }, 5000);
}

/**
 * Функция валидации данных формы
 * @param {string} login - Введенный логин
 * @param {string} password - Введенный пароль
 * @returns {boolean} - Результат валидации
 */
function validateCredentials(login, password) {
    // Проверка по условию задания
    if (login === 'admin' && password === 'admin') {
        showMessage('Успешная аутентификация! Добро пожаловать, администратор.', 'success');
        return true;
    } else {
        showMessage('Ошибка аутентификации. Неверный логин или пароль.', 'error');
        return false;
    }
}

/**
 * Функция сохранения учетных данных в localStorage
 * @param {string} login - Логин для сохранения
 * @param {string} password - Пароль для сохранения
 */
function saveCredentials(login, password) {
    try {
        localStorage.setItem(STORAGE_KEYS.LOGIN, login);
        localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
        console.log('Данные успешно сохранены в localStorage');
        showMessage('Данные сохранены для будущих сессий.', 'success');
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
        showMessage('Ошибка при сохранении данных.', 'error');
    }
}

/**
 * Функция загрузки сохраненных учетных данных из localStorage
 */
function loadSavedCredentials() {
    const savedLogin = localStorage.getItem(STORAGE_KEYS.LOGIN);
    const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD);
    
    if (savedLogin && savedPassword) {
        loginInput.value = savedLogin;
        passwordInput.value = savedPassword;
        console.log('Сохраненные данные загружены из localStorage');
        showMessage('Сохраненные данные загружены в форму.', 'success');
    } else {
        console.log('Сохраненные данные отсутствуют в localStorage');
    }
}

/**
 * Функция очистки данных формы
 */
function clearForm() {
    authForm.reset();
    authMessage.className = 'message';
    console.log('Форма очищена');
    showMessage('Форма очищена.', 'success');
}

/**
 * Функция очистки данных в localStorage
 */
function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEYS.LOGIN);
    localStorage.removeItem(STORAGE_KEYS.PASSWORD);
    console.log('Данные удалены из localStorage');
    showMessage('Сохраненные данные удалены из хранилища.', 'success');
}

// Обработчик отправки формы (через addEventListener)
authForm.addEventListener('submit', function(event) {
    // Отменяем стандартную отправку формы
    event.preventDefault();
    
    // Получаем значения из формы
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log(`Попытка входа: Логин=${login}, Пароль=${password}`);
    
    // Проводим валидацию
    const isValid = validateCredentials(login, password);
    
    // Если валидация успешна - сохраняем данные
    if (isValid) {
        saveCredentials(login, password);
    }
});

// Назначаем обработчики кнопкам
clearFormButton.addEventListener('click', clearForm);
loadSavedButton.addEventListener('click', loadSavedCredentials);
clearStorageButton.addEventListener('click', clearLocalStorage);

// ==================== Дополнительные функции для удобства ====================

/**
 * Функция для отображения текущего состояния localStorage
 */
function showStorageStatus() {
    const hasSavedData = localStorage.getItem(STORAGE_KEYS.LOGIN) !== null;
    console.log(`Данные в localStorage: ${hasSavedData ? 'присутствуют' : 'отсутствуют'}`);
}

// Проверяем состояние localStorage при загрузке
showStorageStatus();

// Экспортируем функции для тестирования (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        incrementCounter,
        decrementCounter,
        resetCounter,
        validateCredentials,
        saveCredentials,
        clearForm
    };
}