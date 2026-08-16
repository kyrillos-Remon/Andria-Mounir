// Intro Loader Animation
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        if (intro) {
            intro.classList.add('fade-out');
        }
    }, 2000);
});

// Canvas & Glow Orbs Interactive Mouse Movement
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const glow1 = document.querySelector('.glow-1');
const glow2 = document.querySelector('.glow-2');

let particlesArray = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 170 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (glow1 && glow2) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
        
        glow1.style.transform = `translate(${moveX}px, ${moveY}px)`;
        glow2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
}
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 25) + 1;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            
            this.x -= forceDirectionX * force * this.density;
            this.y -= forceDirectionY * force * this.density;
        } else {
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
        }
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 8000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 242, 254, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { 
        p.draw(); 
        p.update(); 
    });
    connectParticles();
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();

// Mobile Navigation Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinksContainer = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-item');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

// Active Scrollspy Navbar Lighting Effect
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Carousel & Filtering Logic
const portfolioGrid = document.getElementById('portfolioGrid');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentIndex = 0;

function getVisibleItems() {
    return Array.from(document.querySelectorAll('.portfolio-item')).filter(
        item => item.style.display !== 'none'
    );
}

function getItemsPerPage() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
}

function updateSlider() {
    const visibleItems = getVisibleItems();
    const itemsPerPage = getItemsPerPage();
    const maxIndex = Math.max(0, visibleItems.length - itemsPerPage);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    if (visibleItems.length > 0) {
        const itemWidth = visibleItems[0].offsetWidth;
        const gap = 25;
        const amountToTranslate = (itemWidth + gap) * currentIndex;
        portfolioGrid.style.transform = `translateX(-${amountToTranslate}px)`;
    } else {
        portfolioGrid.style.transform = `translateX(0px)`;
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex || visibleItems.length <= itemsPerPage;
}

nextBtn.addEventListener('click', () => {
    const visibleItems = getVisibleItems();
    const itemsPerPage = getItemsPerPage();
    if (currentIndex < visibleItems.length - itemsPerPage) {
        currentIndex++;
        updateSlider();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const category = e.target.getAttribute('data-filter');
        const allItems = document.querySelectorAll('.portfolio-item');

        allItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        currentIndex = 0;
        updateSlider();
    });
});

window.addEventListener('resize', updateSlider);
document.addEventListener('DOMContentLoaded', updateSlider);

// Video Modal Controls
function openVideoModal(videoSrc) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = videoSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Image Modal Controls
function openImageModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const imgTag = document.getElementById('modal-img-src');
    imgTag.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    const imgTag = document.getElementById('modal-img-src');
    imgTag.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Global Keydown Handler for Closing Modals
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeImageModal();
    }
});