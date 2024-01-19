import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav'; // Import your Nav component if you have one
import Refresh from './pages/Refresh';
import Collection from './pages/Collection';
import Creation from './pages/Creation';
import BasePage from './pages/BasePage';


const App = () => {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<BasePage />} />
          <Route path="/refresh" element={<Refresh />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/creation" element={<Creation />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;