import React from 'react';
import { useParams } from 'react-router-dom';

const TestResult = () => {
  const { testId } = useParams();

  return (
    <div className="test-result-page">
      <h1>Kết Quả Kiểm Tra</h1>
      <p>Kết quả bài kiểm tra ID: {testId}</p>
    </div>
  );
};

export default TestResult;