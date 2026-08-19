// ============ Registration Logic ============
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            if (this.classList.contains('has-error')) {
                validateField(this);
            }
        });
    });
});

// Handle registration form submission
function handleRegistration(event) {
    event.preventDefault();
    
    // Show loading
    showLoading();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        governorate: document.getElementById('governorate').value,
        azharRegion: document.getElementById('azharRegion').value.trim(),
        institute: document.getElementById('institute').value.trim(),
        grade: document.getElementById('grade').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Validate all fields
    if (!validateRegistrationForm(formData)) {
        hideLoading();
        return;
    }
    
    // Check if student already exists (by phone)
    const existingStudent = dataManager.getStudentByPhone(formData.phone);
    if (existingStudent) {
        hideLoading();
        showToast('رقم الهاتف مسجل بالفعل في النظام', 'error');
        document.getElementById('phone').classList.add('has-error');
        document.getElementById('phoneError').textContent = 'هذا الرقم مسجل بالفعل';
        return;
    }
    
    // Generate unique student code
    const studentCode = dataManager.generateUniqueStudentCode();
    
    // Create student object
    const studentData = {
        studentCode: studentCode,
        fullName: formData.fullName,
        phone: formData.phone,
        governorate: formData.governorate,
        azharRegion: formData.azharRegion,
        institute: formData.institute,
        grade: formData.grade,
        password: formData.password,
        registrationDate: new Date().toISOString(),
        lastLogin: null,
        isActive: true
    };
    
    // Save student
    dataManager.addStudent(studentData);
    
    // Simulate processing delay
    setTimeout(() => {
        hideLoading();
        
        // Store registration data for success page
        sessionStorage.setItem('lastRegistration', JSON.stringify(studentData));
        
        // Redirect to success page
        window.location.href = 'registration-success.html';
    }, 1500);
}

// Validate registration form
function validateRegistrationForm(data) {
    let isValid = true;
    
    // Validate full name
    if (data.fullName.length < 3) {
        showFieldError('fullName', 'الاسم يجب أن يكون 3 أحرف على الأقل');
        isValid = false;
    } else {
        clearFieldError('fullName');
    }
    
    // Validate phone
    if (!validatePhone(data.phone)) {
        showFieldError('phone', 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01');
        isValid = false;
    } else {
        clearFieldError('phone');
    }
    
    // Validate governorate
    if (!data.governorate) {
        showFieldError('governorate', 'يرجى اختيار المحافظة');
        isValid = false;
    } else {
        clearFieldError('governorate');
    }
    
    // Validate azhar region
    if (data.azharRegion.length < 3) {
        showFieldError('azharRegion', 'يرجى إدخال المنطقة الأزهرية');
        isValid = false;
    } else {
        clearFieldError('azharRegion');
    }
    
    // Validate institute
    if (data.institute.length < 3) {
        showFieldError('institute', 'يرجى إدخال اسم المعهد');
        isValid = false;
    } else {
        clearFieldError('institute');
    }
    
    // Validate grade
    if (!data.grade) {
        showFieldError('grade', 'يرجى اختيار الصف الدراسي');
        isValid = false;
    } else {
        clearFieldError('grade');
    }
    
    // Validate password
    if (!validatePassword(data.password)) {
        showFieldError('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
    } else {
        clearFieldError('password');
    }
    
    // Validate confirm password
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'كلمتا المرور غير متطابقتين');
        isValid = false;
    } else {
        clearFieldError('confirmPassword');
    }
    
    return isValid;
}

// Validate single field
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'fullName':
            if (value.length < 3) {
                showFieldError(fieldId, 'الاسم يجب أن يكون 3 أحرف على الأقل');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'phone':
            if (!validatePhone(value)) {
                showFieldError(fieldId, 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'governorate':
            if (!value) {
                showFieldError(fieldId, 'يرجى اختيار المحافظة');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'azharRegion':
            if (value.length < 3) {
                showFieldError(fieldId, 'يرجى إدخال المنطقة الأزهرية');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'institute':
            if (value.length < 3) {
                showFieldError(fieldId, 'يرجى إدخال اسم المعهد');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'grade':
            if (!value) {
                showFieldError(fieldId, 'يرجى اختيار الصف الدراسي');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'password':
            if (!validatePassword(value)) {
                showFieldError(fieldId, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'confirmPassword':
            const passwordValue = document.getElementById('password').value;
            if (value !== passwordValue) {
                showFieldError(fieldId, 'كلمتا المرور غير متطابقتين');
            } else {
                clearFieldError(fieldId);
            }
            break;
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('has-error');
        field.classList.remove('has-success');
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
        field.classList.add('has-success');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}