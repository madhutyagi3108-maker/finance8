/* ============================================
   INTERNHUNT – SCRIPT.JS
   Dynamic filtering, Antigravity mode,
   Modal, Animations, and Interactions
   ============================================ */

// ── INTERNSHIP DATA ──
const internships = [
    {
        id: 1,
        role: "Frontend Developer Intern",
        company: "Google",
        location: "Bangalore",
        stipend: 40000,
        duration: "3 Months",
        type: "Hybrid",
        icon: "fab fa-google"
    },
    {
        id: 2,
        role: "Data Analyst Intern",
        company: "Infosys",
        location: "Hyderabad",
        stipend: 15000,
        duration: "6 Months",
        type: "On-site",
        icon: "fas fa-chart-bar"
    },
    {
        id: 3,
        role: "Backend Developer Intern",
        company: "Tata Consultancy Services",
        location: "Mumbai",
        stipend: 20000,
        duration: "4 Months",
        type: "On-site",
        icon: "fas fa-server"
    },
    {
        id: 4,
        role: "UI/UX Design Intern",
        company: "Wipro",
        location: "Pune",
        stipend: 12000,
        duration: "3 Months",
        type: "Remote",
        icon: "fas fa-palette"
    },
    {
        id: 5,
        role: "Machine Learning Intern",
        company: "Microsoft",
        location: "Bangalore",
        stipend: 45000,
        duration: "6 Months",
        type: "Hybrid",
        icon: "fas fa-brain"
    },
    {
        id: 6,
        role: "Cloud Engineering Intern",
        company: "Amazon",
        location: "Chennai",
        stipend: 35000,
        duration: "3 Months",
        type: "Remote",
        icon: "fas fa-cloud"
    },
    {
        id: 7,
        role: "Cybersecurity Intern",
        company: "Infosys",
        location: "Delhi",
        stipend: 18000,
        duration: "4 Months",
        type: "On-site",
        icon: "fas fa-shield-alt"
    },
    {
        id: 8,
        role: "Digital Marketing Intern",
        company: "Flipkart",
        location: "Bangalore",
        stipend: 10000,
        duration: "3 Months",
        type: "Remote",
        icon: "fas fa-bullhorn"
    },
    {
        id: 9,
        role: "Full Stack Developer Intern",
        company: "Zoho",
        location: "Chennai",
        stipend: 25000,
        duration: "6 Months",
        type: "On-site",
        icon: "fas fa-code"
    },
    {
        id: 10,
        role: "Product Management Intern",
        company: "Google",
        location: "Remote",
        stipend: 50000,
        duration: "3 Months",
        type: "Remote",
        icon: "fas fa-tasks"
    },
    {
        id: 11,
        role: "DevOps Intern",
        company: "Microsoft",
        location: "Hyderabad",
        stipend: 30000,
        duration: "4 Months",
        type: "Hybrid",
        icon: "fas fa-cogs"
    },
    {
        id: 12,
        role: "Content Writing Intern",
        company: "Tata Consultancy Services",
        location: "Mumbai",
        stipend: 8000,
        duration: "2 Months",
        type: "Remote",
        icon: "fas fa-pen-fancy"
    }
];

// ── DOM ELEMENTS ──
const listingsGrid = document.getElementById('listingsGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const locationFilter = document.getElementById('locationFilter');
const stipendFilter = document.getElementById('stipendFilter');
const stipendValue = document.getElementById('stipendValue');
const resultsCount = document.getElementById('resultsCount');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const antigravityBtn = document.getElementById('antigravityBtn');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const applicationModal = document.getElementById('applicationModal');
const modalClose = document.getElementById('modalClose');
const applicationForm = document.getElementById('applicationForm');
const modalRole = document.getElementById('modalRole');
const modalSuccess = document.getElementById('modalSuccess');
const fileUploadArea = document.getElementById('fileUploadArea');
const applicantResume = document.getElementById('applicantResume');
const fileName = document.getElementById('fileName');

let selectedWorkType = '';
let isAntigravityActive = false;

// ============================================
// RENDER INTERNSHIP CARDS
// ============================================
function renderCards(data) {
    listingsGrid.innerHTML = '';

    if (data.length === 0) {
        noResults.style.display = 'block';
        resultsCount.textContent = '';
        return;
    }

    noResults.style.display = 'none';
    resultsCount.textContent = `Showing ${data.length} internship${data.length !== 1 ? 's' : ''}`;

    data.forEach((item, index) => {
        // Determine badge class
        let badgeClass = 'badge-onsite';
        if (item.type === 'Remote') badgeClass = 'badge-remote';
        else if (item.type === 'Hybrid') badgeClass = 'badge-hybrid';

        const card = document.createElement('div');
        card.className = 'listing-card';
        card.style.animationDelay = `${index * 0.08}s`;
        card.innerHTML = `
            <div class="card-header">
                <div class="company-logo-placeholder">
                    <i class="${item.icon}"></i>
                </div>
                <span class="card-badge ${badgeClass}">${item.type}</span>
            </div>
            <h3 class="card-role">${item.role}</h3>
            <p class="card-company">${item.company}</p>
            <div class="card-details">
                <span class="card-detail">
                    <i class="fas fa-map-marker-alt"></i> ${item.location}
                </span>
                <span class="card-detail">
                    <i class="fas fa-clock"></i> ${item.duration}
                </span>
            </div>
            <div class="card-footer">
                <span class="card-stipend">₹${item.stipend.toLocaleString('en-IN')}/mo</span>
                <button class="btn-apply" onclick="openModal('${item.role}', '${item.company}')">
                    Apply Now <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;

        listingsGrid.appendChild(card);
    });
}

// ============================================
// FILTER LOGIC
// ============================================
function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const location = locationFilter.value;
    const minStipend = parseInt(stipendFilter.value);
    const workType = selectedWorkType;

    const filtered = internships.filter(item => {
        // Keyword match (role or company)
        const matchesKeyword = !keyword ||
            item.role.toLowerCase().includes(keyword) ||
            item.company.toLowerCase().includes(keyword);

        // Location match
        const matchesLocation = !location || item.location === location;

        // Stipend match
        const matchesStipend = item.stipend >= minStipend;

        // Work type match
        const matchesType = !workType || item.type === workType;

        return matchesKeyword && matchesLocation && matchesStipend && matchesType;
    });

    renderCards(filtered);
}

// Stipend slider live update
stipendFilter.addEventListener('input', () => {
    stipendValue.textContent = `₹${parseInt(stipendFilter.value).toLocaleString('en-IN')}`;
});

// Apply filters button
applyFiltersBtn.addEventListener('click', applyFilters);

// Real-time search on typing
searchInput.addEventListener('input', applyFilters);

// Location change
locationFilter.addEventListener('change', applyFilters);

// Stipend change
stipendFilter.addEventListener('change', applyFilters);

// Work type buttons
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedWorkType = btn.dataset.type;
        applyFilters();
    });
});

// ============================================
// ANTIGRAVITY MODE
// ============================================
function toggleAntigravity() {
    isAntigravityActive = !isAntigravityActive;
    document.body.classList.toggle('antigravity-active', isAntigravityActive);
    antigravityBtn.classList.toggle('active', isAntigravityActive);

    // Show notification
    showAntigravNotification(
        isAntigravityActive ? '🚀 Antigravity Activated!' : '⬇️ Antigravity Deactivated'
    );

    // Enable/disable drag for cards
    const cards = document.querySelectorAll('.listing-card');
    cards.forEach(card => {
        if (isAntigravityActive) {
            makeDraggable(card);
        } else {
            removeDraggable(card);
            card.style.transform = '';
            card.style.left = '';
            card.style.top = '';
            card.style.position = '';
            card.style.zIndex = '';
        }
    });
}

antigravityBtn.addEventListener('click', toggleAntigravity);

// Antigravity notification
function showAntigravNotification(message) {
    // Remove old notification
    const old = document.querySelector('.antigrav-notification');
    if (old) old.remove();

    const notif = document.createElement('div');
    notif.className = 'antigrav-notification';
    notif.innerHTML = `<i class="fas fa-atom"></i> ${message}`;
    document.body.appendChild(notif);

    requestAnimationFrame(() => {
        notif.classList.add('show');
    });

    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 600);
    }, 2500);
}

// ============================================
// DRAGGABLE CARDS (Antigravity Feature)
// ============================================
function makeDraggable(el) {
    el.style.cursor = 'grab';
    el.setAttribute('data-draggable', 'true');

    let isDragging = false;
    let startX, startY, origX, origY;

    function onMouseDown(e) {
        if (!el.getAttribute('data-draggable')) return;
        isDragging = true;
        el.style.cursor = 'grabbing';
        el.style.zIndex = '100';
        el.style.transition = 'none';

        const rect = el.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
        startX = e.clientX || e.touches?.[0]?.clientX;
        startY = e.clientY || e.touches?.[0]?.clientY;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.02}deg)`;
    }

    function onMouseUp() {
        isDragging = false;
        el.style.cursor = 'grab';
        el.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        el.style.transform = '';
        el.style.zIndex = '';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
    }

    el._dragHandler = onMouseDown;
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('touchstart', onMouseDown, { passive: true });
}

function removeDraggable(el) {
    el.style.cursor = '';
    el.removeAttribute('data-draggable');
    if (el._dragHandler) {
        el.removeEventListener('mousedown', el._dragHandler);
        el.removeEventListener('touchstart', el._dragHandler);
        delete el._dragHandler;
    }
}

// ============================================
// APPLICATION MODAL
// ============================================
function openModal(role, company) {
    modalRole.textContent = `${role} at ${company}`;
    applicationModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset form
    applicationForm.reset();
    applicationForm.style.display = 'block';
    modalSuccess.style.display = 'none';
    fileName.textContent = '';
    clearErrors();
}

function closeModal() {
    applicationModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

applicationModal.addEventListener('click', (e) => {
    if (e.target === applicationModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// File upload interaction
fileUploadArea.addEventListener('click', () => {
    applicantResume.click();
});

applicantResume.addEventListener('change', () => {
    if (applicantResume.files.length > 0) {
        fileName.textContent = `📄 ${applicantResume.files[0].name}`;
    }
});

// Drag & drop visual feedback
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'var(--accent)';
    fileUploadArea.style.background = 'rgba(0, 229, 255, 0.05)';
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.style.borderColor = '';
    fileUploadArea.style.background = '';
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '';
    fileUploadArea.style.background = '';
    if (e.dataTransfer.files.length > 0) {
        fileName.textContent = `📄 ${e.dataTransfer.files[0].name}`;
    }
});

// ============================================
// FORM VALIDATION
// ============================================
function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
        el.classList.remove('error');
    });
}

applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let isValid = true;

    const name = document.getElementById('applicantName');
    const email = document.getElementById('applicantEmail');
    const message = document.getElementById('coverMessage');

    // Name validation
    if (!name.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        name.classList.add('error');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters.';
        name.classList.add('error');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        document.getElementById('emailError').textContent = 'Please enter your email address.';
        email.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        email.classList.add('error');
        isValid = false;
    }

    // Cover message validation
    if (!message.value.trim()) {
        document.getElementById('messageError').textContent = 'Please write a cover message.';
        message.classList.add('error');
        isValid = false;
    } else if (message.value.trim().length < 20) {
        document.getElementById('messageError').textContent = 'Cover message should be at least 20 characters.';
        message.classList.add('error');
        isValid = false;
    }

    if (isValid) {
        // Show success
        applicationForm.style.display = 'none';
        modalSuccess.style.display = 'block';
    }
});

// ============================================
// NAVIGATION
// ============================================

// Mobile hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll to section
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// HERO PARTICLES (Background animation)
// ============================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = [
        'rgba(0, 229, 255, 0.3)',
        'rgba(124, 77, 255, 0.3)',
        'rgba(255, 45, 117, 0.2)',
        'rgba(0, 230, 118, 0.2)'
    ];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        container.appendChild(particle);
    }

    // Inject particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.4;
            }
            25% {
                transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 80 + 20}px, -${Math.random() * 60 + 20}px) scale(1.5);
                opacity: 0.7;
            }
            50% {
                transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 40 + 10}px, ${Math.random() * 40 + 10}px) scale(0.8);
                opacity: 0.3;
            }
            75% {
                transform: translate(-${Math.random() * 60 + 20}px, -${Math.random() * 30 + 10}px) scale(1.2);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// COUNTER ANIMATION (Hero Stats)
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeOut = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.floor(easeOut * target);

            counter.textContent = currentValue.toLocaleString('en-IN');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ============================================
// SCROLL REVEAL ANIMATION (CSS-only supported)
// ============================================
function setupScrollReveal() {
    const items = document.querySelectorAll('.animate-in');

    // Use IntersectionObserver for performant scroll triggers
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    items.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Render all cards initially
    renderCards(internships);

    // Start hero particles
    createParticles();

    // Counter animation
    animateCounters();

    // Scroll reveal
    setupScrollReveal();

    // Debug info
    console.log('%c🚀 InternHunt Loaded', 'color: #00e5ff; font-size: 16px; font-weight: bold;');
    console.log('%cActivate Antigravity Mode for a wild ride!', 'color: #7c4dff; font-size: 12px;');
});
