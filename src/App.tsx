import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AppPage from './pages/AppPage';
import Drafts from './pages/Drafts';
import Templates from './pages/Templates';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
