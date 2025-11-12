import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          NAVI12
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/kiem-tra" 
              className={`navbar-link ${isActive('/kiem-tra') ? 'active' : ''}`}
            >
              Luyện đề
            </Link>
          </li>
          <li>
            <Link 
              to="/luyen-sau" 
              className={`navbar-link ${isActive('/luyen-sau') ? 'active' : ''}`}
            >
              Luyện sâu
            </Link>
          </li>
          <li>
            <Link 
              to="/thi-dau" 
              className={`navbar-link ${isActive('/thi-dau') ? 'active' : ''}`}
            >
              Thi đấu
            </Link>
          </li>
          <li>
            <Link 
              to="/tao-phong" 
              className={`navbar-link ${isActive('/tao-phong') ? 'active' : ''}`}
            >
              Tạo phòng
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <button className="navbar-login-btn">
          Đăng nhập
        </button>

        {/* Mobile Hamburger */}
        <button 
          className={`navbar-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/kiem-tra" 
              className={`navbar-mobile-link ${isActive('/kiem-tra') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kiểm tra
            </Link>
          </li>
          <li>
            <Link 
              to="/luyen-sau" 
              className={`navbar-mobile-link ${isActive('/luyen-sau') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Luyện sâu
            </Link>
          </li>
          <li>
            <Link 
              to="/thi-dau" 
              className={`navbar-mobile-link ${isActive('/thi-dau') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Thi đấu
            </Link>
          </li>
          <li>
            <Link 
              to="/tao-phong" 
              className={`navbar-mobile-link ${isActive('/tao-phong') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tạo phòng
            </Link>
          </li>
          <li>
            <button 
              className="navbar-mobile-login-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Đăng nhập
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;