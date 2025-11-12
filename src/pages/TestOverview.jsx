import React, { useState } from 'react';
import { mockTests } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const TestOverview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('THPT');

  // Mock user stats
  const userStats = {
    highestScore: 85,
    testsCompleted: 12,
    averageCorrectRate: 78,
    completionPercentage: 65
  };

  // Mock completed tests (in real app, this would come from user data)
  const completedTests = ['test_001', 'test_004', 'test_006', 'test_008', 'test_012'];

  // Filter and sort tests based on active tab
  const filteredTests = mockTests
    .filter(test => test.examType === activeTab)
    .sort((a, b) => {
      const aCompleted = completedTests.includes(a.id);
      const bCompleted = completedTests.includes(b.id);
      if (aCompleted && !bCompleted) return -1;
      if (!aCompleted && bCompleted) return 1;
      return 0;
    });

  const examTypes = {
    THPT: 'Kì thi Tốt nghiệp THPT',
    HSA: 'Kì thi HSA'
  };

  const handleTakeTest = (testId) => {
    navigate(`/kiem-tra/${testId}/lam-bai`);
  };

  const handleReviewTest = (testId) => {
    navigate(`/kiem-tra/${testId}/ket-qua`);
  };

  const getTestStatus = (testId) => {
    return completedTests.includes(testId) ? 'completed' : 'not-completed';
  };

  const getTestStatusText = (testId) => {
    return completedTests.includes(testId) ? 'Đã làm' : 'Chưa làm';
  };

  return (
    <div className="test-overview-page">
      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <button
          className={`secondary-tab ${activeTab === 'THPT' ? 'active' : ''}`}
          onClick={() => setActiveTab('THPT')}
        >
          {examTypes.THPT}
        </button>
        <button
          className={`secondary-tab ${activeTab === 'HSA' ? 'active' : ''}`}
          onClick={() => setActiveTab('HSA')}
        >
          {examTypes.HSA}
        </button>
      </div>

      <div className="test-overview-header">
        <h1>Tổng quan bài kiểm tra</h1>
        <p>Theo dõi tiến độ học tập và thực hành với các bài kiểm tra</p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{userStats.highestScore}%</div>
              <div className="stat-label">Điểm cao nhất</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{userStats.testsCompleted}</div>
              <div className="stat-label">Bài đã hoàn thành</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{userStats.averageCorrectRate}%</div>
              <div className="stat-label">Tỷ lệ đúng trung bình</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{userStats.completionPercentage}%</div>
              <div className="stat-label">Tiến độ hoàn thành</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${userStats.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test List by Exam Type */}
      <div className="test-list-section">
        <h2>Danh sách bài kiểm tra {examTypes[activeTab]}</h2>
        
        <div className="test-grid">
          {filteredTests.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-card-header">
                <h4 className="test-name">{test.name}</h4>
                <div className="test-badges">
                  <span className={`status-badge ${getTestStatus(test.id)}`}>
                    {getTestStatusText(test.id)}
                  </span>
                </div>
              </div>
              
              <div className="test-meta">
                <div className="meta-item">
                  <span className="meta-icon">📝</span>
                  <span>{test.questionCount} câu hỏi</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>{test.duration} phút</span>
                </div>
              </div>
              
              <div className="test-actions">
                <button 
                  className="practice-btn"
                  onClick={() => handleTakeTest(test.id)}
                >
                  Làm bài
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleReviewTest(test.id)}
                >
                  Xem lại
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestOverview;