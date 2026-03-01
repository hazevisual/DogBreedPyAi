import { Navigate, Route, Routes } from 'react-router-dom';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demo" replace />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="*" element={<Navigate to="/demo" replace />} />
    </Routes>
  );
}
