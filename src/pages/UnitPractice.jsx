import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';

const UnitPractice = () => {
  const { topicId, unitId } = useParams();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState(null);
  const [unit, setUnit] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [note, setNote] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    // Tìm topic và unit
    const foundTopic = mockData.mockTopics.find(t => t.id === topicId);
    const foundUnit = mockData.mockUnits.find(u => u.id === unitId);
    
    if (foundTopic && foundUnit) {
      setTopic(foundTopic);
      setUnit(foundUnit);
      
      // Lấy 20 câu hỏi của unit này
      const unitQuestions = mockData.mockQuestions
        .filter(q => q.unitId === unitId)
        .slice(0, 20);
      
      setQuestions(unitQuestions);
      
      // Load saved progress nếu có
      const savedProgress = localStorage.getItem(`practice_${unitId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCurrentQuestionIndex(progress.currentIndex || 0);
        setUserAnswers(progress.answers || []);
      }
    }
  }, [topicId, unitId]);

  useEffect(() => {
    // Load note cho câu hỏi hiện tại
    if (questions[currentQuestionIndex]) {
      const questionId = questions[currentQuestionIndex].id;
      const savedNote = localStorage.getItem(`notes_${questionId}`);
      setNote(savedNote || '');
    }
  }, [currentQuestionIndex, questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswered(true);
    
    // Lưu câu trả lời
    const newAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer
    };
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setUserAnswers(updatedAnswers);
    
    // Lưu progress
    const progress = {
      currentIndex: currentQuestionIndex,
      answers: updatedAnswers
    };
    localStorage.setItem(`practice_${unitId}`, JSON.stringify(progress));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
    } else {
      // Hoàn thành unit
      setShowCompletion(true);
      
      // Tính điểm
      const correctCount = userAnswers.filter(a => a?.isCorrect).length;
      
      // Lưu kết quả
      const attemptId = `attempt_${unitId}_${Date.now()}`;
      const result = {
        id: attemptId,
        unitId,
        topicId,
        questions: questions.length,
        correct: correctCount,
        answers: userAnswers,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(result));
      
      // Cập nhật unit progress
      const unitProgress = {
        level: ['Cơ bản', 'Trung bình', 'Nâng cao'][Math.floor(Math.random() * 3)],
        completed: Math.min(100, ((correctCount / questions.length) * 100) + Math.floor(Math.random() * 20)),
        questionsAnswered: questions.length
      };
      localStorage.setItem(`unit_progress_${unitId}`, JSON.stringify(unitProgress));
    }
  };

  const handleSaveNote = () => {
    if (currentQuestion) {
      localStorage.setItem(`notes_${currentQuestion.id}`, note);
    }
  };

  const handleShareQuestion = () => {
    const shareUrl = `${window.location.origin}/cau-hoi/${currentQuestion.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Đã copy link câu hỏi vào clipboard!');
    });
  };

  const handleReviewAnswers = () => {
    const attemptId = `attempt_${unitId}_${Date.now()}`;
    navigate(`/luyen-sau/review/${attemptId}`);
  };

  const handlePracticeOtherUnit = () => {
    navigate(`/luyen-sau/${topicId}`);
  };

  if (!topic || !unit || questions.length === 0) {
    return (
      <div className="unit-practice-page">
        <div className="loading-state">
          <p>Đang tải bài luyện tập...</p>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    const correctCount = userAnswers.filter(a => a?.isCorrect).length;
    
    return (
      <div className="unit-practice-page">
        <div className="completion-modal">
          <div className="completion-content">
            <h2>🎉 Đã hoàn thành!</h2>
            <p className="completion-score">
              Bạn làm đúng <strong>{correctCount}/{questions.length}</strong> câu
            </p>
            <div className="completion-actions">
              <button 
                className="review-btn"
                onClick={handleReviewAnswers}
              >
                Xem lại bài làm
              </button>
              <button 
                className="continue-btn"
                onClick={handlePracticeOtherUnit}
              >
                Luyện unit khác
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unit-practice-page">
      {/* Header - Breadcrumb */}
      <div className="practice-header">
        <div className="breadcrumb">
          <span 
            className="breadcrumb-item clickable"
            onClick={() => navigate(`/luyen-sau/${topicId}`)}
          >
            {topic.name}
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item current">{unit.name}</span>
        </div>
        
        <div className="progress-indicator">
          <span className="question-counter">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main - Question */}
      <div className="practice-main">
        <div className="question-section">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <div 
                key={key}
                className={`option-item ${
                  selectedAnswer === key ? 'selected' : ''
                } ${
                  isAnswered ? (
                    key === currentQuestion.correctAnswer ? 'correct' : 
                    key === selectedAnswer ? 'incorrect' : ''
                  ) : ''
                }`}
                onClick={() => handleAnswerSelect(key)}
              >
                <div className="option-label">{key}</div>
                <div className="option-text">{value}</div>
                {isAnswered && key === currentQuestion.correctAnswer && (
                  <div className="correct-icon">✓</div>
                )}
                {isAnswered && key === selectedAnswer && key !== currentQuestion.correctAnswer && (
                  <div className="incorrect-icon">✗</div>
                )}
              </div>
            ))}
          </div>
          
          {!isAnswered ? (
            <button 
              className="submit-answer-btn"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Trả lời
            </button>
          ) : (
            <div className="answer-feedback">
              <div className={`result-badge ${userAnswers[currentQuestionIndex]?.isCorrect ? 'correct' : 'incorrect'}`}>
                {userAnswers[currentQuestionIndex]?.isCorrect ? '✓ Đúng' : '✗ Sai'}
              </div>
              
              <div className="explanation">
                <h4>Giải thích:</h4>
                <p>{currentQuestion.explanation}</p>
              </div>
              
              <div className="note-section">
                <h4>Ghi chú:</h4>
                <textarea
                  className="note-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thêm ghi chú cho câu hỏi này..."
                  rows={3}
                />
                <button className="save-note-btn" onClick={handleSaveNote}>
                  Lưu ghi chú
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Actions */}
      {isAnswered && (
        <div className="practice-footer">
          <button 
            className="share-btn"
            onClick={handleShareQuestion}
          >
            <span className="btn-icon">🔗</span>
            Share câu hỏi
          </button>
          
          <button 
            className="next-btn"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            <span className="btn-icon">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitPractice;