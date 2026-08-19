// ============ Login Logic ============
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateLoginField(this);
        });
        input.addEventListener('input', function() {
            if (this.classList.contains('has-error')) {
                validateLoginField(this);
            }
        });
    });
});

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    // Show loading
    showLoading();
    
    // Get form data
    const studentCode = document.getElementById('studentCode').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    
    // Validate form
    if (!validateLoginForm(studentCode, password)) {
        hideLoading();
        return;
    }
    
    // Check credentials
    const student = dataManager.validateLogin(studentCode, password);
    
    if (student) {
        // Save session
        dataManager.saveSession(student);
        
        // Update last login
        dataManager.updateStudent(studentCode, {
            lastLogin: new Date().toISOString()
        });
        
        // Show success message
        hideLoading();
        showToast('تم تسجيل الدخول بنجاح', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 1000);
    } else {
        hideLoading();
        showToast('كود الطالب أو كلمة المرور غير صحيحة', 'error');
        
        // Highlight fields with error
        document.getElementById('studentCode').classList.add('has-error');
        document.getElementById('password').classList.add('has-error');
        
        // Clear error after 3 seconds
        setTimeout(() => {
            document.getElementById('studentCode').classList.remove('has-error');
            document.getElementById('password').classList.remove('has-error');
        }, 3000);
    }
}

// Validate login form
function validateLoginForm(studentCode, password) {
    let isValid = true;
    
    // Validate student code
    if (!studentCode) {
        showFieldError('studentCode', 'يرجى إدخال كود الطالب');
        isValid = false;
    } else {
        clearFieldError('studentCode');
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'يرجى إدخال كلمة المرور');
        isValid = false;
    } else {
        clearFieldError('password');
    }
    
    return isValid;
}

// Validate single field
function validateLoginField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(fieldId, fieldId === 'studentCode' ? 'يرجى إدخال كود الطالب' : 'يرجى إدخال كلمة المرور');
    } else {
        clearFieldError(fieldId);
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('has-error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('has-error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}