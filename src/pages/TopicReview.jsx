import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockData from '../data/mockData';

const TopicReview = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    // Get topic data
    if (topicId) {
      const foundTopic = mockData.mockTopics.find(t => t.id === topicId);
      setTopic(foundTopic);
      
      // Get review data from localStorage (mock data for now)
      const savedReview = localStorage.getItem(`topic_review_${topicId}`);
      if (savedReview) {
        setReviewData(JSON.parse(savedReview));
      } else {
        // Generate mock review data
        const topicQuestions = mockData.mockQuestions.filter(q => q.topicId === topicId);
        const mockReviewData = {
          totalQuestions: 20,
          correctAnswers: 15,
          totalTime: 45,
          accuracy: 75,
          questions: topicQuestions.slice(0, 20).map((q, index) => ({
            ...q,
            userAnswer: Math.random() > 0.25 ? q.correctAnswer : Object.keys(q.options)[Math.floor(Math.random() * 4)],
            isCorrect: Math.random() > 0.25,
            questionNumber: index + 1
          }))
        };
        setReviewData(mockReviewData);
        localStorage.setItem(`topic_review_${topicId}`, JSON.stringify(mockReviewData));
      }
    }

    // Load notes from localStorage
    const savedNotes = {};
    if (reviewData?.questions) {
      reviewData.questions.forEach(q => {
        const savedNote = localStorage.getItem(`note_${q.id}`);
        if (savedNote) {
          savedNotes[q.id] = savedNote;
        }
      });
    }
    setNotes(savedNotes);
  }, [topicId, reviewData?.questions?.length]);

  const handleNoteChange = (questionId, note) => {
    const newNotes = { ...notes, [questionId]: note };
    setNotes(newNotes);
    localStorage.setItem(`note_${questionId}`, note);
  };

  if (!topic || !reviewData) {
    return (
      <div className="topic-review-page">
        <div className="loading-state">
          <p>Đang tải dữ liệu ôn tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-review-page">
      {/* Section 1: Overview */}
      <div className="review-overview">
        <h1 className="page-title">Ôn tập: {topic.name}</h1>
        
        {/* Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card success">
            <div className="metric-icon">✓</div>
            <div className="metric-content">
              <div className="metric-value">{reviewData.correctAnswers}/{reviewData.totalQuestions}</div>
              <div className="metric-label">Số câu đúng</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">⏱</div>
            <div className="metric-content">
              <div className="metric-value">{reviewData.totalTime} phút</div>
              <div className="metric-label">Tổng thời gian</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">{reviewData.accuracy}%</div>
              <div className="metric-label">Độ chính xác</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${reviewData.accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View List */}
        <div className="quick-view-section">
          <h3>Tổng quan câu hỏi</h3>
          <div className="question-navigation">
            {reviewData.questions.map((question, index) => (
              <div 
                key={question.id}
                className={`question-nav-item ${question.isCorrect ? 'correct' : 'incorrect'}`}
                title={`Câu ${index + 1}: ${question.isCorrect ? 'Đúng' : 'Sai'}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Chi tiết bài làm */}
      <div className="review-details">
        <h2>Chi tiết bài làm</h2>
        
        <div className="questions-list">
          {reviewData.questions.map((question, index) => (
            <div key={question.id} className="question-review-item">
              {/* Header */}
              <div className="question-review-header">
                <h3 className="question-title">
                  Câu {index + 1}: {question.question.substring(0, 50)}...
                </h3>
                <span className={`result-badge ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                  {question.isCorrect ? 'Đúng ✓' : 'Sai ✗'}
                </span>
              </div>

              {/* Body */}
              <div className="question-review-body">
                <div className="question-full-text">
                  {question.question}
                </div>

                <div className="answer-options">
                  {Object.entries(question.options).map(([optionLetter, optionText]) => {
                    const isUserChoice = question.userAnswer === optionLetter;
                    const isCorrectOption = question.correctAnswer === optionLetter;
                    
                    let className = 'answer-option';
                    if (isCorrectOption) className += ' correct-answer';
                    if (isUserChoice && !isCorrectOption) className += ' incorrect-answer';
                    if (isUserChoice) className += ' user-selected';
                    
                    return (
                      <div key={optionLetter} className={className}>
                        <div className="option-label">{optionLetter}</div>
                        <div className="option-text">{optionText}</div>
                        {isCorrectOption && <div className="correct-icon">✓</div>}
                        {isUserChoice && !isCorrectOption && <div className="incorrect-icon">✗</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="answer-summary">
                  <div className="answer-row">
                    <span className="answer-label">Đáp án đã chọn:</span>
                    <span className={`answer-value ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                      {question.userAnswer || 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="answer-row">
                    <span className="answer-label">Đáp án đúng:</span>
                    <span className="answer-value correct">{question.correctAnswer}</span>
                  </div>
                </div>

                {question.explanation && (
                  <div className="explanation-section">
                    <h4>Giải thích:</h4>
                    <p>{question.explanation}</p>
                  </div>
                )}

                <div className="note-section">
                  <h4>Ghi chú:</h4>
                  <textarea
                    className="note-input"
                    placeholder="Thêm ghi chú cho câu hỏi này..."
                    value={notes[question.id] || ''}
                    onChange={(e) => handleNoteChange(question.id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicReview;