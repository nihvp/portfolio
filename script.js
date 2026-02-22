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
// 3. Smart Modal Popup & HTML Injection Logic
// ==========================================
const modal = document.getElementById('detail-modal');
const closeBtn = document.querySelector('.close-btn');
const modalGallery = document.getElementById('modal-gallery');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalKeyword = document.getElementById('modal-keyword');
const modalLink = document.getElementById('modal-link');

// Gallery Navigation
const prevBtn = document.getElementById('gallery-prev');
const nextBtn = document.getElementById('gallery-next');

interactiveCards.forEach(card => {
    card.addEventListener('click', () => {
        // 1. Inject HTML Content
        const cardTitle = card.querySelector('.card-title') ? card.querySelector('.card-title').innerText : 'Project Details';
        const hiddenHtml = card.querySelector('.modal-hidden-content') ? card.querySelector('.modal-hidden-content').innerHTML : '';
        
        modalTitle.innerText = cardTitle;
        modalDesc.innerHTML = hiddenHtml; // Allows <br>, FontAwesome icons, and custom styling
        
        // 2. Multi-Image Gallery Logic
        if (modalGallery) {
            modalGallery.innerHTML = ''; 
            let imgs = [];
            
            const dataImgs = card.getAttribute('data-imgs');   
            const thumbnail = card.querySelector('.card-img') ? card.querySelector('.card-img').src : ''; 

            if (dataImgs) {
                imgs = dataImgs.split(',').map(img => img.trim());
            } else if (thumbnail) {
                imgs = [thumbnail];
            }

            imgs.forEach(imgSrc => {
                const imgEl = document.createElement('img');
                imgEl.src = imgSrc;
                imgEl.loading = 'lazy';
                modalGallery.appendChild(imgEl);
            });

            // Toggle Gallery Arrows based on image count
            if (imgs.length > 1) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
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

// Arrow Scrolling Logic
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        modalGallery.scrollBy({ left: -modalGallery.clientWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        modalGallery.scrollBy({ left: modalGallery.clientWidth, behavior: 'smooth' });
    });
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
        
        // Optimizes loading & prevents image ghosting by clearing content after fade out
        setTimeout(() => {
            modalGallery.innerHTML = '';
            modalDesc.innerHTML = '';
        }, 300); 
    }
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});

// ==========================================
// 4. Scroll Active Menu Tracker
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.glass-nav a');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', 
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

/*
// ==========================================
// 5. Interactive Hero Spotlight (Mix-Blend-Mode Reveal)
// ==========================================
const heroSection = document.querySelector('.hero-section');
const heroSpotlight = document.querySelector('.hero-spotlight');

if (heroSection && heroSpotlight) {
    let spotlightTicking = false;

    heroSection.addEventListener('mousemove', (e) => {
        if (!spotlightTicking) {
            requestAnimationFrame(() => {
                // Get mouse position relative to the hero section
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Pass coordinates to CSS variables
                heroSpotlight.style.setProperty('--mouse-x', `${x}px`);
                heroSpotlight.style.setProperty('--mouse-y', `${y}px`);
                
                spotlightTicking = false;
            });
            spotlightTicking = true;
        }
    });
}
*/

// ==========================================
// 5. Global Interactive Spotlight 
// ==========================================
const globalSpotlight = document.querySelector('.global-spotlight');

if (globalSpotlight) {
    let spotlightTicking = false;

    // We listen to the whole window now, not just the hero section
    window.addEventListener('mousemove', (e) => {
        if (!spotlightTicking) {
            requestAnimationFrame(() => {
                // Pass raw screen coordinates directly to the CSS gradient
                globalSpotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
                globalSpotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
                
                spotlightTicking = false;
            });
            spotlightTicking = true;
        }
    });
}