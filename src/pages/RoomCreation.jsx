import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';
import '../styles/global.css';

const RoomCreation = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState(mockData.mockFriends || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendPhone, setNewFriendPhone] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.phone.includes(searchTerm)
  );

  // Generate random room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle adding new friend
  const handleAddFriend = () => {
    if (newFriendPhone.trim() && newFriendPhone.length >= 10) {
      const newFriend = {
        id: `friend_${Date.now()}`,
        name: `Bạn ${newFriendPhone.slice(-4)}`,
        phone: newFriendPhone,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        isOnline: Math.random() > 0.5
      };
      
      setFriends([...friends, newFriend]);
      setNewFriendPhone('');
      setShowAddFriendModal(false);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Handle inviting friend
  const handleInviteFriend = (friend) => {
    if (!selectedFriends.find(f => f.id === friend.id)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  // Handle removing invited friend
  const handleRemoveInvited = (friendId) => {
    setSelectedFriends(selectedFriends.filter(f => f.id !== friendId));
  };

  // Handle creating new room
  const handleCreateRoom = () => {
    const roomCode = generateRoomCode();
    navigate(`/phong/${roomCode}`);
  };

  return (
    <div className="room-creation-container">
      <div className="room-creation-header">
        <h1>Tạo Phòng Thi Đấu</h1>
        <p>Mời bạn bè và tạo phòng thi đấu mới</p>
      </div>

      {/* Section 1: Friend List */}
      <div className="friends-section">
        <div className="section-header">
          <h2>Danh sách bạn bè</h2>
          <button 
            className="add-friend-btn"
            onClick={() => setShowAddFriendModal(true)}
          >
            + Thêm bạn bè
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm bạn (theo tên hoặc số điện thoại)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Friends List */}
        <div className="friends-list">
          {filteredFriends.map(friend => (
            <div key={friend.id} className="friend-card">
              <div className="friend-info">
                <div className="avatar-container">
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                  {friend.isOnline && <div className="online-badge"></div>}
                </div>
                <div className="friend-details">
                  <h3>{friend.name}</h3>
                  <p>{friend.phone}</p>
                  {friend.isOnline && <span className="online-text">Online</span>}
                </div>
              </div>
              <button 
                className="invite-btn"
                onClick={() => handleInviteFriend(friend)}
                disabled={selectedFriends.find(f => f.id === friend.id)}
              >
                {selectedFriends.find(f => f.id === friend.id) ? 'Đã mời' : 'Mời'}
              </button>
            </div>
          ))}
        </div>

        {/* Selected Friends */}
        {selectedFriends.length > 0 && (
          <div className="selected-friends">
            <h3>Đã mời ({selectedFriends.length})</h3>
            <div className="selected-list">
              {selectedFriends.map(friend => (
                <div key={friend.id} className="selected-friend">
                  <img src={friend.avatar} alt={friend.name} />
                  <span>{friend.name}</span>
                  <button onClick={() => handleRemoveInvited(friend.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Create Room */}
      <div className="create-room-section">
        <button 
          className="create-room-btn"
          onClick={handleCreateRoom}
        >
          🏆 Tạo phòng mới
        </button>
      </div>

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm bạn bè</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddFriendModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Số điện thoại:</label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại..."
                value={newFriendPhone}
                onChange={(e) => setNewFriendPhone(e.target.value)}
                className="phone-input"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddFriendModal(false)}
              >
                Hủy
              </button>
              <button 
                className="submit-btn"
                onClick={handleAddFriend}
                disabled={!newFriendPhone.trim() || newFriendPhone.length < 10}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          ✅ Đã thêm bạn!
        </div>
      )}
    </div>
  );
};

export default RoomCreation;