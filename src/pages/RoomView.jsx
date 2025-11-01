import React from 'react';
import { useParams } from 'react-router-dom';

const RoomView = () => {
  const { roomId } = useParams();

  return (
    <div className="room-view-page">
      <h1>Xem Phòng</h1>
      <p>Đang xem phòng ID: {roomId}</p>
    </div>
  );
};

export default RoomView;