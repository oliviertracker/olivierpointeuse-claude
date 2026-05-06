import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import SummaryScreen from './screens/SummaryScreen';
import './App.css';

type Tab = 'home' | 'summary';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="app">
      <header className="app-header">
        <span>{tab === 'home' ? 'Ma Pointeuse' : 'Récapitulatif'}</span>
      </header>

      <main className="app-main">
        {tab === 'home' ? <HomeScreen /> : <SummaryScreen />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-btn ${tab === 'home' ? 'active' : ''}`}
          onClick={() => setTab('home')}
        >
          <span className="nav-icon">⏱</span>
          <span className="nav-label">Pointeuse</span>
        </button>
        <button
          className={`nav-btn ${tab === 'summary' ? 'active' : ''}`}
          onClick={() => setTab('summary')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Résumé</span>
        </button>
      </nav>
    </div>
  );
}
