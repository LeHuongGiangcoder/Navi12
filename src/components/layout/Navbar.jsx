import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Navi12
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Trang Chủ</Link></li>
          <li><Link to="/kiem-tra">Kiểm Tra</Link></li>
          <li><Link to="/luyen-sau">Luyện Sau</Link></li>
          <li><Link to="/thi-dau">Thi Đấu</Link></li>
          <li><Link to="/tao-phong">Tạo Phòng</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;