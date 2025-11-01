import React from 'react';
import { useParams } from 'react-router-dom';

const TopicDetail = () => {
  const { topicId } = useParams();

  return (
    <div className="topic-detail-page">
      <h1>Chi Tiết Chủ Đề</h1>
      <p>Chi tiết chủ đề ID: {topicId}</p>
    </div>
  );
};

export default TopicDetail;