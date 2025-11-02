import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTests, mockQuestions } from '../data/mockData';

const Tournament = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // 10 giây
  const [tournamentState, setTournamentState] = useState('before'); // 'before', 'during', 'after'
  const [testTimeLeft, setTestTimeLeft] = useState(90 * 60); // 90 phút = 5400 giây
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Test taking states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Get tournament test data
  const tournamentTest = mockTests.find(t => t.id === 'tournament-test');
  const questions = tournamentTest ? tournamentTest.questions.map(qId => 
    mockQuestions.find(q => q.id === qId)
  ).filter(Boolean) : [];
  const currentQuestion = questions[currentQuestionIndex];

  // Debug logging
  console.log('Tournament test found:', tournamentTest);
  console.log('Questions loaded:', questions.length);
  console.log('Current question:', currentQuestion);

  // Mock leaderboard data
  const mockLeaderboard = [
    { id: 1, name: 'Nguyễn Văn A', score: 9.5, time: '45:30', rankChange: 2, isCurrentUser: false },
    { id: 2, name: 'Trần Thị B', score: 9.2, time: '52:15', rankChange: -1, isCurrentUser: false },
    { id: 3, name: 'Lê Văn C', score: 9.0, time: '48:45', rankChange: 1, isCurrentUser: true },
    { id: 4, name: 'Phạm Thị D', score: 8.8, time: '55:20', rankChange: 0, isCurrentUser: false },
    { id: 5, name: 'Hoàng Văn E', score: 8.5, time: '60:10', rankChange: -2, isCurrentUser: false },
    { id: 6, name: 'Vũ Thị F', score: 8.3, time: '58:30', rankChange: 1, isCurrentUser: false },
    { id: 7, name: 'Đỗ Văn G', score: 8.0, time: '62:45', rankChange: 0, isCurrentUser: false },
    { id: 8, name: 'Bùi Thị H', score: 7.8, time: '65:15', rankChange: -1, isCurrentUser: false },
    { id: 9, name: 'Ngô Văn I', score: 7.5, time: '68:20', rankChange: 1, isCurrentUser: false },
    { id: 10, name: 'Lý Thị K', score: 7.2, time: '70:30', rankChange: 0, isCurrentUser: false },
    { id: 11, name: 'Trương Văn L', score: 7.0, time: '72:45', rankChange: -1, isCurrentUser: false },
    { id: 12, name: 'Phan Thị M', score: 6.8, time: '75:10', rankChange: 0, isCurrentUser: false },
    { id: 13, name: 'Đinh Văn N', score: 6.5, time: '78:20', rankChange: 1, isCurrentUser: false },
    { id: 14, name: 'Võ Thị O', score: 6.3, time: '80:15', rankChange: -1, isCurrentUser: false },
    { id: 15, name: 'Dương Văn P', score: 6.0, time: '85:30', rankChange: 0, isCurrentUser: false },
    { id: 16, name: 'Mai Thị Q', score: 5.8, time: '87:45', rankChange: 1, isCurrentUser: false },
    { id: 17, name: 'Chu Văn R', score: 5.5, time: '89:20', rankChange: -1, isCurrentUser: false },
    { id: 18, name: 'Tô Thị S', score: 5.2, time: '90:00', rankChange: 0, isCurrentUser: false },
    { id: 19, name: 'Lưu Văn T', score: 5.0, time: '90:00', rankChange: 1, isCurrentUser: false },
    { id: 20, name: 'Hồ Thị U', score: 4.8, time: '90:00', rankChange: -1, isCurrentUser: false }
  ];

  // Countdown effect
  useEffect(() => {
    if (countdown > 0 && tournamentState === 'before') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setTournamentState('during');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, tournamentState]);

  // Test timer effect
  useEffect(() => {
    if (tournamentState === 'during' && testTimeLeft > 0 && !hasSubmitted) {
      const timer = setInterval(() => {
        setTestTimeLeft(prev => {
          if (prev <= 1) {
            setHasSubmitted(true);
            setTournamentState('after');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [tournamentState, testTimeLeft, hasSubmitted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTestTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Test taking functions
  const handleAnswerSelect = (answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    if (selectedAnswers[index]) return 'answered';
    return 'unanswered';
  };

  const handleSubmitTest = () => {
    setHasSubmitted(true);
    setTournamentState('after');
    setShowSubmitModal(false);
  };

  const confirmSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleSignIn = () => {
    alert('Đã đăng ký nhận thông báo Zalo!');
  };

  const handleStartTest = () => {
    // Không navigate nữa, chỉ bắt đầu test trong component này
    setTournamentState('during');
  };

  const getRankIcon = (rankChange) => {
    if (rankChange > 0) return { icon: '↑', color: 'green' };
    if (rankChange < 0) return { icon: '↓', color: 'red' };
    return { icon: '−', color: 'gray' };
  };

  return (
    <div className="tournament-page">
      <div className="tournament-header">
        <h1>🏆 Giải Đấu Toán Học</h1>
        <p>Thách thức bản thân và cạnh tranh với các thí sinh khác</p>
      </div>

      {/* State 1: Before Tournament */}
      {tournamentState === 'before' && (
        <div className="tournament-before">
          <div className="tournament-before-content">
            <div className="countdown-section">
              <h2>Cuộc thi sắp bắt đầu!</h2>
              <div className="countdown-timer">
                <span className="countdown-label">Bắt đầu sau:</span>
                <span className="countdown-time">{formatTime(countdown)}</span>
              </div>
              <button className="sign-in-btn" onClick={handleSignIn}>
                📱 Đăng ký nhận thông báo
              </button>
            </div>
            
            <div className="tournament-info">
              <div className="info-card">
                <h3>📋 Thông tin cuộc thi</h3>
                <ul>
                  <li>⏱️ Thời gian: 90 phút</li>
                  <li>📝 Số câu hỏi: 25 câu</li>
                  <li>🎯 Chủ đề: Toán học tổng hợp</li>
                  <li>🏅 Giải thưởng: Top 3 nhận quà</li>
                </ul>
              </div>
              <button className="start-test-btn" onClick={handleStartTest}>
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 2: During Tournament */}
      {tournamentState === 'during' && !hasSubmitted && (
        <div className="tournament-during">
          {/* Test Header */}
          <div className="test-header">
            <div className="test-header-content">
              <div className="test-info">
                <h2 className="test-title">🏆 {tournamentTest?.name}</h2>
                <div className="progress-info">
                  <span>Câu {currentQuestionIndex + 1}/{questions.length}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span>{Object.keys(selectedAnswers).length}/{questions.length} đã làm</span>
                </div>
              </div>
              <div className="timer">
                <span className="timer-icon">⏰</span>
                <span className={`timer-text ${testTimeLeft < 300 ? 'warning' : ''}`}>
                  {formatTestTime(testTimeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="test-main">
            {/* Left Column - Current Question */}
            <div className="question-section">
              <div className="question-container">
                <div className="question-number">
                  Câu {currentQuestionIndex + 1}
                </div>
                <div className="question-text">
                  {currentQuestion?.question}
                </div>
                
                <div className="answer-options">
                  {currentQuestion?.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label key={key} className="answer-option">
                      <input
                        type="radio"
                        name="answer"
                        value={key}
                        checked={selectedAnswers[currentQuestionIndex] === key}
                        onChange={() => handleAnswerSelect(key)}
                      />
                      <span className="option-label">{key}.</span>
                      <span className="option-text">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Question Navigator */}
            <div className="navigator-section">
              <div className="navigator-container">
                <h3>Danh sách câu hỏi</h3>
                <div className="question-grid">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      className={`question-nav-btn ${getQuestionStatus(index)}`}
                      onClick={() => jumpToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <div className="navigator-legend">
                  <div className="legend-item">
                    <span className="legend-color current"></span>
                    <span>Câu hiện tại</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color answered"></span>
                    <span>Đã trả lời</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color unanswered"></span>
                    <span>Chưa trả lời</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="test-footer">
            <div className="test-footer-content">
              <button 
                className="btn-secondary"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </button>
              
              <div className="footer-center">
                <span>Câu {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              
              <div className="footer-right">
                <button 
                  className="btn-secondary"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Câu sau →
                </button>
                <button 
                  className="btn-submit"
                  onClick={confirmSubmit}
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>

          {/* Submit Confirmation Modal */}
          {showSubmitModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Xác nhận nộp bài</h3>
                <p>
                  Bạn đã trả lời {Object.keys(selectedAnswers).length}/{questions.length} câu hỏi.
                </p>
                <p>Bạn có chắc chắn muốn nộp bài không?</p>
                <div className="modal-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Hủy
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleSubmitTest}
                  >
                    Nộp bài
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* State 3: After Tournament */}
      {tournamentState === 'after' && (
        <div className="tournament-after">
          <div className="results-header">
            <h2>🏆 Kết quả cuộc thi</h2>
            <p>Cuộc thi đã kết thúc. Xem bảng xếp hạng dưới đây!</p>
          </div>
          
          <div className="leaderboard">
            <h3>📊 Bảng xếp hạng</h3>
            <div className="leaderboard-table">
              <div className="table-header">
                <div className="col-rank">Hạng</div>
                <div className="col-change">Thay đổi</div>
                <div className="col-name">Tên</div>
                <div className="col-score">Điểm</div>
                <div className="col-time">Thời gian</div>
              </div>
              
              {mockLeaderboard.map((user, index) => {
                const rankIcon = getRankIcon(user.rankChange);
                return (
                  <div 
                    key={user.id} 
                    className={`table-row ${user.isCurrentUser ? 'current-user' : ''}`}
                  >
                    <div className="col-rank">#{index + 1}</div>
                    <div className="col-change">
                      <span 
                        className="rank-icon" 
                        style={{ color: rankIcon.color }}
                      >
                        {rankIcon.icon}
                      </span>
                    </div>
                    <div className="col-name">{user.name}</div>
                    <div className="col-score">{user.score}</div>
                    <div className="col-time">{user.time}</div>
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

export default Tournament;