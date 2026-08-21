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
    loadClientData();
}

// Authentication Handlers
function handleAdminLogin(e) {
    if (e) e.preventDefault();
    let emailInput = document.getElementById("adminEmail")?.value.trim();
    let passInput = document.getElementById("adminPassword")?.value.trim();
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

    if (!loginScreen && !dashboardWrapper) return;

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

// Admin Tab Switching Function
function switchTab(tabId, element) {
    let tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    let activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.add('active');

    let menuItems = document.querySelectorAll('.admin-menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');

    const titles = {
        'tab-overview': 'ওভারভিউ',
        'tab-notices': 'নোটিশ ম্যানেজমেন্ট',
        'tab-courses': 'কোর্স ম্যানেজমেন্ট',
        'tab-notes': 'নোটস ও পিডিএফ',
        'tab-teachers': 'শিক্ষকবৃন্দ',
        'tab-settings': 'সাইট সেটিং'
    };
    let titleElement = document.getElementById('currentTabTitle');
    if(titleElement) titleElement.innerText = titles[tabId] || 'ড্যাশবোর্ড';
}

// Populate Data in Admin Dashboard Lists
function populateAdminDashboard() {
    let db = getDatabase();

    if (document.getElementById("countCourses")) document.getElementById("countCourses").innerText = db.courses.length;
    if (document.getElementById("countNotes")) document.getElementById("countNotes").innerText = db.notes.length;
    if (document.getElementById("countNotices")) document.getElementById("countNotices").innerText = db.notices.length;
    if (document.getElementById("countTeachers")) document.getElementById("countTeachers").innerText = db.teachers.length;

    if (document.getElementById("setPhone")) document.getElementById("setPhone").value = db.settings.phone;
    if (document.getElementById("setEmail")) document.getElementById("setEmail").value = db.settings.email;
    if (document.getElementById("setFooterBio")) document.getElementById("setFooterBio").value = db.settings.bio;

    renderList("adminNoticeList", db.notices, (item, i) => `<span>${item.title} (${item.date})</span> <button onclick="deleteItem('notices', ${i})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">মুছুন</button>`);
    renderList("adminCourseList", db.courses, (item, i) => `<span>${item.title} - ${item.price}</span> <button onclick="deleteItem('courses', ${i})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">মুছুন</button>`);
    renderList("adminNoteList", db.notes, (item, i) => `<span>${item.subject} (${item.semester})</span> <button onclick="deleteItem('notes', ${i})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">মুছুন</button>`);
    renderList("adminTeacherList", db.teachers, (item, i) => `<span>${item.name} - ${item.dept}</span> <button onclick="deleteItem('teachers', ${i})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">মুছুন</button>`);
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
    if (e) e.preventDefault();
    let db = getDatabase();
    db.notices.unshift({
        title: document.getElementById("noticeTitle").value,
        date: new Date().toISOString().split('T')[0],
        link: document.getElementById("noticeLink").value || "#"
    });
    saveDatabase(db);
    document.getElementById("addNoticeForm")?.reset();
    populateAdminDashboard();
    alert("নোটিশ সফলভাবে যোগ হয়েছে!");
}

function saveCourse(e) {
    if (e) e.preventDefault();
    let db = getDatabase();
    db.courses.unshift({
        title: document.getElementById("courseTitle").value,
        instructor: document.getElementById("courseInstructor").value,
        price: document.getElementById("coursePrice").value
    });
    saveDatabase(db);
    document.getElementById("addCourseForm")?.reset();
    populateAdminDashboard();
    alert("কোর্স সফলভাবে যোগ হয়েছে!");
}

function saveNote(e) {
    if (e) e.preventDefault();
    let db = getDatabase();
    db.notes.unshift({
        subject: document.getElementById("noteSubject").value,
        semester: document.getElementById("noteSemester").value,
        link: document.getElementById("noteLink").value
    });
    saveDatabase(db);
    document.getElementById("addNoteForm")?.reset();
    populateAdminDashboard();
    alert("নোট সফলভাবে যোগ হয়েছে!");
}

function saveTeacher(e) {
    if (e) e.preventDefault();
    let db = getDatabase();
    db.teachers.unshift({
        name: document.getElementById("teacherName").value,
        dept: document.getElementById("teacherDept").value,
        title: document.getElementById("teacherTitle").value
    });
    saveDatabase(db);
    document.getElementById("addTeacherForm")?.reset();
    populateAdminDashboard();
    alert("শিক্ষক সফলভাবে যোগ হয়েছে!");
}

function saveSiteSettings(e) {
    if (e) e.preventDefault();
    let db = getDatabase();
    db.settings.phone = document.getElementById("setPhone").value;
    db.settings.email = document.getElementById("setEmail").value;
    db.settings.bio = document.getElementById("setFooterBio").value;
    saveDatabase(db);
    alert("সাইট সেটিংস আপডেট করা হয়েছে!");
}

// Populate Client Interface (index.html)
function loadClientData() {
    let db = getDatabase();

    // Stats Counter Update
    if (document.getElementById("statCourses")) document.getElementById("statCourses").innerText = db.courses.length + "+";
    if (document.getElementById("statNotes")) document.getElementById("statNotes").innerText = db.notes.length + "+";

    // Contact and Footer Updates
    if (document.getElementById("top-email")) document.getElementById("top-email").innerText = db.settings.email;
    if (document.getElementById("top-phone")) document.getElementById("top-phone").innerText = db.settings.phone;
    if (document.getElementById("dynEmail")) document.getElementById("dynEmail").innerText = db.settings.email;
    if (document.getElementById("dynPhone")) document.getElementById("dynPhone").innerText = db.settings.phone;
    if (document.getElementById("footerBioText")) document.getElementById("footerBioText").innerText = db.settings.bio;

    // Ticker Notice Update
    let liveTicker = document.getElementById("liveTickerNotice");
    if (liveTicker && db.notices.length > 0) {
        liveTicker.innerHTML = `<span>${db.notices[0].title} (${db.notices[0].date})</span>`;
    }

    // Dynamic Notices List
    let noticeContainer = document.getElementById("dynamicNoticeList");
    if (noticeContainer) {
        noticeContainer.innerHTML = "";
        db.notices.forEach(n => {
            let li = document.createElement("li");
            li.style.cssText = "padding:10px; border-bottom:1px solid #e2e8f0; margin-bottom:5px;";
            li.innerHTML = `<i class="fa-solid fa-bullhorn" style="color:#0284c7;"></i> <strong>${n.title}</strong> <small>(${n.date})</small>`;
            noticeContainer.appendChild(li);
        });
    }

    // Dynamic Courses Cards
    let courseContainer = document.getElementById("dynamicCoursesGrid");
    if (courseContainer) {
        courseContainer.innerHTML = "";
        db.courses.forEach(c => {
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<h3><i class="fa-solid fa-book"></i> ${c.title}</h3><p>শিক্ষক: ${c.instructor}</p><p>ফি: <strong>${c.price}</strong></p>`;
            courseContainer.appendChild(card);
        });
    }

    // Dynamic Downloads Cards
    let notesContainer = document.getElementById("dynamicDownloadsGrid");
    if (notesContainer) {
        notesContainer.innerHTML = "";
        db.notes.forEach(n => {
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<h3><i class="fa-solid fa-file-pdf"></i> ${n.subject}</h3><p>সেমিস্টার: ${n.semester}</p><a href="${n.link}" target="_blank" style="color:#0284c7; font-weight:bold;">ডাউনলোড করুন</a>`;
            notesContainer.appendChild(card);
        });
    }

    // Dynamic Teachers Grid
    let teachersContainer = document.getElementById("dynamicTeachersGrid");
    if (teachersContainer) {
        teachersContainer.innerHTML = "";
        db.teachers.forEach(t => {
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<h3><i class="fa-solid fa-user-tie"></i> ${t.name}</h3><p>${t.title}</p><p><small>${t.dept}</small></p>`;
            teachersContainer.appendChild(card);
        });
    }
}

// Global UI Component Handlers
function toggleSidebar() {
    const sidebar = document.getElementById("mobileSidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (sidebar && overlay) {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    }
}

function toggleSubMenu(menuId) {
    const subMenu = document.getElementById(menuId);
    if (subMenu) {
        subMenu.style.display = (subMenu.style.display === "block") ? "none" : "block";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    checkAdminAuth();
    loadClientData();
});
