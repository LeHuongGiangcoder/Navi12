import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home.jsx';
import TestOverview from './pages/TestOverview.jsx';
import TestTaking from './pages/TestTaking.jsx';
import TestResult from './pages/TestResult.jsx';
import TopicList from './pages/TopicList.jsx';
import TopicReview from './pages/TopicReview.jsx';
import TopicDetail from './pages/TopicDetail.jsx';
import UnitPractice from './pages/UnitPractice.jsx';
import Tournament from './pages/Tournament.jsx';
import RoomCreation from './pages/RoomCreation.jsx';
import RoomView from './pages/RoomView.jsx';

// Import layout components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Import styles
import './styles/global.css';
import './styles/tokens.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Trang chủ */}
            <Route path="/" element={<Home />} />
            
            {/* Kiểm tra */}
            <Route path="/kiem-tra" element={<TestOverview />} />
            <Route path="/kiem-tra/:testId/lam-bai" element={<TestTaking />} />
            <Route path="/kiem-tra/:testId/ket-qua" element={<TestResult />} />
            
            {/* Luyện sâu */}
            <Route path="/luyen-sau" element={<TopicList />} />
            <Route path="/luyen-sau/on-tap" element={<TopicReview />} />
            <Route path="/luyen-sau/:topicId" element={<TopicDetail />} />
            <Route path="/luyen-sau/:topicId/:unitId" element={<UnitPractice />} />
            
            {/* Thi đấu */}
            <Route path="/thi-dau" element={<Tournament />} />
            <Route path="/tao-phong" element={<RoomCreation />} />
            <Route path="/phong/:roomId" element={<RoomView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
