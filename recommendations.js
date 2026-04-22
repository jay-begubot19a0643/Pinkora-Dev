
// Recommendations Functionality
function initRecommendations() {
  const formContainer = document.getElementById('recommendationFormContainer');
  const loginPrompt = document.getElementById('loginPrompt');
  const recommendationForm = document.getElementById('recommendationForm');
  const commentInput = document.getElementById('comment');
  const charCount = document.getElementById('charCount');
  
  if (!formContainer && !loginPrompt) return; // Recommendations section not on this page
  
  // Check if user is logged in
  checkAuthStatus().then(isLoggedIn => {
    if (isLoggedIn) {
      if (formContainer) formContainer.style.display = 'block';
      if (loginPrompt) loginPrompt.style.display = 'none';
      attachFormListeners();
    } else {
      if (formContainer) formContainer.style.display = 'none';
      if (loginPrompt) loginPrompt.style.display = 'block';
    }
  });
  
  // Character counter
  if (commentInput) {
    commentInput.addEventListener('input', (e) => {
      const count = e.target.value.length;
      if (charCount) {
        charCount.textContent = `${count} / 1000`;
      }
    });
  }
  
  // Fetch and display recommendations
  fetchRecommendations();
}

function checkAuthStatus() {
  return new Promise((resolve) => {
    const token = localStorage.getItem('authToken');
    resolve(!!token);
  });
}

function attachFormListeners() {
  const recommendationForm = document.getElementById('recommendationForm');
  if (!recommendationForm) return;
  
  recommendationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const serviceName = document.getElementById('serviceName').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comment = document.getElementById('comment').value;
    const formMessage = document.getElementById('formMessage');
    const submitBtn = recommendationForm.querySelector('.recommendation-submit-btn');
    
    // Validation
    if (!serviceName || !rating || !comment) {
      showMessage(formMessage, 'Please fill all fields', 'error');
      return;
    }
    
    if (comment.length < 10) {
      showMessage(formMessage, 'Comment must be at least 10 characters', 'error');
      return;
    }
    
    // Submit
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/submit-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceName,
          rating: parseInt(rating),
          comment
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage(formMessage, 'Thank you! Your recommendation has been submitted.', 'success');
        recommendationForm.reset();
        document.querySelector('input[name="rating"]:checked')?.checked = false;
        
        // Refresh recommendations list
        setTimeout(() => {
          fetchRecommendations();
        }, 1000);
      } else {
        showMessage(formMessage, 'Error: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage(formMessage, 'Error submitting recommendation. Please try again later.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function fetchRecommendations() {
  const container = document.getElementById('recommendationsContainer');
  if (!container) return;
  
  container.innerHTML = '<div class="loading-spinner">Loading recommendations...</div>';
  
  fetch('/api/recommendations')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        displayRecommendations(data.data);
      } else {
        container.innerHTML = '<div class="no-recommendations-message">No recommendations yet. Be the first to share your experience!</div>';
      }
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error);
      container.innerHTML = '<div class="no-recommendations-message">Unable to load recommendations.</div>';
    });
}

function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendationsContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  recommendations.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    const stars = '★'.repeat(rec.rating) + '☆'.repeat(5 - rec.rating);
    const date = new Date(rec.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    card.innerHTML = `
      <div class="recommendation-header">
        <div class="recommendation-user">
          <div class="recommendation-user-name">${escapeHtml(rec.userName)}</div>
          <div class="recommendation-service">${escapeHtml(rec.serviceName)}</div>
        </div>
      </div>
      <div class="recommendation-rating">${stars}</div>
      <p class="recommendation-comment">${escapeHtml(rec.comment)}</p>
      <div class="recommendation-date">${date}</div>
    `;
    
    container.appendChild(card);
  });
}

function showMessage(element, message, type) {
  if (!element) return;
  
  element.textContent = message;
  element.className = `form-message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      element.className = 'form-message';
    }, 5000);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
