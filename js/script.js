document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. 3D CARD TILT EFFECT (3D माउस रोटेशन इफेक्ट)
       =================================================== */
    const tiltCard = document.getElementById('tilt-card');
    
    if (tiltCard) {
        tiltCard.parentElement.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // 3D कोण कैलकुलेशन
            const rotateX = (-y / 15).toFixed(2);
            const rotateY = (x / 15).toFixed(2);

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            tiltCard.style.transition = 'transform 0.1s ease-out';
        });

        tiltCard.parentElement.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            tiltCard.style.transition = 'transform 0.5s ease-in-out';
        });
    }

    /* ===================================================
       2. ALL CARDS 3D HOVER EFFECT (सभी कार्ड्स पर 3D रिस्पॉन्स)
       =================================================== */
    const all3DCards = document.querySelectorAll('.card-3d, .showcase-item, .stat-card');
    
    all3DCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / 20).toFixed(2);
            const rotateY = (x / 20).toFixed(2);

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* ===================================================
       3. Dynamic 3D Floating Particles (3D कैनवास एनीमेशन)
       =================================================== */
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);

    // कैनवास स्टाइल (वाइट और लाइट ब्लू बैकग्राउंड के लिए)
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2; // बबल्स का आकार
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.speedY = (Math.random() - 0.5) * 1.2;
            // 3D वाइट और ब्लू शेड्स
            const colors = ['rgba(37, 99, 235, 0.25)', 'rgba(219, 234, 254, 0.6)', 'rgba(147, 197, 253, 0.3)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // 3D सॉफ्ट ग्लो
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(37, 99, 235, 0.3)';
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ===================================================
       4. SMART SCROLL ANIMATION (स्क्रॉल करने पर 3D पॉप)
       =================================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card-3d, .showcase-item, .about-card, .contact-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });
});