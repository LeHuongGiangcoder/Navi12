import React from 'react';
import { useParams } from 'react-router-dom';

const UnitPractice = () => {
  const { topicId, unitId } = useParams();

  return (
    <div className="unit-practice-page">
      <h1>Luyện Tập Đơn Vị</h1>
      <p>Luyện tập chủ đề ID: {topicId}, đơn vị ID: {unitId}</p>
    </div>
  );
};

export default UnitPractice;