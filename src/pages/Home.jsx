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