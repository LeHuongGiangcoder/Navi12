import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [units, setUnits] = useState([]);
  const [topicProgress, setTopicProgress] = useState({ completed: 0, level: 'Cơ bản' });

  useEffect(() => {
    // Tìm topic theo ID
    const foundTopic = mockData.mockTopics.find(t => t.id === topicId);
    if (foundTopic) {
      setTopic(foundTopic);
      
      // Lấy các units thuộc topic này
      const topicUnits = mockData.mockUnits.filter(unit => unit.topicId === topicId);
      setUnits(topicUnits);
      
      // Mock progress data cho topic
      const savedProgress = localStorage.getItem(`topic_progress_${topicId}`);
      if (savedProgress) {
        setTopicProgress(JSON.parse(savedProgress));
      } else {
        const mockProgress = {
          completed: Math.floor(Math.random() * 100),
          level: ['Cơ bản', 'Trung bình', 'Nâng cao'][Math.floor(Math.random() * 3)]
        };
        setTopicProgress(mockProgress);
        localStorage.setItem(`topic_progress_${topicId}`, JSON.stringify(mockProgress));
      }
    }
  }, [topicId]);

  const getUnitProgress = (unitId) => {
    const savedProgress = localStorage.getItem(`unit_progress_${unitId}`);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    const mockProgress = {
      level: ['Cơ bản', 'Trung bình', 'Nâng cao'][Math.floor(Math.random() * 3)],
      completed: Math.floor(Math.random() * 100),
      questionsAnswered: Math.floor(Math.random() * 20)
    };
    
    localStorage.setItem(`unit_progress_${unitId}`, JSON.stringify(mockProgress));
    return mockProgress;
  };

  const handleOverviewTest = () => {
    // Tạo test tổng quan cho topic này
    const topicQuestions = mockData.mockQuestions.filter(q => q.topicId === topicId);
    const selectedQuestions = topicQuestions.slice(0, 20); // Lấy 20 câu đầu
    
    // Lưu test data vào localStorage
    const testData = {
      id: `overview_${topicId}_${Date.now()}`,
      name: `Test tổng quan - ${topic?.name}`,
      questions: selectedQuestions,
      topicId: topicId,
      type: 'overview'
    };
    
    localStorage.setItem('current_test', JSON.stringify(testData));
    navigate('/test-taking');
  };

  const handleUnitPractice = (unitId) => {
    navigate(`/luyen-sau/${topicId}/${unitId}`);
  };

  const handleTopicReview = () => {
    navigate(`/luyen-sau/on-tap/${topicId}`);
  };

  if (!topic) {
    return (
      <div className="topic-detail-page">
        <div className="loading-state">
          <p>Đang tải thông tin chuyên đề...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-detail-page">
      {/* Header */}
      <div className="topic-detail-header">
        <div className="topic-info">
          <h1 className="topic-name">{topic.name}</h1>
          <div className="topic-meta">
            <span className="level-badge">{topicProgress.level}</span>
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${topicProgress.completed}%` }}
                ></div>
              </div>
              <span className="progress-text">{topicProgress.completed}% hoàn thành</span>
            </div>
          </div>
          <p className="topic-description">{topic.description}</p>
        </div>
        
        <div className="topic-actions">
          <button 
            className="overview-test-btn"
            onClick={handleOverviewTest}
          >
            <span className="btn-icon">📝</span>
            Làm test tổng quan
          </button>
          
          <button 
            className="topic-review-btn"
            onClick={handleTopicReview}
          >
            <span className="btn-icon">📚</span>
            Ôn tập chuyên đề
          </button>
        </div>
      </div>

      {/* Units List */}
      <div className="units-section">
        <h2 className="section-title">Danh sách bài học ({units.length} bài)</h2>
        {units.length === 0 ? (
          <div className="no-units">
            <p>Không tìm thấy bài học nào cho chuyên đề này.</p>
            <p>Topic ID: {topicId}</p>
            <p>Available units: {mockData.mockUnits.map(u => `${u.id}(${u.topicId})`).join(', ')}</p>
          </div>
        ) : (
          <div className="units-grid">
          {units.map((unit, index) => {
            const unitProgress = getUnitProgress(unit.id);
            return (
              <div key={unit.id} className="unit-card">
                <div className="unit-header">
                  <div className="unit-number">Bài {index + 1}</div>
                  <span className="unit-level-badge">{unitProgress.level}</span>
                </div>
                
                <div className="unit-content">
                  <h3 className="unit-name">{unit.name}</h3>
                  <p className="unit-description">{unit.description}</p>
                  
                  <div className="unit-stats">
                    <div className="stat-item">
                      <span className="stat-label">Tiến độ:</span>
                      <span className="stat-value">{unitProgress.completed}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Câu đã làm:</span>
                      <span className="stat-value">{unitProgress.questionsAnswered}/20</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="practice-btn"
                  onClick={() => handleUnitPractice(unit.id)}
                >
                  <span className="btn-icon">🎯</span>
                  Luyện tập
                </button>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;