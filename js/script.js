// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section');
    
    // Dark mode setup
    const body = document.body;
    let darkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Create dark mode toggle button
    const createDarkModeToggle = () => {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'dark-mode-toggle';
        
        const toggleButton = document.createElement('button');
        toggleButton.id = 'darkModeToggle';
        toggleButton.innerHTML = darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        toggleContainer.appendChild(toggleButton);
        document.querySelector('nav').appendChild(toggleContainer);
        
        return toggleButton;
    };
    
    const darkModeToggle = createDarkModeToggle();
    
    // Function to enable dark mode
    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
        darkMode = true;
    };
    
    // Function to disable dark mode
    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
        darkMode = false;
    };
    
    // Set initial dark mode state based on localStorage
    if (darkMode) {
        enableDarkMode();
    }
    
    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', () => {
        darkMode = localStorage.getItem('darkMode') === 'enabled';
        if (darkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active section in navigation
        highlightActiveSection();
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinksItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission with EmailJS
    if (contactForm) {
        // Initialize EmailJS with your user ID
        (function() {
            // Add EmailJS script to the document
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.async = true;
            document.head.appendChild(script);
            
            script.onload = function() {
                emailjs.init("-Q4vJ5ejrFVj1Hp-w");
            };
        })();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }
            
            // Method 1: Using form directly (more reliable)
            emailjs.sendForm('service_e6w6iub', 'template_xhgn6q3', contactForm, '-Q4vJ5ejrFVj1Hp-w')
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showFormMessage('Your message has been sent successfully!', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = "Send Message";
                });
                
            // Method 2: Using parameters object (backup method, commented out)
            /*
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: 'Ximdrake Asidor'
            };
            
            emailjs.send('service_e6w6iub', 'template_xhgn6q3', templateParams, '-Q4vJ5ejrFVj1Hp-w')
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showFormMessage('Your message has been sent successfully!', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, function(error) {
                    console.log('FAILED...', error);
                    showFormMessage('Failed to send message. Please try again later.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
            */
        });
    }

    // Function to show form submission message
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add to DOM
        contactForm.appendChild(messageElement);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Function to highlight active section in navigation
    function highlightActiveSection() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding link
                const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Add CSS class for active navigation link
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            color: var(--primary-color);
        }
        .nav-links a.active::after {
            width: 100%;
        }
        .form-message {
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
            text-align: center;
        }
        .form-message.success {
            background-color: rgba(40, 167, 69, 0.2);
            color: #28a745;
        }
        .form-message.error {
            background-color: rgba(220, 53, 69, 0.2);
            color: #dc3545;
        }
        .dark-mode-toggle {
            margin-left: 20px;
        }
        #darkModeToggle {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
            padding: 5px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #darkModeToggle:hover {
            transform: rotate(30deg);
        }
        .dark-mode #darkModeToggle {
            color: var(--light-text-dark);
        }
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // Add animation to skills items
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe each skill item
    skillItems.forEach(item => {
        observer.observe(item);
    });

    // Add animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .skill-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .skill-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyle);

    // Create a placeholder image if needed
    const profileImage = document.getElementById('profile-image');
    if (profileImage && profileImage.getAttribute('src') === 'images/profile-placeholder.jpg') {
        // Create a directory for images if it doesn't exist
        console.log('Note: Please create an "images" directory and add your profile photo as "profile-placeholder.jpg"');
        
        // Set a default color for the placeholder
        profileImage.style.backgroundColor = darkMode ? '#2a2a2a' : '#e0e0e0';
    }
    
    // Add cool particle background effect
    createParticleBackground();
    
    function createParticleBackground() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles-container';
        document.body.prepend(particleContainer);
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 5 + 1;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            
            // Set styles
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;
            
            particleContainer.appendChild(particle);
        }
        
        // Add particle styles
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            .particles-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
                pointer-events: none;
            }
            
            .particle {
                position: absolute;
                background-color: var(--primary-color);
                opacity: 0.3;
                border-radius: 50%;
                animation: float linear infinite;
            }
            
            @keyframes float {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                }
                25% {
                    transform: translateY(-20px) translateX(10px) rotate(90deg);
                }
                50% {
                    transform: translateY(0) translateX(20px) rotate(180deg);
                }
                75% {
                    transform: translateY(20px) translateX(10px) rotate(270deg);
                }
                100% {
                    transform: translateY(0) translateX(0) rotate(360deg);
                }
            }
            
            .dark-mode .particle {
                opacity: 0.15;
            }
        `;
        document.head.appendChild(particleStyle);
    }
});
