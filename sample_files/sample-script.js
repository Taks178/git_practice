// Sample JavaScript file for Git practice

// グローバル変数
const APP_NAME = 'Git Practice Project';
const VERSION = '1.0.0';

// ユーティリティ関数
function logMessage(message) {
    console.log(`[${APP_NAME}] ${message}`);
}

// DOM操作関数
function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        logMessage('Page loaded successfully');
        
        // ナビゲーションメニューのクリックイベント
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                scrollToSection(targetId);
            });
        });
        
        // バージョン情報を表示
        displayVersion();
    });
}

// スムーススクロール関数
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        logMessage(`Scrolled to section: ${sectionId}`);
    }
}

// バージョン情報表示
function displayVersion() {
    const footer = document.querySelector('footer');
    if (footer) {
        const versionInfo = document.createElement('p');
        versionInfo.textContent = `Version: ${VERSION}`;
        versionInfo.style.fontSize = '0.8em';
        versionInfo.style.color = '#666';
        footer.appendChild(versionInfo);
    }
}

// フォーム検証（将来の拡張用）
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Valid email is required');
    }
    
    return errors;
}

// メールアドレス検証
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// 初期化
setupEventListeners();

// エクスポート（モジュール化の練習用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        logMessage,
        validateForm,
        isValidEmail
    };
}