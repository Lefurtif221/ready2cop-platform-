import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

function Home() {
  return <div style={{ padding: 40, textAlign: 'center' }}><h1>Home - Ready2Cop</h1></div>;
}

function Collections() {
  return <div style={{ padding: 40, textAlign: 'center' }}><h1>Collections</h1></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </BrowserRouter>
  );
}
