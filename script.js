document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * 1. AOS (Animate on Scroll) Initialization
     */
    AOS.init({
        duration: 800,
        once: true,
    });

    /**
     * 2. Mobile Menu Toggle
     */
    const hamburger = document.getElementById('hamburger-menu');
    const navLinksContainer = document.getElementById('nav-links-mobile');
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            const isOpened = navLinksContainer.classList.contains('active');
            icon.classList.toggle('fa-bars', !isOpened);
            icon.classList.toggle('fa-times', isOpened);
            hamburger.setAttribute('aria-expanded', isOpened);
        });
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
     */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /**
     * 4. Dynamic Footer Year
     */
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    /**
     * 5. Active Navigation Link Highlighting on Scroll
     */
    const sections = document.querySelectorAll('main section[id]');
    const allNavAnchors = document.querySelectorAll('header nav a');
    const updateActiveLink = () => {
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 70;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - headerHeight - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        const currentHash = window.location.hash;
        if (!currentSectionId && currentHash) {
             currentSectionId = currentHash.substring(1);
        }
        allNavAnchors.forEach(a => {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    /**
     * 6. Dynamic Number Counter for Stats Section
     */
    const statsCounters = document.querySelectorAll('.stat-number');
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const speed = 200;
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
    statsCounters.forEach(counter => statObserver.observe(counter));

    /**
     * 7. GLightbox Initialization
     */
    let lightbox;
    const initLightbox = () => {
        if (lightbox) {
            lightbox.destroy();
        }
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
    };
    initLightbox();

    /**
     * 8. Portfolio Filtering Logic
     */
    const filterContainer = document.querySelector('.portfolio-filters');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (filterContainer && portfolioItems.length > 0) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.getAttribute('data-filter');
                portfolioItems.forEach(item => {
                    const itemCategories = item.getAttribute('data-category');
                    const shouldShow = (filterValue === 'all' || itemCategories.includes(filterValue));
                    item.style.display = shouldShow ? 'block' : 'none';
                });
                initLightbox();
            }
        });
    }

    /**
     * 9. Go-to-Top Button
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
     * 10. WHATSAPP INTEGRATION
     */
    const sendWhatsAppMessage = (message) => {
        const whatsAppNumber = "917865080416";
        const encodedMessage = encodeURIComponent(message);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        let whatsappURL;
        if (isMobile) {
            whatsappURL = `whatsapp://send?phone=${whatsAppNumber}&text=${encodedMessage}`;
        } else {
            whatsappURL = `https://api.whatsapp.com/send?phone=${whatsAppNumber}&text=${encodedMessage}`;
        }
        window.open(whatsappURL, '_blank');
    };

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            if (!contactForm.checkValidity()) {
                return;
            }
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

    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.addEventListener('click', (event) => {
            if (event.target.matches('.pricing-cta-btn')) {
                event.preventDefault();
                const service = event.target.dataset.service;
                const prefilledMessage = `Hello Grihograha, I'm interested in your ${service} service. Could you please provide more details?`;
                sendWhatsAppMessage(prefilledMessage);
            }
        });
    }

    /**
     * 11. DYNAMIC PRICE ESTIMATOR
     */
    const estimatorSection = document.getElementById('estimator');
    if (estimatorSection) {
        const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
        const projectTypeRadios = document.querySelectorAll('input[name="projectType"]');
        const designTypeRadios = document.querySelectorAll('input[name="designType"]');
        const sqftInput = document.getElementById('sqft');
        const floorsInput = document.getElementById('floors');
        const estimatedPriceEl = document.getElementById('estimatedPrice');
        const estimateNotesEl = document.getElementById('estimateNotes');
        const estimatorCta = document.getElementById('estimatorCta');
        const projectDesignGroup = document.getElementById('projectDesignGroup');
        const numericInputsGroup = document.getElementById('numericInputsGroup');

        function calculateEstimate() {
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const projectType = document.querySelector('input[name="projectType"]:checked').value;
            const designType = document.querySelector('input[name="designType"]:checked').value;
            const sqft = parseInt(sqftInput.value);
            const floors = parseInt(floorsInput.value);
            let price = 0;
            let notes = "";
            let showCta = true;
            let ctaText = "Discuss This Quote";
            if (serviceType === 'custom') {
                price = 0;
                notes = "Let's discuss your unique project requirements.";
                ctaText = "Contact for Custom Quote";
            } else if (serviceType === '3d') {
                if (designType === 'interior') {
                    const rate = (projectType === 'residential') ? 23 : 25;
                    price = sqft * rate;
                    notes = `Based on ₹${rate}/sqft for ${projectType} interior design.`;
                    ctaText = "Discuss This Quote";
                } else {
                    const base = (projectType === 'residential') ? 8000 : 10000;
                    const extraFloorCost = (projectType === 'residential') ? 2000 : 3000;
                    const extraFloors = Math.max(0, floors - 2);
                    price = base + (extraFloors * extraFloorCost);
                    notes = `Starting from ₹${base.toLocaleString('en-IN')} for a G+1 project.`;
                    ctaText = "Discuss This Quote";
                }
            } else if (serviceType === '2d') {
                if (sqft > 1000) {
                     price = 0;
                     notes = "For areas over 1000 sqft, please contact us for a custom quote.";
                     ctaText = "Contact for Custom Quote";
                } else {
                    const base = (projectType === 'residential') ? 5000 : 8000;
                    const extraFloorCost = 1000;
                    const extraFloors = Math.max(0, floors - 2);
                    price = base + (extraFloors * extraFloorCost);
                    notes = `Starting from ₹${base.toLocaleString('en-IN')} for a G+1 project. Includes full structural detailing.`;
                    ctaText = "Discuss This Quote";
                }
            }
            if (price > 0) {
                estimatedPriceEl.textContent = `₹${price.toLocaleString('en-IN')}`;
            } else {
                estimatedPriceEl.textContent = "Custom";
            }
            estimateNotesEl.textContent = notes;
            if (estimatorCta.querySelector('.fab')) {
                 estimatorCta.querySelector('.fab').style.display = 'inline-block';
            }
            if (estimatorCta.childNodes[1]) {
                estimatorCta.childNodes[1].nodeValue = ` ${ctaText}`;
            }
            estimatorCta.style.display = showCta ? 'inline-block' : 'none';
        }

        function updateUiState() {
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const designType = document.querySelector('input[name="designType"]:checked').value;
            if (serviceType === 'custom') {
                projectDesignGroup.classList.add('disabled');
                numericInputsGroup.classList.add('disabled');
            } else {
                projectDesignGroup.classList.remove('disabled');
                numericInputsGroup.classList.remove('disabled');
            }
            floorsInput.disabled = (serviceType === '3d' && designType === 'interior');
        }

        const allInputs = [...serviceTypeRadios, ...projectTypeRadios, ...designTypeRadios, sqftInput, floorsInput];
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                updateUiState();
                calculateEstimate();
            });
        });
        
        estimatorCta.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
            const projectType = document.querySelector('input[name="projectType"]:checked').value;
            const designType = document.querySelector('input[name="designType"]:checked').value;
            const sqft = sqftInput.value;
            const floors = floorsInput.value;
            const estimatedPrice = estimatedPriceEl.textContent;
            const quoteDetails = `Service: ${serviceType}, \nProject: ${projectType}, \nDesign: ${designType}, \nArea: ${sqft} sqft, \nFloors: ${floors}. \n\nEstimated: ${estimatedPrice}`;
            const message = `Hello Grihograha, \nI used your estimator and got the following quote. I'd like to discuss it further.\n\nDetails:\n${quoteDetails}`;
            sendWhatsAppMessage(message);
        });

        updateUiState();
        calculateEstimate();
    }
});