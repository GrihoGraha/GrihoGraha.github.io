document.addEventListener('DOMContentLoaded', function() {
    // AOS Initialization
    AOS.init({
        duration: 800,
        once: true,
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navLinksContainer = document.getElementById('nav-links-mobile');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Sticky Header on Scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Current Year for Footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const allNavAnchors = document.querySelectorAll('header nav a');

    function updateActiveLink() {
        let currentSectionId = 'home';
        const headerHeight = header ? header.offsetHeight : 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - headerHeight - 100)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavAnchors.forEach(a => {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
            if (a.getAttribute('href').substring(1) === currentSectionId) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call

    // Dynamic Number Counter
    const statsCounters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        
        const updateCount = () => {
            const increment = target / speed;
            count += increment;

            if (count < target) {
                counter.innerText = Math.ceil(count) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + suffix;
            }
        };
        updateCount();
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1 });

    statsCounters.forEach(counter => {
        statObserver.observe(counter);
    });

    // GLightbox Initialization
    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });
    } else {
        console.warn('GLightbox not found. Lightbox functionality will be disabled.');
    }

    // Go-to-Top Button
    const goToTopButton = document.getElementById('goToTopBtn');
    if (goToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                goToTopButton.classList.add('show');
            } else {
                goToTopButton.classList.remove('show');
            }
        });
        goToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact Form to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('formName').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;
            const whatsAppNumber = "917003941632";

            let prefilledMessage = `Hello Grihograha,\n\n`;
            if (name) prefilledMessage += `My name is: ${name}\n`;
            if (subject) prefilledMessage += `Subject: ${subject}\n`;
            prefilledMessage += `\nMessage:\n${message}`;

            const encodedMessage = encodeURIComponent(prefilledMessage);
            const whatsappURL = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank');
        });
    }
});