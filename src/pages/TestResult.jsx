import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { mockTests, mockQuestions } from '../data/mockData';

const TestResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [notes, setNotes] = useState({});

  // Get topic name helper
  const getTopicName = (topicId) => {
    const topicNames = {
      'topic_001': 'Hàm số',
      'topic_002': 'Nguyên hàm',
      'topic_003': 'Số phức',
      'topic_004': 'Hình học'
    };
    return topicNames[topicId] || 'Chưa xác định';
  };

  // Get test data
  const test = mockTests.find(t => t.id === testId);
  const selectedAnswers = JSON.parse(localStorage.getItem(`test_${testId}_answers`) || '{}');
  
  // Get questions for this test
  const testQuestions = test?.questions?.map(qId => 
    mockQuestions.find(q => q.id === qId)
  ).filter(Boolean) || [];

  // Calculate results
  const totalQuestions = testQuestions.length;
  const correctAnswers = testQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer);
  const incorrectAnswers = testQuestions.filter(q => selectedAnswers[q.id] && selectedAnswers[q.id] !== q.correctAnswer);
  const unansweredQuestions = testQuestions.filter(q => !selectedAnswers[q.id]);
  
  const score = (correctAnswers.length / totalQuestions) * 10;
  const correctCount = correctAnswers.length;
  const incorrectCount = incorrectAnswers.length;

  // Group questions by topic for radar chart
  const topicStats = {};
  testQuestions.forEach(question => {
    const topicId = question.topicId;
    if (!topicStats[topicId]) {
      topicStats[topicId] = {
        name: getTopicName(topicId),
        total: 0,
        correct: 0
      };
    }
    topicStats[topicId].total++;
    if (selectedAnswers[question.id] === question.correctAnswer) {
      topicStats[topicId].correct++;
    }
  });

  // Prepare radar chart data
  const radarData = Object.values(topicStats).map(topic => ({
    subject: topic.name,
    percentage: Math.round((topic.correct / topic.total) * 100)
  }));

  // Handle note changes
  const handleNoteChange = (questionId, note) => {
    const newNotes = { ...notes, [questionId]: note };
    setNotes(newNotes);
    localStorage.setItem(`test_${testId}_notes`, JSON.stringify(newNotes));
  };

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(`test_${testId}_notes`) || '{}');
    setNotes(savedNotes);
  }, [testId]);

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  if (!test) {
    return (
      <div className="test-result-page">
        <div className="error-message">Không tìm thấy bài kiểm tra</div>
      </div>
    );
  }

  return (
    <div className="test-result-page">
      <div className="result-header">
        <button className="back-button" onClick={() => navigate('/kiem-tra')}>
          ← Quay lại
        </button>
        <h1>Kết Quả Kiểm Tra: {test.name}</h1>
      </div>

      <div className="result-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Tổng quan kiến thức
        </button>
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Chi tiết bài kiểm tra
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="knowledge-overview">
            <h2>Tổng quan kiến thức</h2>
            
            <div className="radar-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }}
                  />
                  <Radar
                    name="Phần trăm đúng"
                    dataKey="percentage"
                    stroke="#9BC2F7"
                    fill="#9BC2F7"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="topic-details-table">
              <table>
                <thead>
                  <tr>
                    <th>Chuyên đề</th>
                    <th>Kết quả</th>
                    <th>% Đúng</th>
                    <th>Level</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(topicStats).map(([topicId, stats]) => {
                    const percentage = Math.round((stats.correct / stats.total) * 100);
                    const level = Math.ceil(percentage / 20) || 1; // 5 levels: 1-20%, 21-40%, 41-60%, 61-80%, 81-100%
                    
                    return (
                      <tr key={topicId}>
                        <td>{stats.name}</td>
                        <td className="result-fraction">
                          <span className="correct-count">{stats.correct}</span>
                          <span className="separator">/</span>
                          <span className="total-count">{stats.total}</span>
                        </td>
                        <td className="percentage">
                          {percentage}%
                        </td>
                        <td className="level-indicator">
                          <div className="level-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span 
                                key={star} 
                                className={`star ${star <= level ? 'filled' : 'empty'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="level-text">Level {level}</span>
                        </td>
                        <td>
                          <button 
                            className="practice-button-subtle"
                            onClick={() => navigate(`/chu-de/${topicId}/luyen-tap`)}
                          >
                            Luyện tập
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="details-tab">
          <div className="test-overview">
            <h2>Overview bài kiểm tra</h2>
            
            <div className="overview-grid">
              <div className="score-section">
                <div className="score-display">
                  <div className="big-score">
                    {score.toFixed(1)}/10
                  </div>
                  <div className="score-label">Điểm bài kiểm tra</div>
                  <div className="top-rank">Kết quả của bạn thuộc top 10%</div>
                </div>
              </div>

              <div className="info-section">
                <div className="meta-cards">
                  <div className="meta-card">
                    <div className="meta-label">Thời gian làm bài</div>
                    <div className="meta-value">90 phút</div>
                  </div>
                  <div className="meta-card">
                    <div className="meta-label">Số câu đúng</div>
                    <div className="meta-value">{correctCount}/{totalQuestions}</div>
                  </div>
                </div>
              </div>

              <div className="questions-navigator">
                <h3>Danh sách câu hỏi</h3>
                <div className="question-grid">
                  {testQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const isAnswered = !!userAnswer;
                    
                    let statusClass = 'unanswered';
                    if (isAnswered) {
                      statusClass = isCorrect ? 'correct' : 'incorrect';
                    }
                    
                    return (
                      <div
                        key={question.id}
                        className={`question-nav-btn ${statusClass}`}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
                
                <div className="navigator-legend">
                  <div className="legend-item">
                    <span className="legend-color correct"></span>
                    <span>Đúng</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color incorrect"></span>
                    <span>Sai</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color unanswered"></span>
                    <span>Chưa làm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="test-details">
            <h2>Chi tiết bài làm</h2>
            
            <div className="questions-accordion">
              {testQuestions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                const userAnswer = selectedAnswers[question.id];
                const isExpanded = expandedQuestions.has(question.id);
                
                return (
                  <div key={question.id} className="question-accordion-item">
                    <div 
                      className="question-header"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="question-title">
                        <span>Câu {index + 1}: {question.question.substring(0, 80)}...</span>
                        <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? 'Đúng' : 'Sai'}
                        </span>
                      </div>
                      <div className="expand-icon">
                        {isExpanded ? '−' : '+'}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="question-body">
                        <div className="question-content">
                          <div className="question-number">
                            Câu {index + 1}
                          </div>
                          <div className="question-text">
                            {question.question}
                          </div>
                          
                          <div className="answer-options">
                            {Object.entries(question.options).map(([optionLetter, optionText]) => {
                              const isUserChoice = userAnswer === optionLetter;
                              const isCorrectOption = question.correctAnswer === optionLetter;
                              
                              let className = 'answer-option';
                              if (isCorrectOption) className += ' correct-answer';
                              if (isUserChoice && !isCorrectOption) className += ' incorrect-answer';
                              if (isUserChoice) className += ' user-selected';
                              
                              return (
                                <div key={optionLetter} className={className}>
                                  <span className="option-label">{optionLetter}.</span>
                                  <span className="option-text">{optionText}</span>
                                  <div className="answer-indicators">
                                    {isCorrectOption && <span className="correct-indicator">✓ Đáp án đúng</span>}
                                    {isUserChoice && <span className="user-indicator">← Bạn đã chọn</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {!isCorrect && question.explanation && (
                            <div className="explanation">
                              <h4>Giải thích:</h4>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                          
                          <div className="note-section">
                            <h4>Ghi chú của bạn:</h4>
                            <textarea
                              value={notes[question.id] || ''}
                              onChange={(e) => handleNoteChange(question.id, e.target.value)}
                              placeholder="Thêm ghi chú để ghi nhớ kiến thức này..."
                              rows={3}
                              className="note-textarea"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResult;