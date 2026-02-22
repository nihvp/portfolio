// ==========================================
// 1. Throttled Humidifying (Glow) Hover Effect 
// ==========================================
const humidifyElements = document.querySelectorAll('.humidify, .glass-nav');

humidifyElements.forEach(element => {
    let ticking = false; 
    
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
// 3. Smart Modal Popup Logic
// ==========================================
const modal = document.getElementById('detail-modal');
const closeBtn = document.querySelector('.close-btn');
const modalGallery = document.getElementById('modal-gallery');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalKeyword = document.getElementById('modal-keyword');
const modalLink = document.getElementById('modal-link');

interactiveCards.forEach(card => {
    card.addEventListener('click', () => {
        // 1. Smart Inheritance
        const cardTitle = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Project';
        const cardDesc = card.querySelector('.card-info p') ? card.querySelector('.card-info p').innerText : '';
        
        modalTitle.innerText = card.getAttribute('data-title') || cardTitle;
        const rawDesc = card.getAttribute('data-desc') || cardDesc;

        // Check if the description contains our separator '|'
        if (rawDesc.includes('|')) {
            // Split the text at the '|', remove extra spaces, and wrap in <li> tags
            const listItems = rawDesc.split('|').map(point => `<li>${point.trim()}</li>`).join('');
            // Render as an HTML unordered list
            modalDesc.innerHTML = `<ul class="modal-desc-list">${listItems}</ul>`;
        } else {
            // Fallback for regular text paragraphs
            modalDesc.innerText = rawDesc;
        }
        
        // 2. Multi-Image Gallery Logic
        if (modalGallery) {
            modalGallery.innerHTML = ''; 
            let imgs = [];
            
            const dataImgs = card.getAttribute('data-imgs'); 
            const dataImg = card.getAttribute('data-img');   
            const thumbnail = card.querySelector('.card-img') ? card.querySelector('.card-img').src : ''; 

            if (dataImgs) {
                imgs = dataImgs.split(',').map(img => img.trim());
            } else if (dataImg) {
                imgs = [dataImg];
            } else if (thumbnail) {
                imgs = [thumbnail];
            }

            imgs.forEach(imgSrc => {
                const imgEl = document.createElement('img');
                imgEl.src = imgSrc;
                imgEl.loading = 'lazy';
                modalGallery.appendChild(imgEl);
            });
        }

        // 3. Link & Keywords
        const linkUrl = card.getAttribute('data-link');
        if (linkUrl) {
            modalLink.href = linkUrl;
            modalLink.style.display = 'inline-block';
        } else {
            modalLink.style.display = 'none'; 
        }
        
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
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    }
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});

// ==========================================
// 4. Scroll Active Menu Tracker (Fixed for tall sections)
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.glass-nav a');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Triggers when the section crosses the upper third of the screen
    threshold: 0 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === entry.target.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));