// API Configuration
const API_URL = '/api';

// Current user state
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize AI Assistant
  if (typeof initAIAssistant === 'function') {
    initAIAssistant();
  }

  // Check auth status
  checkAuthStatus();

  // Setup form handlers
  setupSignUpForm();
  setupFeedbackForm();
  setupThemeToggle();
  setupSignOut();
});

// Check if user is already logged in
async function checkAuthStatus() {
  try {
    const response = await fetch(`${API_URL}/auth-check.php`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success && data.data) {
      currentUser = data.data;
      updateUIBasedOnAuth(currentUser);
      loadUserData(currentUser);
    } else {
      updateUIBasedOnAuth(null);
    }
  } catch (error) {
    console.error('Auth check error:', error);
    updateUIBasedOnAuth(null);
  }
}

// Setup Sign Up Form
function setupSignUpForm() {
  const form = document.getElementById('signUpForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;

    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        currentUser = {
          id: data.data.user_id,
          name: data.data.name,
          email: data.data.email
        };
        alert('Account created successfully!');
        closeSignUpModal();
        updateUIBasedOnAuth(currentUser);
        loadUserData(currentUser);
        form.reset();
      } else {
        alert('Sign-up failed: ' + data.message);
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      alert('Sign-up failed. Please try again.');
    }
  });
}

// Setup Feedback Form
function setupFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  if (!feedbackForm) return;

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please sign in to submit feedback');
      return;
    }

    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value;

    try {
      const response = await fetch(`${API_URL}/submit-feedback.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, message })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Thank you for your feedback!');
        feedbackForm.reset();
        closeFeedbackModal();
      } else {
        alert('Failed to submit feedback: ' + data.message);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  });
}

// Update UI based on authentication state
function updateUIBasedOnAuth(user) {
  const notSignedInView = document.getElementById('notSignedIn');
  const signedInView = document.getElementById('signedInView');

  if (user) {
    // User is signed in
    if (notSignedInView) notSignedInView.style.display = 'none';
    if (signedInView) signedInView.style.display = 'block';
    
    // Update user info
    updateUserInfo(user);
  } else {
    // User is not signed in
    if (notSignedInView) notSignedInView.style.display = 'block';
    if (signedInView) signedInView.style.display = 'none';
  }
}

// Load and display user data
function loadUserData(user) {
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userProfilePic = document.getElementById('userProfilePic');

  if (userName) userName.textContent = user.displayName || 'User';
  if (userEmail) userEmail.textContent = user.email || '';
  if (userProfilePic && user.photoURL) {
    userProfilePic.src = user.photoURL;
  }
}

// Update user info in dashboard
function updateUserInfo(user) {
  loadUserData(user);
}

// Modal Functions
function openSignUpModal() {
  const modal = document.getElementById('signUpModal');
  if (modal) modal.style.display = 'flex';
}

function closeSignUpModal() {
  const modal = document.getElementById('signUpModal');
  if (modal) modal.style.display = 'none';
  const form = document.getElementById('signUpForm');
  if (form) form.reset();
}

function showFeedbackForm() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.style.display = 'flex';
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.style.display = 'none';
  const form = document.getElementById('feedbackForm');
  if (form) form.reset();
}

function showPurchaseHistory() {
  alert('Purchase history feature coming soon!');
}

function showSubscriptions() {
  alert('Subscription management coming soon!');
}

function showSettings() {
  alert('Account settings coming soon!');
}

function showSecurity() {
  alert('Security & Privacy settings coming soon!');
}

// Sign Out
function setupSignOut() {
  const signOutBtn = document.getElementById('signOutBtn');
  if (!signOutBtn) return;

  signOutBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        currentUser = null;
        updateUIBasedOnAuth(null);
        alert('You have been signed out');
      }
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  });
}

// Setup Theme Toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Open Sign Up Modal
const openSignUpFormBtn = document.getElementById('openSignUpForm');
if (openSignUpFormBtn) {
  openSignUpFormBtn.addEventListener('click', openSignUpModal);
}

// Close modals on outside click
window.addEventListener('click', (event) => {
  const signUpModal = document.getElementById('signUpModal');
  const feedbackModal = document.getElementById('feedbackModal');
  
  if (event.target === signUpModal) closeSignUpModal();
  if (event.target === feedbackModal) closeFeedbackModal();
});
