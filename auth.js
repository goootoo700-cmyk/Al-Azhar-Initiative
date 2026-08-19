// ============ Authentication & Security System ============
// This file handles authentication, theme management, and common utilities

// ============ Theme Management ============
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ============ Loading Overlay ============
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ============ Toast Notifications ============
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(messageSpan);
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============ Authentication Guard ============
function checkAuthentication() {
    const session = dataManager.getCurrentSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    const student = dataManager.getStudentByCode(session.studentCode);
    if (!student) {
        dataManager.clearSession();
        window.location.href = 'login.html';
        return null;
    }
    
    return student;
}

// ============ Logout ============
function logout() {
    dataManager.clearSession();
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ============ Form Validation ============
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^01[0-9]{9}$/;
    return re.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// ============ Utility Functions ============
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

function getGradeName(gradeCode) {
    const gradeNames = {
        'first_secondary': 'الصف الأول الثانوي الأزهري',
        'second_secondary': 'الصف الثاني الثانوي الأزهري',
        'third_secondary': 'الصف الثالث الثانوي الأزهري'
    };
    return gradeNames[gradeCode] || gradeCode;
}

// ============ Initialize on page load ============
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});