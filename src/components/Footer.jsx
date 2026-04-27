import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <small>© <span id="year">{new Date().getFullYear()}</span> Pinkora — All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer
