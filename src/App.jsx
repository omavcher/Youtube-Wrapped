import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChannelInput from './pages/ChannelInput';
import WrappedVideo from './pages/WrappedVideo';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="container">
          <Routes>
            <Route path="/" element={<ChannelInput />} />
            <Route path="/input" element={<ChannelInput />} />
            <Route path="/wrapped" element={<WrappedVideo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
