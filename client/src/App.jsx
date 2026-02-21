import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Threats from './pages/Threats';
import Quarantine from './pages/Quarantine';
import Monitor from './pages/Monitor';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/quarantine" element={<Quarantine />} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </Layout>
  );
}

export default App;
