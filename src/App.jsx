import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import TestOverview from './pages/TestOverview';
import TestTaking from './pages/TestTaking';
import TestResult from './pages/TestResult';
import TopicList from './pages/TopicList';
import TopicReview from './pages/TopicReview';
import TopicDetail from './pages/TopicDetail';
import UnitPractice from './pages/UnitPractice';
import Tournament from './pages/Tournament';
import RoomCreation from './pages/RoomCreation';
import RoomView from './pages/RoomView';

// Import layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import global styles
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />
            
            {/* Test routes */}
            <Route path="/kiem-tra" element={<TestOverview />} />
            <Route path="/kiem-tra/:testId" element={<TestTaking />} />
            <Route path="/kiem-tra/:testId/ket-qua" element={<TestResult />} />
            
            {/* Topic routes */}
            <Route path="/luyen-sau" element={<TopicList />} />
            <Route path="/luyen-sau/review" element={<TopicReview />} />
            <Route path="/luyen-sau/:topicId" element={<TopicDetail />} />
            <Route path="/luyen-sau/:topicId/:unitId" element={<UnitPractice />} />
            
            {/* Tournament routes */}
            <Route path="/thi-dau" element={<Tournament />} />
            
            {/* Room routes */}
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