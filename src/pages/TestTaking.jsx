import React from 'react';
import { useParams } from 'react-router-dom';

const TestTaking = () => {
  const { testId } = useParams();

  return (
    <div className="test-taking-page">
      <h1>Làm Bài Kiểm Tra</h1>
      <p>Đang làm bài kiểm tra ID: {testId}</p>
    </div>
  );
};

export default TestTaking;