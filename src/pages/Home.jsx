import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const animatedTexts = [
    "Thi chuẩn thật",
    "Luyện chuyên sâu",
    "Đấu trường cạnh tranh"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        (prevIndex + 1) % animatedTexts.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Chinh phục mọi kỳ thi với
          </h1>
          <div className="hero-subtitle-container">
            <h2 className="hero-subtitle">
              {animatedTexts[currentTextIndex]}
            </h2>
          </div>
          <button 
            className="hero-cta-button"
            onClick={scrollToFeatures}
          >
            Bắt đầu ngay
          </button>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Separate Feature Sections */}
      <section id="feature-test" className="feature-section">
        <h2 className="feature-title">Thi chuẩn thi thật</h2>
        <p className="feature-description">Hệ thống bài kiểm tra đa dạng, bám sát theo cấu trúc các kỳ thi thật. Đánh giá năng lực và xác định điểm yếu cần cải thiện.</p>
        <div className="card-grid">
          <div className="mock-card">
            <div className="card-header">Đề thi thử Toán 12</div>
            <div className="card-date">Tháng 1/2025</div>
            <div className="card-rating">★★★★★ (132 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Đề thi thử Toán 12</div>
            <div className="card-date">Tháng 10/2024</div>
            <div className="card-rating">★★★★☆ (750 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Đề thi thử Toán 12</div>
            <div className="card-date">Tháng 9/2024</div>
            <div className="card-rating">★★★★★ (829 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Đề thi thử Toán 12</div>
            <div className="card-date">Tháng 8/2024</div>
            <div className="card-date">★★★★★ (352 lượt)</div>
          </div>
        </div>
        <Link to="/kiem-tra" className="section-button">Bắt đầu</Link>
      </section>

      <section className="feature-section">
        <h2 className="feature-title">Luyện sâu chuyên đề</h2>
        <p className="feature-description">Luyện tập chuyên sâu theo từng chuyên đề cụ thể. Các câu hỏi được hệ thống đề xuất theo mức độ phù hợp từ cơ bản đến nâng cao.</p>
        <div className="card-grid">
          <div className="mock-card">
            <div className="card-header">Hàm số và đồ thị</div>
            <div className="card-date">Cơ bản</div>
            <div className="card-rating">★★★★★ (500 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Nguyên hàm tích phân</div>
            <div className="card-date">Nâng cao</div>
            <div className="card-rating">★★★★☆ (300 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Số phức</div>
            <div className="card-date">Cơ bản</div>
            <div className="card-rating">★★★★★ (400 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Hình học không gian</div>
            <div className="card-date">Nâng cao</div>
            <div className="card-rating">★★★★★ (250 lượt)</div>
          </div>
        </div>
        <Link to="/luyen-sau" className="section-button">Luyện tập</Link>
      </section>

      <section className="feature-section">
        <h2 className="feature-title">Thi đấu tuần</h2>
        <p className="feature-description">Tham gia cuộc thi hàng tuần với các học sinh trên toàn quốc. Đua top, nhận thưởng và khẳng định năng lực.</p>
        <div className="card-grid">
          <div className="mock-card">
            <div className="card-header">Giải đấu tuần 1</div>
            <div className="card-date">Tuần 1/2025</div>
            <div className="card-rating">★★★★★ (1000 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Giải đấu tuần 2</div>
            <div className="card-date">Tuần 2/2024</div>
            <div className="card-rating">★★★★☆ (800 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Giải đấu tuần 3</div>
            <div className="card-date">Tuần 3/2024</div>
            <div className="card-rating">★★★★★ (900 lượt)</div>
          </div>
          <div className="mock-card">
            <div className="card-header">Giải đấu tuần 4</div>
            <div className="card-date">Tuần 4/2024</div>
            <div className="card-rating">★★★★★ (700 lượt)</div>
          </div>
        </div>
        <Link to="/thi-dau" className="section-button">Tham gia</Link>
      </section>
    </div>
  );
};

export default Home;