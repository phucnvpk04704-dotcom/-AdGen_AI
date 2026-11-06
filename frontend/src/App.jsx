import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { HistoryPage } from './pages/HistoryPage';
import { GuidePage } from './pages/GuidePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;

