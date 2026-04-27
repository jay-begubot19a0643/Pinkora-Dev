import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        if (data.isAuthenticated) {
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'about':
        return <About />
      case 'services':
        return <Services />
      case 'projects':
        return <Projects />
      case 'contact':
        return <Contact />
      default:
        return <Home />
    }
  }

  return (
    <>
      <Navbar onNavigate={setCurrentPage} isAuthenticated={isAuthenticated} />
      {renderPage()}
    </>
  )
}

export default App
