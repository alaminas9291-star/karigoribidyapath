// Local Administrative Credentials
const ADMIN_EMAIL = "Alaminas9291@gmail.com";
const ADMIN_PASS = "@Alamin017";

// Default System Database
let defaultData = {
    settings: {
        phone: "01790489291",
        email: "alaminas9291@gmail.com",
        bio: "পলিটেকনিক ডিপ্লোমা শিক্ষার্থীদের পড়াশোনা সহজ করতে একটি নির্ভরযোগ্য প্ল্যাটফর্ম।"
    },
    notices: [
        { title: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং ১ম ও ৩য় সেমিস্টার চূড়ান্ত রুটিন প্রকাশিত", date: "২০২৬-০৮-২০", link: "#" }
    ],
    courses: [
        { title: "Computer Technology Special Batch", instructor: "ইঞ্জি. আলামিন হোসেন", price: "১০০০ টাকা" }
    ],
    notes: [
        { subject: "Data Structure & Algorithm", semester: "3rd Semester", link: "#" }
    ],
    teachers: [
        { name: "ইঞ্জি. আলামিন হোসেন", dept: "Computer Technology", title: "Senior Instructor" }
    ],
    routines: [
        { dept: "Computer", sem: "3rd", title: "Class Routine 2026", link: "#" }
    ]
};

// Database Handlers
function getDatabase() {
    let stored = localStorage.getItem("karigori_db");
    if (!stored) {
        localStorage.setItem("karigori_db", JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(stored);
}

function saveDatabase(data) {
    localStorage.setItem("karigori_db", JSON.stringify(data));
}

// Authentication Handlers
function handleAdminLogin(e) {
    e.preventDefault();
    let emailInput = document.getElementById("adminEmail").value.trim();
    let passInput = document.getElementById("adminPassword").value.trim();
    let errorMsg = document.getElementById("loginErrorMsg");

    if (emailInput === ADMIN_EMAIL && passInput === ADMIN_PASS) {
        sessionStorage.setItem("is_admin_logged", "true");
        checkAdminAuth();
    } else {
        if (errorMsg) errorMsg.innerText = "ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন!";
    }
}

function checkAdminAuth() {
    let loginScreen = document.getElementById("adminLoginScreen");
    let dashboardWrapper = document.getElementById("dashboardWrapper");

    if (sessionStorage.getItem("is_admin_logged") === "true") {
        if (loginScreen) loginScreen.style.display = "none";
        if (dashboardWrapper) dashboardWrapper.style.display = "flex";
        populateAdminDashboard();
    } else {
        if (loginScreen) loginScreen.style.display = "flex";
        if (dashboardWrapper) dashboardWrapper.style.display = "none";
    }
}

function adminLogout() {
    sessionStorage.removeItem("is_admin_logged");
    checkAdminAuth();
}

// Populate Data in Admin Lists
function populateAdminDashboard() {
    let db = getDatabase();

    // Metrics Counters
    if (document.getElementById("countCourses")) document.getElementById("countCourses").innerText = db.courses.length;
    if (document.getElementById("countNotes")) document.getElementById("countNotes").innerText = db.notes.length;
    if (document.getElementById("countNotices")) document.getElementById("countNotices").innerText = db.notices.length;
    if (document.getElementById("countTeachers")) document.getElementById("countTeachers").innerText = db.teachers.length;

    // Settings
    if (document.getElementById("setPhone")) document.getElementById("setPhone").value = db.settings.phone;
    if (document.getElementById("setEmail")) document.getElementById("setEmail").value = db.settings.email;
    if (document.getElementById("setFooterBio")) document.getElementById("setFooterBio").value = db.settings.bio;

    // Render Lists
    renderList("adminNoticeList", db.notices, (item, i) => `${item.title} (${item.date}) <button onclick="deleteItem('notices', ${i})">মুছুন</button>`);
    renderList("adminCourseList", db.courses, (item, i) => `${item.title} - ${item.price} <button onclick="deleteItem('courses', ${i})">মুছুন</button>`);
    renderList("adminNoteList", db.notes, (item, i) => `${item.subject} (${item.semester}) <button onclick="deleteItem('notes', ${i})">মুছুন</button>`);
    renderList("adminTeacherList", db.teachers, (item, i) => `${item.name} - ${item.dept} <button onclick="deleteItem('teachers', ${i})">মুছুন</button>`);
}

function renderList(elementId, array, callback) {
    let container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = "";
    array.forEach((item, index) => {
        let li = document.createElement("li");
        li.style.cssText = "margin-bottom:8px; padding:8px; background:#f1f5f9; border-radius:4px; display:flex; justify-content:space-between; align-items:center;";
        li.innerHTML = callback(item, index);
        container.appendChild(li);
    });
}

// Item Actions (Add & Delete)
function deleteItem(type, index) {
    let db = getDatabase();
    db[type].splice(index, 1);
    saveDatabase(db);
    populateAdminDashboard();
}

function saveNotice(e) {
    e.preventDefault();
    let db = getDatabase();
    db.notices.unshift({
        title: document.getElementById("noticeTitle").value,
        date: new Date().toISOString().split('T')[0],
        link: document.getElementById("noticeLink").value
    });
    saveDatabase(db);
    document.getElementById("addNoticeForm").reset();
    populateAdminDashboard();
}

function saveCourse(e) {
    e.preventDefault();
    let db = getDatabase();
    db.courses.unshift({
        title: document.getElementById("courseTitle").value,
        instructor: document.getElementById("courseInstructor").value,
        price: document.getElementById("coursePrice").value
    });
    saveDatabase(db);
    document.getElementById("addCourseForm").reset();
    populateAdminDashboard();
}

function saveNote(e) {
    e.preventDefault();
    let db = getDatabase();
    db.notes.unshift({
        subject: document.getElementById("noteSubject").value,
        semester: document.getElementById("noteSemester").value,
        link: document.getElementById("noteLink").value
    });
    saveDatabase(db);
    document.getElementById("addNoteForm").reset();
    populateAdminDashboard();
}

function saveTeacher(e) {
    e.preventDefault();
    let db = getDatabase();
    db.teachers.unshift({
        name: document.getElementById("teacherName").value,
        dept: document.getElementById("teacherDept").value,
        title: document.getElementById("teacherTitle").value
    });
    saveDatabase(db);
    document.getElementById("addTeacherForm").reset();
    populateAdminDashboard();
}

function saveSiteSettings(e) {
    e.preventDefault();
    let db = getDatabase();
    db.settings.phone = document.getElementById("setPhone").value;
    db.settings.email = document.getElementById("setEmail").value;
    db.settings.bio = document.getElementById("setFooterBio").value;
    saveDatabase(db);
    alert("সাইট সেটিংস আপডেট করা হয়েছে!");
}

document.addEventListener("DOMContentLoaded", checkAdminAuth);