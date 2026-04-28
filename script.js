// Simple dynamic projects injector
const projects = [
  {
    title: 'Smart Monitoring System',
    desc: 'An AI-powered Bilingual Point-of-Sale System with Sales Analytics and Advance Inventory Suite for Retail Stores.',
    link: 'projects.html#smart-monitoring'
  },
  {
    title: 'E-commerce Launch',
    desc: 'Design and build of a conversion-focused shop.',
    link: 'projects.html'
  },
  {
    title: 'Campaign Microsite',
    desc: 'Fast-loading campaign site with beautiful interactions.',
    link: 'projects.html'
  }
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return; // Only run if projects grid exists
  
  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.style.cursor = 'pointer';

    const thumb = document.createElement('div');
    thumb.className = 'project-thumb';
    thumb.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'project-content';

    const h3 = document.createElement('h3');
    h3.textContent = p.title;
    const pdesc = document.createElement('p');
    pdesc.textContent = p.desc;
    const a = document.createElement('a');
    a.href = p.link;
    a.className = 'project-link';
    a.textContent = 'Read more →';

    content.appendChild(h3);
    content.appendChild(pdesc);
    content.appendChild(a);

    card.appendChild(thumb);
    card.appendChild(content);
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking the link itself (it will handle its own navigation)
      if (e.target !== a && !a.contains(e.target)) {
        window.location.href = p.link;
      }
    });
    
    grid.appendChild(card);
  });
}

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return; // If toggle doesn't exist on this page
  
  // Check for saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Hamburger Menu Toggle
function initHamburgerMenu() {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const mainNav = document.getElementById('mainNav');
  
  if (!hamburgerMenu || !mainNav) return;
  
  // Toggle menu on hamburger click
  hamburgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerMenu.classList.toggle('active');
    mainNav.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', hamburgerMenu.classList.contains('active'));
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !mainNav.contains(e.target)) {
      hamburgerMenu.classList.remove('active');
      mainNav.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);
    }
  });
  
  // Close menu when clicking a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active');
      mainNav.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);
    });
  });
  
  // Close menu on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      hamburgerMenu.classList.remove('active');
      mainNav.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', false);
    }
  });
}

// Initialize Scroll Reveal Animations
function initScrollReveal() {
  // Add scroll-reveal class to all relevant elements
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const sections = document.querySelectorAll('section:not(.hero)'); // Exclude hero section
  
  // Get all grid and container elements
  const grids = document.querySelectorAll(
    '.services-grid, .projects-grid, .mission-grid, .skills-grid, ' +
    '.features-grid, .workflow-steps, .tech-categories, .metrics-grid, ' +
    '.screenshots-grid, .recommendations-grid, .principle-grid, ' +
    '.clients-grid, .testimonials-grid'
  );
  
  const cards = document.querySelectorAll(
    '.project-card, .service-card, .mission-card, .principle-card, .skill-item, ' +
    '.feature-card, .workflow-step, .tech-category, .metric-card, ' +
    '.screenshot-item, .recommendation-item, .client-card'
  );

  // Mark sections as scroll-reveal containers (excluding hero)
  sections.forEach(section => {
    if (!section.classList.contains('scroll-reveal')) {
      section.classList.add('scroll-reveal');
    }
  });

  // Mark grids as scroll-reveal containers
  grids.forEach(grid => {
    if (!grid.classList.contains('scroll-reveal')) {
      grid.classList.add('scroll-reveal');
    }
  });

  // Mark cards as scroll-reveal if their parents aren't already
  cards.forEach(card => {
    if (!card.closest('.scroll-reveal')) {
      card.classList.add('scroll-reveal');
    }
  });

  // Mark headings as scroll-reveal if their parents aren't already (excluding hero)
  headings.forEach(heading => {
    if (!heading.closest('.hero') && !heading.closest('.scroll-reveal')) {
      heading.classList.add('scroll-reveal');
    }
  });

  // Make hero section immediately visible
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.classList.add('visible');
  }

  // Create Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all scroll-reveal elements and check initial visibility
  document.querySelectorAll('.scroll-reveal').forEach(element => {
    observer.observe(element);
    
    // Check if element is already visible on page load
    const rect = element.getBoundingClientRect();
    const isInViewport = (
      rect.top <= window.innerHeight - 100 &&
      rect.bottom >= 0
    );
    
    if (isInViewport) {
      element.classList.add('visible');
    }
  });
}

// Mobile dropdown toggles for nav (create toggles dynamically)
function initDropdownToggles() {
  document.querySelectorAll('.nav-dropdown').forEach(li => {
    // create toggle button if missing
    let toggle = li.querySelector('.dropdown-toggle');
    const menu = li.querySelector('.dropdown-menu');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'dropdown-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle submenu');
      toggle.innerHTML = '<span class="chev">⌄</span>';
      // insert toggle right after the link
      const link = li.querySelector('a');
      if (link) link.after(toggle);
      else li.insertBefore(toggle, menu);
    }

    // ensure menu collapsed by default on mobile
    if (menu && window.matchMedia('(max-width: 768px)').matches) {
      menu.style.display = 'none';
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = li.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (menu) {
        if (isOpen) {
          menu.style.display = 'flex';
        } else {
          menu.style.display = 'none';
        }
      }
    });
  });

  // Close any open dropdown when clicking outside
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach(openLi => {
      if (!openLi.contains(e.target)) {
        openLi.classList.remove('open');
        const t = openLi.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
        const m = openLi.querySelector('.dropdown-menu');
        if (m) m.style.display = 'none';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  
  // Update year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize Theme Toggle
  initThemeToggle();
  
  // Initialize Hamburger Menu
  initHamburgerMenu();
  
  // Initialize dropdown toggles (mobile)
  initDropdownToggles();
  
  // Initialize Scroll Reveal Animations
  initScrollReveal();
  
  // Initialize AI Assistant
  initAIAssistant();
  
  // Initialize Contact Form
  initContactForm();
  
  // Handle video autoplay
  const video = document.querySelector('.hero-video-player');
  const videoContainer = document.querySelector('.video-container');
  
  if (video && videoContainer) {
    // Ensure video is properly configured
    video.muted = true;
    video.autoplay = true;
    
    // Try to play immediately
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video autoplay started successfully');
        })
        .catch(err => {
          console.warn('Autoplay failed:', err.message);
          // Try again on first user interaction
          const attemptPlay = () => {
            video.play().catch(e => {
              console.error('Manual play failed:', e);
              showVideoFallback();
            });
            document.removeEventListener('click', attemptPlay);
          };
          document.addEventListener('click', attemptPlay);
        });
    }
    
    // Detect video load errors
    video.addEventListener('error', () => {
      console.error('Video failed to load');
      showVideoFallback();
    });
    
    // Detect if video never loads
    const loadTimeout = setTimeout(() => {
      if (video.readyState === 0) { // HAVE_NOTHING
        console.warn('Video failed to load within timeout');
        showVideoFallback();
      }
    }, 5000);
    
    video.addEventListener('loadstart', () => {
      clearTimeout(loadTimeout);
    });
    
    function showVideoFallback() {
      videoContainer.classList.add('no-video');
    }
  }
  
  // Initialize Recommendations
  initRecommendations();
});

// AI Assistant Functionality
function initAIAssistant() {
  const toggle = document.getElementById('aiAssistantToggle');
  const panel = document.getElementById('aiAssistantPanel');
  const close = document.getElementById('aiAssistantClose');
  const input = document.getElementById('assistantInput');
  const send = document.getElementById('assistantSend');
  const messagesContainer = document.getElementById('assistantMessages');
  const suggestions = document.getElementById('assistantSuggestions');

  if (!toggle || !panel) return; // Widget not on this page

  // Toggle chat panel
  toggle.addEventListener('click', () => {
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      input.focus();
    }
  });

  // Close panel
  close.addEventListener('click', () => {
    panel.classList.remove('active');
  });

  // Send message
  function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addUserMessage(message);
    input.value = '';
    
    // Simulate typing and respond
    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        const response = getAIResponse(message);
        addBotMessage(response);
      }, 1000 + Math.random() * 1000);
    }, 300);
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Suggestion chips
  suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.dataset.question;
      addUserMessage(question);
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          const response = getAIResponse(question);
          addBotMessage(response);
        }, 1000 + Math.random() * 1000);
      }, 300);
    });
  });

  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'assistant-message user';
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M7 20a4 4 0 0 1 10 0"></path>
        </svg>
      </div>
      <div class="message-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'assistant-message bot';
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <img src="images/pinkora_assistant.png" alt="AI">
      </div>
      <div class="message-bubble">
        <p>${text}</p>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'assistant-message bot typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <img src="images/pinkora_assistant.png" alt="AI">
      </div>
      <div class="message-bubble">
        <div class="assistant-typing">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typing = messagesContainer.querySelector('.typing-indicator');
    if (typing) {
      typing.remove();
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// AI Knowledge Base
function getAIResponse(message) {
  const lowerMsg = message.toLowerCase();

  // Services
  if (lowerMsg.includes('service') || lowerMsg.includes('what do you do') || lowerMsg.includes('what does pinkora')) {
    return 'Pinkora offers full-stack development services including cross-platform Flutter apps, POS & inventory systems, CCTV integration, cloud sync solutions, and custom business software. Visit our <a href="services.html" style="color:var(--accent-2);text-decoration:underline">Services page</a> for details.';
  }

  // Projects
  if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') || lowerMsg.includes('smart store') || lowerMsg.includes('monitoring')) {
    return 'Our flagship project is the <strong>Smart Store Monitoring System</strong>—a real-time CCTV integration with POS correlation and intelligent analytics. Check out the <a href="projects.html" style="color:var(--accent-2);text-decoration:underline">Projects page</a> to see more.';
  }

  // Owner's Wife (check BEFORE generic "who" check)
  if (lowerMsg.includes('wife') || lowerMsg.includes('married') || lowerMsg.includes('spouse') || lowerMsg.includes('pinky')) {
    return 'The wife of the owner is <strong>Pinky Pastor Gubot</strong>. Together, they drive the vision of Pinkora to empower businesses and communities through innovative technology.';
  }

  // About Jay-Be
  if (lowerMsg.includes('who') || lowerMsg.includes('jay-be') || lowerMsg.includes('developer') || lowerMsg.includes('about')) {
    return 'Jay-Be Gubot is a full-stack system developer specializing in cross-platform Flutter applications. He builds solutions that simplify operations and empower communities. Learn more on the <a href="about_me.html" style="color:var(--accent-2);text-decoration:underline">About Me page</a>.';
  }

  // Technologies
  if (lowerMsg.includes('tech') || lowerMsg.includes('stack') || lowerMsg.includes('flutter') || lowerMsg.includes('language')) {
    return 'We work with <strong>Flutter/Dart</strong> for cross-platform apps, <strong>SQLite</strong> for local databases, <strong>RTSP/FFmpeg</strong> for video streaming, and cloud services for synchronization. All built with offline-first architecture and clean, testable code.';
  }

  // Contact
  if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('reach') || lowerMsg.includes('get in touch')) {
    return 'You can reach out through our <a href="contact.html" style="color:var(--accent-2);text-decoration:underline">Contact page</a>. We\'d love to discuss your project or answer any questions!';
  }

  // Clients
  if (lowerMsg.includes('client') || lowerMsg.includes('customer') || lowerMsg.includes('work with')) {
    return 'We work with small businesses, organizations, nonprofits, and startups. Check out our <a href="clients.html" style="color:var(--accent-2);text-decoration:underline">Clients page</a> to see who trusts Pinkora.';
  }

  // Pricing
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('rate') || lowerMsg.includes('budget')) {
    return 'Pricing depends on project scope and requirements. We offer flexible packages for startups, small businesses, and enterprises. <a href="contact.html" style="color:var(--accent-2);text-decoration:underline">Contact us</a> for a custom quote!';
  }

  // Mission
  if (lowerMsg.includes('mission') || lowerMsg.includes('goal') || lowerMsg.includes('why')) {
    return 'Our mission is to empower businesses and communities through technology that simplifies operations, enhances security, and drives growth. We build solutions for small businesses, organizations, communities, startups, nonprofits, and everyone who needs reliable software.';
  }

  // Default response
  return 'I\'m here to help! You can ask me about our services, projects, technologies, contact information, or anything else about Pinkora. Try one of the suggested questions above!';
}

// Contact Form Handler
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return; // Only run if contact form exists
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    
    // Validation
    if (!name || !email || !subject || !message) {
      showFormError('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Send form to Hostinger PHP API
      const response = await fetch('/api/contact-form.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: message
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormSuccess('Thanks for reaching out! We\'ll get back to you shortly.');
        contactForm.reset();
      } else {
        showFormError('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      showFormError('Unable to send message. Please try again later.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormSuccess(message) {
  let successMessage = document.querySelector('.form-success');
  if (!successMessage) {
    const contactFormWrapper = document.querySelector('.contact-form-wrapper');
    successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    contactFormWrapper.parentNode.insertBefore(successMessage, contactFormWrapper);
  }
  successMessage.textContent = message;
  successMessage.classList.add('show');
  
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 5000);
}

function showFormError(message) {
  let errorMessage = document.querySelector('.form-error');
  if (!errorMessage) {
    const contactFormWrapper = document.querySelector('.contact-form-wrapper');
    errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    contactFormWrapper.parentNode.insertBefore(errorMessage, contactFormWrapper);
  }
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}


// Intro Transition Logic
function initIntroTransition() {
  const intro = document.getElementById('intro-transition');
  const heroVideo = document.getElementById('heroVideo');
  
  if (!intro) return;

  // After 3 seconds (animation duration), fade out the intro and start the video
  setTimeout(() => {
    intro.classList.add('fade-out');
    if (heroVideo) {
      heroVideo.play().catch(error => {
        console.log('Video autoplay blocked, user interaction required.');
      });
    }
  }, 3500);
}

// Intro Transition Logic
function initIntroTransition() {
  const intro = document.getElementById('intro-transition');
  const heroVideo = document.getElementById('heroVideo');
  
  if (!intro) return;

  // After 3 seconds (animation duration), fade out the intro and start the video
  setTimeout(() => {
    intro.classList.add('fade-out');
    if (heroVideo) {
      heroVideo.play().catch(error => {
        console.log('Video autoplay blocked, user interaction required.');
      });
    }
  }, 3500);
}
