/**
 * MINDFULHEART Premium Landing Page Interactions
 * Handles Scroll Reveals, Navbar State, Progress Bars, and Canvas Particles.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. NAVBAR SCROLL EFFECT --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. MOBILE MENU TOGGLE --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- 3. INTERSECTION OBSERVERS (Scroll Reveal) --- */
    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
    );

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);

                // Trigger Progress Bars when Results section starts showing
                if (entry.target.classList.contains('results-content')) {
                    const bars = entry.target.querySelectorAll('.progress-fill');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 500);
                    });
                }
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Explicitly observe the results box to animate progress bars
    const resultsBox = document.querySelector('.results-box');
    if (resultsBox) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.progress-fill');
                    bars.forEach((bar, index) => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width;
                        }, index * 200 + 300); // Stagger animation
                    });
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        progressObserver.observe(resultsBox);
    }

    /* --- 4. CANVAS PARTICLE NETWORK (Neural Synapses) --- */
    function initParticles(canvasId, particleColor, lineColor, particleCountModifier = 1) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Mouse interaction
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Resize handler
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > width || this.x < 0) this.speedX *= -1;
                if (this.y > height || this.y < 0) this.speedY *= -1;

                // Mouse interaction - subtle repulse
                if (mouse.x != null && mouse.y != null) {
                    // Check if mouse is over canvas area
                    const rect = canvas.getBoundingClientRect();
                    const relativeMouseX = mouse.x - rect.left;
                    const relativeMouseY = mouse.y - rect.top;

                    if (relativeMouseX >= 0 && relativeMouseX <= width &&
                        relativeMouseY >= 0 && relativeMouseY <= height) {

                        let dx = relativeMouseX - this.x;
                        let dy = relativeMouseY - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouse.radius) {
                            const forceDirectionX = dx / distance;
                            const forceDirectionY = dy / distance;
                            const force = (mouse.radius - distance) / mouse.radius;
                            // Push gently
                            this.x -= forceDirectionX * force * 1.5;
                            this.y -= forceDirectionY * force * 1.5;
                        }
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function buildParticles() {
            particles = [];
            // Calculate number of particles based on screen area to keep density consistent
            const baseArea = 1920 * 1080;
            const currentArea = width * height;
            const numberOfParticles = Math.floor((currentArea / baseArea) * 100 * particleCountModifier);

            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            let opacityValue = 1;
            // O(n^2) connection logic, keep particle count reasonable
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        opacityValue = 1 - (distance / 120);
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor.replace('O', opacityValue.toFixed(2));
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
        }

        window.addEventListener('resize', () => {
            resize();
            buildParticles();
        });

        // Init
        resize();
        buildParticles();
        animate();
    }

    // Initialize Hero Particles (green/gold subtle)
    initParticles('hero-particles', 'rgba(26, 90, 70, 0.4)', 'rgba(26, 90, 70, O)', 1.2);

    // Initialize CTA Particles (light white/gold for contrast on dark bg)
    initParticles('cta-particles', 'rgba(212, 175, 55, 0.3)', 'rgba(255, 255, 255, O)', 0.8);

});
