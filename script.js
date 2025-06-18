document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * 1. AOS (Animate on Scroll) Initialization
     * Initializes the library for scroll animations.
     */
    AOS.init({
        duration: 800, // Animation duration in milliseconds
        once: true,    // Whether animation should happen only once
    });


    /**
     * 2. Mobile Menu Toggle
     * Handles the opening and closing of the mobile navigation menu.
     */
    const hamburger = document.getElementById('hamburger-menu');
    const navLinksContainer = document.getElementById('nav-links-mobile');

    if (hamburger && navLinksContainer) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            const isOpened = navLinksContainer.classList.contains('active');
            
            icon.classList.toggle('fa-bars', !isOpened);
            icon.classList.toggle('fa-times', isOpened);
            hamburger.setAttribute('aria-expanded', isOpened);
        });

        // Close menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /**
     * 3. Sticky Header
     * Adds a 'scrolled' class to the header when the user scrolls down.
     */
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

    
    /**
     * 4. Dynamic Footer Year
     * Updates the year in the footer to the current year.
     */
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


    /**
     * 5. Active Navigation Link Highlighting on Scroll
     * Updates the 'active' class on navigation links based on scroll position.
     */
    const sections = document.querySelectorAll('main section[id]');
    const allNavAnchors = document.querySelectorAll('header nav a');

    const updateActiveLink = () => {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Check if the top of the section is within the viewport (with an offset)
            if (window.scrollY >= (sectionTop - headerHeight - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavAnchors.forEach(a => {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
            // Check if the link's href matches the current section
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call on page load


    /**
     * 6. Dynamic Number Counter for Stats Section
     * Animates numbers counting up when the stats section is visible.
     */
    const statsCounters = document.querySelectorAll('.stat-number');
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const speed = 200; // Lower number = faster animation
        
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
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { root: null, threshold: 0.1 });

    statsCounters.forEach(counter => statObserver.observe(counter));


    /**
     * 7. GLightbox Initialization
     * Initializes the lightbox for the portfolio gallery.
     */
    let lightbox;
    if (typeof GLightbox !== 'undefined') {
        lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });
    } else {
        console.warn('GLightbox not found. Lightbox functionality will be disabled.');
    }


    /**
     * 8. Portfolio Filtering Logic
     * Filters portfolio items based on category buttons.
     */
    const filterContainer = document.querySelector('.portfolio-filters');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterContainer && portfolioItems.length > 0) {
        filterContainer.addEventListener('click', (e) => {
            // Use event delegation to only act on button clicks
            if (e.target.matches('.filter-btn')) {
                // Update active button state
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                
                const filterValue = e.target.getAttribute('data-filter');
                
                // Show or hide items based on the filter
                portfolioItems.forEach(item => {
                    const itemCategories = item.getAttribute('data-category');
                    const shouldShow = (filterValue === 'all' || itemCategories.includes(filterValue));
                    item.classList.toggle('hide', !shouldShow);
                });

                // Refresh the lightbox to include only visible items
                if (lightbox) {
                    lightbox.reload();
                }
            }
        });
    }


    /**
     * 9. Go-to-Top Button
     * Shows a button to scroll back to the top of the page.
     */
    const goToTopButton = document.getElementById('goToTopBtn');
    if (goToTopButton) {
        window.addEventListener('scroll', () => {
            goToTopButton.classList.toggle('show', window.scrollY > 300);
        });
        
        goToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /**
     * 10. WhatsApp Integration
     * A unified handler for sending pre-filled WhatsApp messages.
     */
    const sendWhatsAppMessage = (message) => {
        const whatsAppNumber = "917865080416";
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    };

    // Handler for the main Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('formName').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;
            
            let prefilledMessage = `Hello Grihograha,\n\n`;
            if (name) prefilledMessage += `My name is: ${name}\n`;
            if (subject) prefilledMessage += `Subject: ${subject}\n`;
            prefilledMessage += `\nMessage:\n${message}`;

            sendWhatsAppMessage(prefilledMessage);
        });
    }

    // Handler for the Pricing Section CTA buttons
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.addEventListener('click', (event) => {
            // Use event delegation to catch clicks on pricing buttons
            if (event.target.matches('.pricing-cta-btn')) {
                event.preventDefault();
                const service = event.target.dataset.service;
                const prefilledMessage = `Hello Grihograha, I'm interested in your ${service} service. Could you please provide more details?`;
                sendWhatsAppMessage(prefilledMessage);
            }
        });
    }

});