import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTests, mockQuestions } from '../data/mockData';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  // Find the test data
  const test = mockTests.find(t => t.id === testId);
  
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(test ? test.duration * 60 : 5400); // Convert minutes to seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Get questions for this test
  const questions = test ? test.questions.map(qId => mockQuestions.find(q => q.id === qId)).filter(Boolean) : [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage based on answered questions
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  // Navigation functions
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

  // Submit test
  const handleSubmitTest = () => {
    // In real app, save answers to backend
    navigate(`/kiem-tra/${testId}/ket-qua`, {
      state: {
        answers: selectedAnswers,
        timeSpent: (test.duration * 60) - timeRemaining,
        test: test
      }
    });
  };

  const confirmSubmit = () => {
    setShowSubmitModal(true);
  };

  // Get question status for navigator
  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    if (selectedAnswers[index]) return 'answered';
    return 'unanswered';
  };

  if (!test || questions.length === 0) {
    return (
      <div className="test-taking-page">
        <div className="error-message">
          <h2>Không tìm thấy bài kiểm tra</h2>
          <p>Bài kiểm tra không tồn tại hoặc đã bị xóa.</p>
          <button onClick={() => navigate('/kiem-tra')} className="btn-primary">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-taking-page">
      {/* Fixed Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-info">
            <h2 className="test-title">{test.name}</h2>
            <div className="progress-info">
              <span>Câu {currentQuestionIndex + 1}/{questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span>{answeredCount}/{questions.length} đã làm ({Math.round(progressPercentage)}%)</span>
            </div>
          </div>
          <div className="timer">
            <span className="timer-icon">⏰</span>
            <span className={`timer-text ${timeRemaining < 300 ? 'warning' : ''}`}>
              {formatTime(timeRemaining)}
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
  );
};

export default TestTaking;