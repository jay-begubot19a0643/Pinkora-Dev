import './Navbar.css'

function Navbar({ onNavigate, isAuthenticated }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span onClick={() => onNavigate('home')}>Pinkora Dev</span>
        </div>
        <ul className="navbar-menu">
          <li onClick={() => onNavigate('home')}>Home</li>
          <li onClick={() => onNavigate('about')}>About</li>
          <li onClick={() => onNavigate('services')}>Services</li>
          <li onClick={() => onNavigate('projects')}>Projects</li>
          <li onClick={() => onNavigate('contact')}>Contact</li>
        </ul>
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button className="auth-btn">Logout</button>
          ) : (
            <button className="auth-btn">Login</button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
