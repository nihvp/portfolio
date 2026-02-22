// ==========================================
// 1. Throttled Humidifying (Glow) Hover Effect 
// ==========================================
// Optimized to prevent layout thrashing and high CPU usage using requestAnimationFrame
const humidifyElements = document.querySelectorAll('.humidify, .glass-nav');

humidifyElements.forEach(element => {
    let ticking = false; // Flag to prevent rapid-fire calculations
    
    element.addEventListener("mousemove", (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                element.style.setProperty("--mouse-x", `${x}px`);
                element.style.setProperty("--mouse-y", `${y}px`);
                
                ticking = false;
            });
            ticking = true;
        }
    });
});

// ==========================================
// 2. Project Filtering Logic
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const interactiveCards = document.querySelectorAll('.interactive-card');

filterProjects("Codes");

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        filterProjects(category);
    });
});

function filterProjects(category) {
    interactiveCards.forEach(card => {
        if (card.getAttribute('data-type') === 'project') {
            if (category === 'All' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ==========================================
// 3. Modal Popup Logic
// ==========================================
const modal = document.getElementById('detail-modal');
const closeBtn = document.querySelector('.close-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalKeyword = document.getElementById('modal-keyword');
const modalLink = document.getElementById('modal-link');

interactiveCards.forEach(card => {
    card.addEventListener('click', () => {
        modalImg.src = card.getAttribute('data-img');
        modalTitle.innerText = card.getAttribute('data-title');
        modalDesc.innerText = card.getAttribute('data-desc');
        modalLink.href = card.getAttribute('data-link');
        
        const category = card.getAttribute('data-category');
        if (category) {
            modalKeyword.style.display = 'inline-block';
            modalKeyword.innerText = category;
        } else {
            modalKeyword.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Empty string lets the browser revert to default naturally
}

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if(e.target === modal) {
        closeModal();
    }
});

