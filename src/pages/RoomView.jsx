import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockData from '../data/mockData';
import '../styles/global.css';

const RoomView = () => {
  const { roomId } = useParams();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [countdown, setCountdown] = useState(15);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Mock room members
  const [members] = useState([
    {
      id: "member_001",
      name: "Bạn",
      avatar: "https://i.pravatar.cc/150?img=10",
      isHost: true
    },
    {
      id: "member_002", 
      name: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/150?img=1",
      isHost: false
    }
  ]);

  // Mock comparison data
  const [comparisonData] = useState({
    user1: {
      name: "Bạn",
      score: 85,
      time: "45:30",
      topicScores: {
        "Hàm số và đồ thị": 90,
        "Nguyên hàm tích phân": 80,
        "Số phức": 85,
        "Hình học không gian": 85
      }
    },
    user2: {
      name: "Nguyễn Văn An", 
      score: 78,
      time: "52:15",
      topicScores: {
        "Hàm số và đồ thị": 75,
        "Nguyên hàm tích phân": 85,
        "Số phức": 70,
        "Hình học không gian": 82
      }
    }
  });

  // Copy room link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép link phòng!');
  };

  // Start countdown
  const handleStart = () => {
    if (!selectedGoal) {
      alert('Vui lòng chọn mục tiêu!');
      return;
    }
    
    if (selectedGoal === 'test' && !selectedTest) {
      alert('Vui lòng chọn bài test!');
      return;
    }
    
    if (selectedGoal === 'practice' && !selectedUnit) {
      alert('Vui lòng chọn unit luyện tập!');
      return;
    }

    setIsStarted(true);
    setTimeLeft(countdown * 60); // Convert minutes to seconds
  };

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted) {
      setIsStarted(false);
      alert('Hết thời gian!');
    }
    
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="room-view-container">
      {/* Header */}
      <div className="room-header">
        <div className="room-info">
          <h1 className="room-code">Phòng: {roomId}</h1>
          <button className="copy-link-btn" onClick={handleCopyLink}>
            📋 Copy link
          </button>
        </div>
        
        <div className="members-list">
          <h3>Thành viên ({members.length})</h3>
          <div className="member-avatars">
            {members.map(member => (
              <div key={member.id} className="member-avatar">
                <img src={member.avatar} alt={member.name} />
                <span className="member-name">{member.name}</span>
                {member.isHost && <span className="host-badge">Host</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-row">
          <div className="control-group">
            <label>Chọn mục tiêu:</label>
            <select 
              value={selectedGoal} 
              onChange={(e) => setSelectedGoal(e.target.value)}
              disabled={isStarted}
            >
              <option value="">-- Chọn mục tiêu --</option>
              <option value="test">Làm test</option>
              <option value="practice">Luyện sâu</option>
            </select>
          </div>

          {selectedGoal === 'test' && (
            <div className="control-group">
              <label>Chọn test:</label>
              <select 
                value={selectedTest} 
                onChange={(e) => setSelectedTest(e.target.value)}
                disabled={isStarted}
              >
                <option value="">-- Chọn test --</option>
                {mockData.mockTests.map(test => (
                  <option key={test.id} value={test.id}>
                    {test.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGoal === 'practice' && (
            <div className="control-group">
              <label>Chọn unit:</label>
              <select 
                value={selectedUnit} 
                onChange={(e) => setSelectedUnit(e.target.value)}
                disabled={isStarted}
              >
                <option value="">-- Chọn unit --</option>
                {mockData.mockUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="control-row">
          <div className="control-group">
            <label>Countdown (phút):</label>
            <input
              type="number"
              min="1"
              max="180"
              value={countdown}
              onChange={(e) => setCountdown(parseInt(e.target.value) || 15)}
              disabled={isStarted}
            />
          </div>

          <div className="control-group">
            <label>Mic:</label>
            <button 
              className={`mic-toggle ${micEnabled ? 'enabled' : 'disabled'}`}
              onClick={() => setMicEnabled(!micEnabled)}
            >
              {micEnabled ? '🎤' : '🔇'} {micEnabled ? 'Mở Mic' : 'Tắt Mic'}
            </button>
          </div>

          <div className="control-group">
            <button 
              className="start-btn"
              onClick={handleStart}
              disabled={isStarted}
            >
              {isStarted ? 'Đang diễn ra...' : 'Bắt đầu'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="main-area">
        {isStarted ? (
          <div className="active-session">
            <div className="timer-display">
              <h2>Thời gian còn lại: {formatTime(timeLeft)}</h2>
            </div>
            <div className="content-area">
              {selectedGoal === 'test' && selectedTest && (
                <div className="test-content">
                  <h3>Đang làm: {mockData.mockTests.find(t => t.id === selectedTest)?.name}</h3>
                  <p>Nội dung bài test sẽ hiển thị ở đây...</p>
                </div>
              )}
              {selectedGoal === 'practice' && selectedUnit && (
                <div className="practice-content">
                  <h3>Đang luyện: {mockData.mockUnits.find(u => u.id === selectedUnit)?.name}</h3>
                  <p>Nội dung luyện tập sẽ hiển thị ở đây...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="waiting-area">
            <h2>Chờ bắt đầu...</h2>
            <p>Vui lòng chọn mục tiêu và nhấn "Bắt đầu" để bắt đầu phiên học.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="room-footer">
        <button 
          className="compare-btn"
          onClick={() => setShowCompareModal(true)}
        >
          📊 Đối chiếu kết quả
        </button>
      </div>

      {/* Compare Results Modal */}
      {showCompareModal && (
        <div className="modal-overlay">
          <div className="modal-content compare-modal">
            <div className="modal-header">
              <h3>Đối chiếu kết quả</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCompareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="comparison-container">
                <div className="user-comparison">
                  <div className="user-stats">
                    <h4>{comparisonData.user1.name}</h4>
                    <div className="stats">
                      <p><strong>Điểm:</strong> {comparisonData.user1.score}/100</p>
                      <p><strong>Thời gian:</strong> {comparisonData.user1.time}</p>
                    </div>
                  </div>
                  <div className="vs-divider">VS</div>
                  <div className="user-stats">
                    <h4>{comparisonData.user2.name}</h4>
                    <div className="stats">
                      <p><strong>Điểm:</strong> {comparisonData.user2.score}/100</p>
                      <p><strong>Thời gian:</strong> {comparisonData.user2.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="topic-comparison">
                  <h4>So sánh % đúng theo chuyên đề</h4>
                  <div className="chart-container">
                    {Object.keys(comparisonData.user1.topicScores).map(topic => (
                      <div key={topic} className="topic-row">
                        <div className="topic-name">{topic}</div>
                        <div className="score-bars">
                          <div className="score-bar">
                            <div className="bar user1" style={{width: `${comparisonData.user1.topicScores[topic]}%`}}>
                              {comparisonData.user1.topicScores[topic]}%
                            </div>
                          </div>
                          <div className="score-bar">
                            <div className="bar user2" style={{width: `${comparisonData.user2.topicScores[topic]}%`}}>
                              {comparisonData.user2.topicScores[topic]}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomView;