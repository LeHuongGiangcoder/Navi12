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

      {/* Feature Cards Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-title">Tính năng nổi bật</h2>
          <div className="features-grid">
            
            {/* Card 1: Thi chuẩn thi thật */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#eb6412" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Thi chuẩn thi thật</h3>
              <p className="feature-card-description">
                Hệ thống bài kiểm tra đa dạng, bám sát theo cấu trúc các kỳ thi thật. 
                Đánh giá năng lực và xác định điểm yếu cần cải thiện.
              </p>
              <Link to="/kiem-tra" className="feature-card-button">
                Bắt đầu
              </Link>
            </div>

            {/* Card 2: Luyện sâu chuyên đề */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.253V16.747M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" stroke="#eb6412" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Luyện sâu chuyên đề</h3>
              <p className="feature-card-description">
                Luyện tập chuyên sâu theo từng chuyên đề cụ thể. Các câu hỏi được hệ thống 
                đề xuất theo mức độ phù hợp từ cơ bản đến nâng cao.
              </p>
              <Link to="/luyen-sau" className="feature-card-button">
                Luyện tập
              </Link>
            </div>

            {/* Card 3: Thi đấu tuần */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L8.5 9.5L15.5 9.5L12 15Z" fill="#eb6412"/>
                  <path d="M12 6V2M12 22V18M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76" stroke="#eb6412" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Thi đấu tuần</h3>
              <p className="feature-card-description">
                Tham gia cuộc thi hàng tuần với các học sinh trên toàn quốc. 
                Đua top, nhận thưởng và khẳng định năng lực.
              </p>
              <Link to="/thi-dau" className="feature-card-button">
                Tham gia
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;