import React from 'react'
import { Link } from 'react-router-dom'
import '../components/SideBar.css'
import { useTheme } from '../context/ThemeContext'

const SideBar = ({onLogout}) => {

 const{ theme , toggleTheme} = useTheme();

  return (
  <aside className='side-bar'>
    <div className='side-brand'>
        <h1>WorkWise</h1>
        <p className='side-para'>Stay Focused &amp; organized</p>
    </div>

    <nav className="side-nav">
        <Link to="/dashboard" className="side-nav-item active">🏠 Dashboard</Link>
      </nav>

 <div className="side-bottom">
        <button className="side-dark-toggle" onClick={toggleTheme}>{theme ==="dark" ? "☀ Light Mode" :"🌙 Dark Mode"}</button>
        <button className="side-logout" onClick={onLogout}>↩ Logout</button>
      </div>




  </aside>
  )
}

export default SideBar