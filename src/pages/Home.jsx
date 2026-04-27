import { useState, useEffect } from 'react'
import './Home.css'

function Home({ isAuthenticated }) {
  const [recommendations, setRecommendations] = useState([])
  const [formMessage, setFormMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations')
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName: formData.get('serviceName'),
          rating: formData.get('rating'),
          comment: formData.get('comment'),
        }),
      })

      if (response.ok) {
        setFormMessage('Thank you for your recommendation!')
        e.target.reset()
        fetchRecommendations()
        setTimeout(() => setFormMessage(''), 3000)
      }
    } catch (error) {
      setFormMessage('Failed to submit recommendation')
      console.error(error)
    }
  }

  return (
    <>
      {/* Video Hero Section */}
      <section className="video-embed">
        <div className="video-container">
          <video className="hero-video-player" autoPlay muted loop preload="auto">
            <source src="Intro-1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-fallback"></div>
        </div>
      </section>

      {/* Social Media Scroll */}
      <section className="social-media">
        <div className="social-scroll">
          <div className="social-track">
            <a href="https://www.facebook.com/gubotjaybe26" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link" title="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@Pinkora_Dev" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.945v5.442h-3.554s.045-8.842 0-9.769h3.554v1.383c.43-.664 1.199-1.608 2.925-1.608 2.137 0 3.74 1.397 3.74 4.393v5.601zM5.337 9.341c-1.144 0-1.915-.758-1.915-1.708 0-.962.77-1.714 1.942-1.714 1.175 0 1.915.752 1.938 1.714 0 .95-.763 1.708-1.965 1.708zm1.586 11.111H3.73V9.684h3.193v10.768zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Main Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">Clarity. Performance. Growth.</h1>
          <p className="hero-sub">I design and implement business systems that transform complexity into clarity, streamline workflows, and create structures that empower organizations to scale with confidence.</p>
          <p className="hero-cta">
            <a className="btn primary" href="#projects">View Projects</a>
            <a className="btn muted" href="#services">Our Services</a>
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects container" id="projects">
        <h2 className="section-title">Selected Projects</h2>
        <div className="projects-grid">
          <p>Featured projects coming soon...</p>
        </div>
        <p className="more-link"><a href="#projects">See all projects →</a></p>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials container" id="clients">
        <h2 className="section-title">Clients</h2>
        <p>Trusted by great teams — see our clients for examples.</p>
      </section>

      {/* Recommendations Section */}
      <section className="recommendations container" id="recommendations">
        <div className="recommendations-header">
          <h2 className="section-title">User Recommendations</h2>
          <p className="recommendations-subtitle">Real feedback from users who've experienced our services</p>
        </div>

        <div className="recommendations-wrapper">
          {/* Logged-in user form */}
          {isAuthenticated && (
            <div className="recommendation-form-container">
              <div className="recommendation-form-card">
                <h3>Share Your Experience</h3>
                <form className="recommendation-form" onSubmit={handleRecommendationSubmit}>
                  <div className="form-group">
                    <label htmlFor="serviceName">Which service did you experience?</label>
                    <select id="serviceName" name="serviceName" required>
                      <option value="">Select a service</option>
                      <option value="POS System">POS System</option>
                      <option value="Inventory Management">Inventory Management</option>
                      <option value="Sales Analytics">Sales Analytics</option>
                      <option value="Business Dashboard">Business Dashboard</option>
                      <option value="Video Monitoring">Video Monitoring</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Web Development">Web Development</option>
                      <option value="System Integration">System Integration</option>
                      <option value="Cloud Solutions">Cloud Solutions</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="rating">Rate your experience</label>
                    <div className="rating-input">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star}>
                          <input type="radio" id={`star${star}`} name="rating" value={star} required />
                          <label htmlFor={`star${star}`} title={`${star} star${star !== 1 ? 's' : ''}`}>★</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">Your comment (min 10 characters)</label>
                    <textarea id="comment" name="comment" placeholder="Share your experience with us..." minLength="10" maxLength="1000" required></textarea>
                  </div>

                  <button type="submit" className="btn primary recommendation-submit-btn">Submit Recommendation</button>
                  {formMessage && <p className="form-message">{formMessage}</p>}
                </form>
              </div>
            </div>
          )}

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated && (
            <div className="login-prompt-card">
              <h3>Share Your Experience</h3>
              <p>Create an account to share your feedback and help other users learn about our services.</p>
              <a href="/account" className="btn primary">Sign In or Create Account</a>
            </div>
          )}

          {/* Recommendations Display */}
          <div className="recommendations-grid">
            {loading ? (
              <div className="loading-spinner">Loading recommendations...</div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-header">
                    <div className="recommendation-rating">
                      {'★'.repeat(rec.rating)}<span className="empty-stars">{'★'.repeat(5 - rec.rating)}</span>
                    </div>
                    <span className="recommendation-service">{rec.serviceName}</span>
                  </div>
                  <p className="recommendation-comment">{rec.comment}</p>
                </div>
              ))
            ) : (
              <p>No recommendations yet. Be the first to share!</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
