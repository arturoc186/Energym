/* ============================================
   EnerGym — Presentation Controller
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ---- Slide Nav Dots: active state ----
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-nav a');

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                dots.forEach(d => d.classList.remove('active'));
                const activeDot = document.querySelector(`.slide-nav a[href="#${id}"]`);
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, { threshold: 0.5 });

    slides.forEach(s => slideObserver.observe(s));

    // ---- Keyboard Navigation (Arrow Keys) ----
    let currentSlide = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            currentSlide = Math.min(currentSlide + 1, slides.length - 1);
            slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            currentSlide = Math.max(currentSlide - 1, 0);
            slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Keep currentSlide index in sync with scroll
    const indexObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSlide = Array.from(slides).indexOf(entry.target);
            }
        });
    }, { threshold: 0.5 });
    slides.forEach(s => indexObserver.observe(s));

    // ---- Scroll Reveal ----
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // ---- Animated Counters ----
    const counters = document.querySelectorAll('[data-counter]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.counter);
                const suffix = el.dataset.suffix || '';
                const prefix = el.dataset.prefix || '';
                const dec = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
                const sep = el.dataset.separator === 'true';
                const dur = 2000;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    let val = (ease * target).toFixed(dec);
                    if (sep) val = Number(val).toLocaleString('es-ES');
                    el.textContent = prefix + val + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    // ---- Finance Bars ----
    const bars = document.querySelectorAll('.fin-bar-fill');
    const barObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                barObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    bars.forEach(b => barObs.observe(b));

    // ---- Smooth anchor clicks ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
