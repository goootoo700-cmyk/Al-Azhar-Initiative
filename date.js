// ============ Data Management System ============
// This file manages all data operations for the platform
// Currently using LocalStorage, but structured for future Backend integration

class DataManager {
    constructor() {
        this.storageKey = 'azhar_platform_data';
        this.sessionKey = 'azhar_platform_session';
        this.initializeData();
    }
    
    // Initialize the data structure
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                students: [],
                competitions: this.getDefaultCompetitions(),
                exams: this.getDefaultExams(),
                settings: {
                    platformName: 'مبادرة معًا نتعلم الأزهرية',
                    currentAcademicYear: '2024-2025'
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }
    
    // Get all data
    getAllData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }
    
    // Save all data
    saveAllData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    // Get all students
    getAllStudents() {
        const data = this.getAllData();
        return data.students || [];
    }
    
    // Get student by code
    getStudentByCode(studentCode) {
        const students = this.getAllStudents();
        return students.find(student => student.studentCode === studentCode);
    }
    
    // Get student by phone
    getStudentByPhone(phone) {
        const students = this.getAllStudents();
        return students.find(student => student.phone === phone);
    }
    
    // Add new student
    addStudent(studentData) {
        const data = this.getAllData();
        data.students.push(studentData);
        this.saveAllData(data);
        return studentData;
    }
    
    // Update student
    updateStudent(studentCode, updatedData) {
        const data = this.getAllData();
        const index = data.students.findIndex(student => student.studentCode === studentCode);
        if (index !== -1) {
            data.students[index] = { ...data.students[index], ...updatedData };
            this.saveAllData(data);
            return data.students[index];
        }
        return null;
    }
    
    // Generate unique student code
    generateUniqueStudentCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        let isUnique = false;
        
        while (!isUnique) {
            code = 'AZ-';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            // Check if code already exists
            const students = this.getAllStudents();
            isUnique = !students.some(student => student.studentCode === code);
        }
        
        return code;
    }
    
    // Validate login credentials
    validateLogin(studentCode, password) {
        const student = this.getStudentByCode(studentCode);
        if (student && student.password === password) {
            return student;
        }
        return null;
    }
    
    // Save session
    saveSession(studentData) {
        localStorage.setItem(this.sessionKey, JSON.stringify({
            studentCode: studentData.studentCode,
            loginTime: new Date().toISOString()
        }));
    }
    
    // Get current session
    getCurrentSession() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }
    
    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
    }
    
    // Get competitions by grade
    getCompetitionsByGrade(grade) {
        const data = this.getAllData();
        return data.competitions.filter(comp => comp.grade === grade && comp.isActive);
    }
    
    // Get exams by grade
    getExamsByGrade(grade) {
        const data = this.getAllData();
        return data.exams.filter(exam => exam.grade === grade && exam.isActive);
    }
    
    // Get default competitions (example data)
    getDefaultCompetitions() {
        return [
            {
                id: 'comp_1',
                title: 'مسابقة حفظ القرآن الكريم',
                description: 'مسابقة في حفظ وتلاوة القرآن الكريم',
                grade: 'first_secondary',
                isActive: true,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            },
            {
                id: 'comp_2',
                title: 'مسابقة الفقه',
                description: 'مسابقة في مادة الفقه',
                grade: 'first_secondary',
                isActive: true,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            },
            {
                id: 'comp_3',
                title: 'مسابقة النحو',
                description: 'مسابقة في علم النحو',
                grade: 'second_secondary',
                isActive: true,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            },
            {
                id: 'comp_4',
                title: 'مسابقة البلاغة',
                description: 'مسابقة في علم البلاغة',
                grade: 'third_secondary',
                isActive: true,
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            }
        ];
    }
    
    // Get default exams (example data)
    getDefaultExams() {
        return [
            {
                id: 'exam_1',
                title: 'امتحان الفصل الدراسي الأول - التوحيد',
                description: 'امتحان تجريبي في مادة التوحيد',
                grade: 'first_secondary',
                isActive: true,
                duration: 60,
                totalMarks: 100
            },
            {
                id: 'exam_2',
                title: 'امتحان الفصل الدراسي الأول - التفسير',
                description: 'امتحان تجريبي في مادة التفسير',
                grade: 'first_secondary',
                isActive: true,
                duration: 60,
                totalMarks: 100
            },
            {
                id: 'exam_3',
                title: 'امتحان الفقه - الفصل الثاني',
                description: 'امتحان تجريبي في مادة الفقه',
                grade: 'second_secondary',
                isActive: true,
                duration: 90,
                totalMarks: 100
            },
            {
                id: 'exam_4',
                title: 'امتحان الحديث - الفصل الثاني',
                description: 'امتحان تجريبي في مادة الحديث',
                grade: 'third_secondary',
                isActive: true,
                duration: 90,
                totalMarks: 100
            }
        ];
    }
}

// Create global data manager instance
const dataManager = new DataManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataManager;
}