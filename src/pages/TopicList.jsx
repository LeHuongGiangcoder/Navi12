import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTopics, mockUnits } from '../data/mockData';

const TopicList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [personalSubTab, setPersonalSubTab] = useState('completed');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Check if user has test attempts to determine section title
  const hasTestAttempts = () => {
    const keys = Object.keys(localStorage);
    return keys.some(key => key.includes('test_') && key.includes('_answers'));
  };

  // Memoize progress data to prevent re-generation on every render
  const topicProgressData = useMemo(() => {
    const progressMap = {};
    mockTopics.forEach(topic => {
      const saved = localStorage.getItem(`topic_${topic.id}_progress`);
      if (saved) {
        progressMap[topic.id] = JSON.parse(saved);
      } else {
        // Generate random progress for demo - only once per topic
        progressMap[topic.id] = {
          completed: Math.floor(Math.random() * 100),
          level: Math.floor(Math.random() * 5) + 1,
          status: ['completed', 'in-progress', 'waiting'][Math.floor(Math.random() * 3)]
        };
      }
    });
    return progressMap;
  }, []); // Empty dependency array means this only runs once

  // Get progress data from memoized map
  const getTopicProgress = (topicId) => {
    return topicProgressData[topicId];
  };

  // Filter topics based on search query
  const filteredTopics = mockTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    
    if (activeTab === 'personal') {
      const progress = getTopicProgress(topic.id);
      switch (personalSubTab) {
        case 'completed':
          return matchesSearch && progress.status === 'completed';
        case 'in-progress':
          return matchesSearch && progress.status === 'in-progress';
        case 'waiting':
          return matchesSearch && progress.status === 'waiting';
        default:
          return matchesSearch;
      }
    }
    
    return matchesSearch;
  });

  // Get units for a topic (for tooltip)
  const getTopicUnits = (topicId) => {
    return mockUnits.filter(unit => unit.topicId === topicId);
  };

  // Handle topic card hover
  const handleTopicHover = (topic, event) => {
    setHoveredTopic(topic);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  // Handle topic click
  const handleTopicClick = (topicId) => {
    navigate(`/luyen-sau/${topicId}`);
  };

  return (
    <div className="topic-list-page">
      {/* Header */}
      <div className="topic-list-header">
        <h1>Luyện sâu</h1>
        
        {/* Tabs */}
        <div className="main-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Cá nhân
          </button>
        </div>

        {/* Personal Sub-tabs */}
        {activeTab === 'personal' && (
          <div className="sub-tabs">
            <button 
              className={`sub-tab-btn ${personalSubTab === 'completed' ? 'active' : ''}`}
              onClick={() => setPersonalSubTab('completed')}
            >
              Đã hoàn thành
            </button>
            <button 
              className={`sub-tab-btn ${personalSubTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setPersonalSubTab('in-progress')}
            >
              Đang làm
            </button>
            <button 
              className={`sub-tab-btn ${personalSubTab === 'waiting' ? 'active' : ''}`}
              onClick={() => setPersonalSubTab('waiting')}
            >
              Waiting list
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm chuyên đề hoặc đơn vị kiến thức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="topic-list-content">
        <div className="section-header">
          <h2>{hasTestAttempts() ? 'Recommend for you' : 'Trending'}</h2>
          <p>Các chuyên đề phù hợp với trình độ của bạn</p>
        </div>

        {/* Topics Grid */}
        <div className="topics-grid">
          {filteredTopics.map(topic => {
            const progress = getTopicProgress(topic.id);
            return (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => handleTopicClick(topic.id)}
                onMouseEnter={(e) => handleTopicHover(topic, e)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="topic-card-content">
                  <div className="topic-header">
                    <h3 className="topic-title">{topic.name}</h3>
                    <div className="level-badge">
                      Level {progress.level}/5
                    </div>
                  </div>
                  
                  <p className="topic-description">{topic.description}</p>
                  
                  <div className="progress-section">
                    <div className="progress-info">
                      <span>Tiến độ</span>
                      <span>{progress.completed}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress.completed}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy chuyên đề nào phù hợp</p>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hoveredTopic && (
        <div 
          className="topic-tooltip"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10
          }}
        >
          <h4>Đơn vị kiến thức</h4>
          <ul>
            {getTopicUnits(hoveredTopic.id).map(unit => (
              <li key={unit.id}>{unit.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicList;