import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
// @ts-ignore
import Home from './pages/Home';
// @ts-ignore
import TestOverview from './pages/TestOverview';
// @ts-ignore
import TestTaking from './pages/TestTaking';
// @ts-ignore
import TestResult from './pages/TestResult';
// @ts-ignore
import TopicList from './pages/TopicList';
// @ts-ignore
import TopicReview from './pages/TopicReview';
// @ts-ignore
import TopicDetail from './pages/TopicDetail';
// @ts-ignore
import UnitPractice from './pages/UnitPractice';
// @ts-ignore
import Tournament from './pages/Tournament';
// @ts-ignore
import RoomCreation from './pages/RoomCreation';
// @ts-ignore
import RoomView from './pages/RoomView';

// Import layout components
// @ts-ignore
import Navbar from './components/layout/Navbar';
// @ts-ignore
import Footer from './components/layout/Footer';

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
            <Route path="/luyen-sau/on-tap/:topicId" element={<TopicReview />} />
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
