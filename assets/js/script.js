document.addEventListener('DOMContentLoaded', async () => {
    // ── Supabase Auth ──────────────────────────────────────────────────────
    const SUPABASE_URL = 'https://ihgyzkjaxdjscugzcpfe.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3l6a2pheGRqc2N1Z3pjcGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTkzMDcsImV4cCI6MjA5NjI5NTMwN30.QxFZjQ2s1DGtwrUhA0vCzSN6zuqk35DSIiUyYIQS4dE';
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── Sign Out Handler ───────────────────────────────────────────────────
    async function signOut(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await supabaseClient.auth.signOut();
        } catch (err) {
            console.warn('signOut error:', err);
        }
        localStorage.removeItem('isLoggedIn');
        window.location.replace('login.html');
    }

    // ── Wire logout links immediately (before async session check) ─────────
    // This ensures clicking Logout works even before updateAuthNav finishes
    const navLink    = document.getElementById('auth-nav-link');
    const mobileLink = document.getElementById('auth-mobile-link');

    if (navLink)    navLink.addEventListener('click',    signOut);
    if (mobileLink) mobileLink.addEventListener('click', signOut);

    // ── Update nav link: Login ↔ Logout based on live session ──────────────
    async function updateAuthNav() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const nl = document.getElementById('auth-nav-link');
        const ml = document.getElementById('auth-mobile-link');
        if (session && session.user) {
            if (nl) { nl.textContent = 'Logout'; nl.href = '#'; }
            if (ml) { ml.textContent = 'Logout'; ml.href = '#'; }
        } else {
            // Not logged in — remove signOut and point to login page
            if (nl) { nl.textContent = 'Login'; nl.href = 'login.html'; nl.removeEventListener('click', signOut); }
            if (ml) { ml.textContent = 'Login'; ml.href = 'login.html'; ml.removeEventListener('click', signOut); }
        }
    }

    // Listen for auth changes (login/logout anywhere)
    supabaseClient.auth.onAuthStateChange(() => updateAuthNav());
    updateAuthNav();


    // GSAP Plugins registration
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor tracking
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .tab, .swiper-pagination-bullet, .menu-btn, .info-icon, .social-link, .faq-question');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                customCursor.style.background = 'transparent';
                customCursor.style.border = '2px solid var(--primary-yellow)';
            });
            el.addEventListener('mouseleave', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
                customCursor.style.background = 'var(--primary-yellow)';
                customCursor.style.border = 'none';
            });
        });
    }

    // Initialize Swiper
    const swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: true,
        speed: 1000,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + ('0' + (index + 1)).slice(-2) + '</span>';
            },
        },
    });

    // Header interaction on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // GSAP Entry Animations for Hero
    const tl = gsap.timeline();
    tl.from('.logo', { y: -50, opacity: 0, duration: 1, ease: 'power4.out', immediateRender: false })
        .from('.nav-links a', { y: -20, opacity: 0, stagger: 0.1, duration: 0.8, immediateRender: false }, '-=0.5')
        .from('.header-actions div', { scale: 0, opacity: 0, stagger: 0.1, duration: 0.5, immediateRender: false }, '-=0.5')
        .from('.vertical-line', { height: 0, duration: 1, immediateRender: false }, '-=1')
        .from('.social-link', { x: -50, opacity: 0, stagger: 0.1, duration: 0.8, immediateRender: false }, '-=0.5')
        .from('.script-text', { y: 100, opacity: 0, duration: 1.2, ease: 'power3.out', immediateRender: false }, '-=1.2')
        .from('.main-title', { scale: 1.2, opacity: 0, duration: 2, ease: 'expo.out', immediateRender: false }, '-=1.2')
        .from('.car-image', { x: 200, opacity: 0, duration: 1.5, ease: 'power2.out', immediateRender: false }, '-=1.5')
        .from('.spec-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, immediateRender: false }, '-=1')
        .from('.btn-discover', { scale: 0.8, opacity: 0, duration: 1, immediateRender: false }, '-=0.8');

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    let menuOpen = false;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                mobileMenu.classList.add('active');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                gsap.fromTo('.mobile-nav-links a', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 });
            } else {
                mobileMenu.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Ensure cars are centered if GSAP transform overrides CSS
    gsap.set('.car-image', { xPercent: -50, left: '50%', x: 0 });

    // Enhanced Slide change sync with Letter Stagger and Breathing
    swiper.on('slideChange', function () {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const prevSlide = swiper.slides[swiper.previousIndex];

        // Reset previous slide elements
        gsap.set(prevSlide.querySelectorAll('.main-title span, .car-image, .spec-item'), { clearProps: "all" });

        // Animate active slide
        const titleSpans = activeSlide.querySelectorAll('.main-title span');
        const carImg = activeSlide.querySelector('.car-image');
        const specItems = activeSlide.querySelectorAll('.spec-item');

        // Kill any existing animations on these elements
        gsap.killTweensOf([titleSpans, carImg, specItems]);

        // Cinematic Title Reveal
        gsap.fromTo(titleSpans,
            { y: '100%', opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.05,
                ease: 'expo.out',
                overwrite: true
            }
        );

        // Elegant Car Entrance
        if (swiper.activeIndex === 1) {
            gsap.set(carImg, { xPercent: -50, x: 0, opacity: 1, scale: 1 });
            gsap.to(activeSlide.querySelector('.car-image img'), {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        } else {
            gsap.fromTo(carImg,
                { x: 300, xPercent: -50, opacity: 0, scale: 0.95 },
                {
                    x: 0,
                    xPercent: -50,
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'power4.out',
                    overwrite: true,
                    onComplete: () => {
                        gsap.to(activeSlide.querySelector('.car-image img'), {
                            y: -10,
                            duration: 3,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                }
            );
        }

        // Specs Reveal
        gsap.from(activeSlide.querySelectorAll('.spec-item'), {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            delay: 0.8
        });
    });

    // Initial load animation for first slide
    gsap.fromTo(document.querySelectorAll('.swiper-slide-active .main-title span'), {
        y: '100%',
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.05,
        ease: 'expo.out',
        delay: 0.5
    });

    gsap.fromTo(document.querySelector('.swiper-slide-active .car-image'),
        { x: 300, xPercent: -50, opacity: 0, scale: 0.9 },
        {
            x: 0,
            xPercent: -50,
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: 'power3.out',
            delay: 0.2
        }
    );

    // Scroll Animations for Landing Page Sections
    gsap.utils.toArray('section').forEach((section, i) => {
        if (section.id === 'home' || section.id === 'services') return;

        const animElements = section.querySelectorAll('.section-title, .section-desc, .service-card, .fleet-card, .feature-item, .step, .area-card, .testimonial-card, .faq-item');
        
        if (animElements.length > 0) {
            gsap.from(animElements, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                immediateRender: false,
                clearProps: "all"
            });
        }
    });

    // Pricing Tabs functionality
    const tabs = document.querySelectorAll('.pricing-toggle .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Gallery Page Specific Animations
    if (document.querySelector('.gallery-hero')) {
        // Hero Text Entry
        gsap.from('.gallery-hero .script-text', {
            y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2
        });
        gsap.from('.gallery-hero h1', {
            y: 40, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.4
        });
        gsap.from('.gallery-hero p', {
            y: 20, opacity: 0, duration: 1, ease: 'power2.out', delay: 0.6
        });

        // Section Headers (Normal & Luxury)
        gsap.utils.toArray('.normal-cars, .luxury-cars').forEach(section => {
            const header = section.querySelectorAll('.section-title, .section-desc');
            gsap.from(header, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out'
            });

            // Car Cards Stagger Reveal
            const cards = section.querySelectorAll('.gallery-card, .luxury-card');
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                scale: 0.9,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: 'power4.out',
                clearProps: "all"
            });
        });
    }

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Exclude bookingForm and quickBookForm from generic submission handling
            if (form.id === 'bookingForm' || form.id === 'quickBookForm') return;

            e.preventDefault();
            // Show success message
            alert('Thank you for your interest! We will contact you shortly.');
            form.reset();
        });
    });

    // Quick Book Form Handling
    const quickBookForm = document.getElementById('quickBookForm');
    if (quickBookForm) {
        quickBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Redirect the user to the bookings page to complete it
            // Option to pass params like `?type=${pickup}` can be done here in the future
            window.location.href = 'bookings.html';
        });
    }
});