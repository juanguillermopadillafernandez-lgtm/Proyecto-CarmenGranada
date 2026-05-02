document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll Reveal Animation ───────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // ─── Animated Counters (Stats section) ─────────────────────────────────
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (!target || el.dataset.counted) return;
                el.dataset.counted = true;

                const duration = 1800;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    // Si el target es el porcentaje (92), añade %
                    el.textContent = Math.floor(current) + (target === 92 ? '%' : '');
                }, 16);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));


    // ─── Dynamic Navbar on Scroll ──────────────────────────────────────────
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }, { passive: true });


    // ─── Smooth Scroll for Nav Links ───────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip modal triggers
            if (['#unirse', '#login'].includes(href)) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });


    // ─── Parallax on Hero ─────────────────────────────────────────────────
    const heroBg = document.querySelector('.hero-bg-image');
    window.addEventListener('scroll', () => {
        if (heroBg && window.scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    }, { passive: true });


    // ─── Hamburger Menu ────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
        mobileMenu?.classList.remove('open');
        if (hamburger) {
            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }

    hamburger?.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.querySelector('i').classList.replace(
            isOpen ? 'fa-bars' : 'fa-times',
            isOpen ? 'fa-times' : 'fa-bars'
        );
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) closeMobileMenu();
    });


    // ─── FAQ Accordion ─────────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            document.querySelectorAll('.faq-question').forEach(other => {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle current
            btn.setAttribute('aria-expanded', !isOpen);
            answer.classList.toggle('open', !isOpen);
        });
    });


    // ─── Modal: Registro ───────────────────────────────────────────────────
    const modal = document.getElementById('modal-registro');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const regForm = document.getElementById('registration-form');

    const openModal = () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        closeMobileMenu();
    };
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeModalBtn?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    regForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = regForm.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Registrando...';
        btn.disabled = true;

        setTimeout(() => {
            closeModal();
            showToast('¡Bienvenido/a a Carmen! Revisa tu correo para confirmar el registro.', 'success');
            btn.textContent = orig;
            btn.disabled = false;
            regForm.reset();
        }, 1500);
    });


    // ─── Modal: Login ──────────────────────────────────────────────────────
    const loginModal = document.getElementById('modal-login');
    const openLoginBtns = document.querySelectorAll('.open-login-modal');
    const closeLoginBtn = document.querySelector('.close-login-modal');
    const loginForm = document.getElementById('login-form');

    const closeLoginModal = () => {
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
    };

    openLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeLoginBtn?.addEventListener('click', closeLoginModal);
    window.addEventListener('click', (e) => { if (e.target === loginModal) closeLoginModal(); });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Entrando...';
        btn.disabled = true;

        setTimeout(() => {
            closeLoginModal();
            showToast('¡Sesión iniciada! Bienvenido/a de vuelta.', 'success');
            btn.textContent = orig;
            btn.disabled = false;
            loginForm.reset();
        }, 1000);
    });


    // ─── Toast Notification ────────────────────────────────────────────────
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('toast-show'));

        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

});
