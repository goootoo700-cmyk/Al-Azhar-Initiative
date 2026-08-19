// ============ Dashboard Logic ============
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const student = checkAuthentication();
    
    if (student) {
        // Display student information
        displayStudentInfo(student);
        
        // Load competitions and exams
        loadCompetitions(student.grade);
        loadExams(student.grade);
        
        // Load account data
        loadAccountData(student);
    }
});

// Display student information in dashboard
function displayStudentInfo(student) {
    // Welcome message
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        welcomeElement.textContent = `مرحبًا، ${student.fullName}`;
    }
    
    // Student avatar (first letter of name)
    const avatarElement = document.getElementById('studentAvatar');
    if (avatarElement) {
        avatarElement.innerHTML = `<span>${student.fullName.charAt(0)}</span>`;
    }
    
    // Student code badge
    const codeBadge = document.getElementById('studentCodeBadge');
    if (codeBadge) {
        codeBadge.innerHTML = `
            <i class="fas fa-id-card"></i>
            الكود: ${student.studentCode}
        `;
    }
    
    // Grade badge
    const gradeBadge = document.getElementById('gradeBadge');
    if (gradeBadge) {
        gradeBadge.innerHTML = `
            <i class="fas fa-graduation-cap"></i>
            الصف: ${getGradeName(student.grade)}
        `;
    }
}

// Load competitions for student's grade
function loadCompetitions(grade) {
    const competitions = dataManager.getCompetitionsByGrade(grade);
    const competitionsList = document.getElementById('competitionsList');
    
    if (competitionsList) {
        if (competitions.length === 0) {
            competitionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>لا توجد مسابقات متاحة حالياً لصفك الدراسي</p>
                </div>
            `;
        } else {
            competitionsList.innerHTML = competitions.map(comp => `
                <div class="item-card">
                    <h4>${comp.title}</h4>
                    <p>${comp.description}</p>
                    <small>من: ${formatDate(comp.startDate)} إلى: ${formatDate(comp.endDate)}</small>
                </div>
            `).join('');
        }
    }
}

// Load exams for student's grade
function loadExams(grade) {
    const exams = dataManager.getExamsByGrade(grade);
    const examsList = document.getElementById('examsList');
    
    if (examsList) {
        if (exams.length === 0) {
            examsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <p>لا توجد امتحانات متاحة حالياً لصفك الدراسي</p>
                </div>
            `;
        } else {
            examsList.innerHTML = exams.map(exam => `
                <div class="item-card">
                    <h4>${exam.title}</h4>
                    <p>${exam.description}</p>
                    <small>المدة: ${exam.duration} دقيقة | الدرجة: ${exam.totalMarks}</small>
                </div>
            `).join('');
        }
    }
}

// Load account data
function loadAccountData(student) {
    const accountInfo = document.getElementById('accountInfo');
    
    if (accountInfo) {
        accountInfo.innerHTML = `
            <div class="account-field">
                <label>الاسم الكامل:</label>
                <span>${student.fullName}</span>
            </div>
            <div class="account-field">
                <label>كود الطالب:</label>
                <span>${student.studentCode}</span>
            </div>
            <div class="account-field">
                <label>رقم الهاتف:</label>
                <span>${student.phone}</span>
            </div>
            <div class="account-field">
                <label>المحافظة:</label>
                <span>${student.governorate}</span>
            </div>
            <div class="account-field">
                <label>المنطقة الأزهرية:</label>
                <span>${student.azharRegion}</span>
            </div>
            <div class="account-field">
                <label>المعهد:</label>
                <span>${student.institute}</span>
            </div>
            <div class="account-field">
                <label>الصف الدراسي:</label>
                <span>${getGradeName(student.grade)}</span>
            </div>
            <div class="account-field">
                <label>تاريخ التسجيل:</label>
                <span>${formatDate(student.registrationDate)}</span>
            </div>
        `;
    }
}

// Show competitions section
function showCompetitions() {
    hideAllSections();
    const section = document.getElementById('competitionsSection');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show exams section
function showExams() {
    hideAllSections();
    const section = document.getElementById('examsSection');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show account data section
function showAccountData() {
    hideAllSections();
    const section = document.getElementById('accountSection');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Hide all content sections
function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Edit account
function editAccount() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Populate form with current data
        const student = checkAuthentication();
        if (student) {
            document.getElementById('editPhone').value = student.phone;
            document.getElementById('editInstitute').value = student.institute;
        }
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle edit form submission
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editForm');
    
    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const student = checkAuthentication();
            if (!student) return;
            
            const updatedData = {
                phone: document.getElementById('editPhone').value.trim(),
                institute: document.getElementById('editInstitute').value.trim()
            };
            
            // Validate data
            if (!validatePhone(updatedData.phone)) {
                showToast('رقم الهاتف غير صحيح', 'error');
                return;
            }
            
            if (updatedData.institute.length < 3) {
                showToast('اسم المعهد يجب أن يكون 3 أحرف على الأقل', 'error');
                return;
            }
            
            // Update student data
            const updated = dataManager.updateStudent(student.studentCode, updatedData);
            
            if (updated) {
                showToast('تم تحديث البيانات بنجاح', 'success');
                closeEditModal();
                
                // Reload account data
                loadAccountData(updated);
            } else {
                showToast('حدث خطأ أثناء تحديث البيانات', 'error');
            }
        });
    }
});