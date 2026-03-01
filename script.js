// ========== CANVAS PLANET ANIMATION ==========
class DigitalPlanet {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.isMobile = this.checkMobileDevice();
        
        this.setupCanvas();
        this.addEventListeners();
        this.animate();
    }

    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768 ||
               (window.matchMedia("(pointer:coarse)").matches);
    }

    setupCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.radius = Math.min(width, height) / (this.isMobile ? 4 : 3);
        this.rotation = 0;
        this.mouseX = width / 2;
        this.mouseY = height / 2;
        this.targetMouseX = width / 2;
        this.targetMouseY = height / 2;
    }

    addEventListeners() {
        const handleMouseMove = (e) => {
            this.targetMouseX = e.clientX || e.touches[0].clientX;
            this.targetMouseY = e.clientY || e.touches[0].clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('touchmove', handleMouseMove, { passive: true });

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.isMobile = this.checkMobileDevice();
        }, { passive: true });

        document.addEventListener('orientationchange', () => {
            setTimeout(() => this.setupCanvas(), 100);
        }, { passive: true });
    }

    smoothMouse() {
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
    }

    drawPlanet() {
        const planetGradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.radius
        );
        
        planetGradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        planetGradient.addColorStop(0.5, 'rgba(10, 255, 123, 0.1)');
        planetGradient.addColorStop(1, 'rgba(255, 0, 109, 0.15)');
        
        this.ctx.fillStyle = planetGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawRotatingRings() {
        const rings = [
            { radius: this.radius * 0.6, angle: this.rotation },
            { radius: this.radius * 0.8, angle: -this.rotation * 0.7 },
            { radius: this.radius * 1.1, angle: this.rotation * 0.5 }
        ];

        rings.forEach((ring) => {
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 + Math.sin(this.rotation) * 0.1})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            const step = this.isMobile ? 5 : 3;
            for (let i = 0; i < ring.radius; i += step) {
                const angle = ring.angle + (i / ring.radius) * Math.PI * 2;
                const x = this.centerX + Math.cos(angle) * i;
                const y = this.centerY + Math.sin(angle) * i;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        });
    }

    drawOrbitingParticles() {
        const particles = this.isMobile ? 5 : 8;
        const distance = this.radius * 1.3;

        for (let i = 0; i < particles; i++) {
            const angle = (this.rotation + (i / particles) * Math.PI * 2);
            const x = this.centerX + Math.cos(angle) * distance;
            const y = this.centerY + Math.sin(angle) * distance;
            
            const particleSize = 2 + Math.sin(this.rotation + i) * 1;
            
            this.ctx.fillStyle = `rgba(0, 240, 255, ${0.6 + Math.sin(this.rotation + i) * 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + Math.sin(this.rotation + i) * 0.2})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, particleSize * 3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawConnectingLines() {
        const lines = this.isMobile ? 2 : 4;
        const distance = this.radius * 1.3;

        for (let line = 0; line < lines; line++) {
            const offset = (line / lines) * Math.PI * 2;
            const angle1 = this.rotation + offset;
            const angle2 = this.rotation + offset + (Math.PI / 2);
            
            const x1 = this.centerX + Math.cos(angle1) * distance;
            const y1 = this.centerY + Math.sin(angle1) * distance;
            const x2 = this.centerX + Math.cos(angle2) * distance;
            const y2 = this.centerY + Math.sin(angle2) * distance;
            
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 + Math.sin(this.rotation + line) * 0.1})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    drawDustParticles() {
        const particleCount = this.isMobile ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const seed = i * 12.9898;
            const randomX = Math.sin(seed + this.rotation * 0.1) * window.innerWidth;
            const randomY = Math.cos(seed * 78.233 + this.rotation * 0.08) * window.innerHeight;
            const size = Math.sin(seed * 43.614) * 1.5 + 0.5;
            
            this.ctx.fillStyle = `rgba(0, 240, 255, ${Math.sin(seed + this.rotation * 0.05) * 0.2 + 0.1})`;
            this.ctx.beginPath();
            this.ctx.arc(randomX, randomY, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    update() {
        this.smoothMouse();
        this.rotation += 0.003;
    }

    draw() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.drawDustParticles();
        this.drawRotatingRings();
        this.drawPlanet();
        this.drawOrbitingParticles();
        this.drawConnectingLines();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ========== SCROLL ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.observerOptions = {
            threshold: this.isMobile ? [0.15] : [0.1, 0.5],
            rootMargin: this.isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
        
        this.setupObserver();
        this.setupSmoothScroll();
        
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        }, { passive: true });
    }

    setupObserver() {
        const elements = document.querySelectorAll('.section, .stat-box, .skill-badge, .contact-card, .timeline-item');
        elements.forEach(element => {
            if (!element.hasAttribute('data-observed')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.setAttribute('data-observed', 'true');
                this.observer.observe(element);
            }
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ========== INTERACTIVE ELEMENTS ==========
class InteractiveElements {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.setupButtonHovers();
        this.setupSkillInteractions();
        this.setupParallaxEffect();
        
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        }, { passive: true });
    }

    setupButtonHovers() {
        document.querySelectorAll('.btn, .skill-badge, .contact-card').forEach(element => {
            if (!this.isMobile) {
                element.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                });

                element.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            }
        });
    }

    setupSkillInteractions() {
        document.querySelectorAll('.skill-badge').forEach(badge => {
            badge.addEventListener('click', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'skillPop 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            });
        });

        if (!document.querySelector('#skill-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'skill-animation-styles';
            style.textContent = `
                @keyframes skillPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupParallaxEffect() {
        if (this.isMobile) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    document.querySelectorAll('.section').forEach((section, index) => {
                        if (index % 2 === 0) {
                            section.style.transform = `translateY(${scrollY * 0.05}px)`;
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ========== PERFORMANCE OPTIMIZATION ==========
class PerformanceOptimizer {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.setupLazyLoading();
        this.setupReducedMotion();
        this.optimizeForMobile();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            img.removeAttribute('loading');
                            imageObserver.unobserve(img);
                        }
                    });
                },
                { rootMargin: '50px' }
            );
            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--transition', 'all 0.1s ease');
        }

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--transition', 'all 0.1s ease');
            }
        }, { passive: true });
    }

    optimizeForMobile() {
        if (this.isMobile) {
            document.body.classList.add('mobile-optimized');
            
            // Reduzir frequência de algumas animações
            const style = document.createElement('style');
            style.textContent = `
                .mobile-optimized .stars-bg {
                    animation: twinkle 8s ease-in-out infinite;
                }
                
                .mobile-optimized [style*="animation"] {
                    animation-duration: 1.5s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Canvas
        const canvas = document.getElementById('bgCanvas');
        if (canvas && 'getContext' in canvas) {
            new DigitalPlanet(canvas);
        }

        // Scroll Animations
        new ScrollAnimations();

        // Interactive Elements
        new InteractiveElements();

        // Performance
        new PerformanceOptimizer();

        console.log('✨ 100% Responsivo - Portfolio Inicializado com Sucesso!');
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});

// ========== ADDITIONAL UTILITIES ==========
const addAnimationClass = (element, animationName) => {
    if (!element) return;
    element.classList.add(animationName);
    element.addEventListener('animationend', () => {
        element.classList.remove(animationName);
    }, { once: true });
};

window.addEventListener('error', (event) => {
    console.error('Erro Global:', event.error);
}, { passive: true });

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
}, { passive: true });
