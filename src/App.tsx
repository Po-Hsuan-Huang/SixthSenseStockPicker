import { Header, TabNavigation } from './components/Header';
import { RadarView } from './components/RadarView';
import { ClassicView } from './components/ClassicView';
import { LearnView } from './components/LearnView';
import { useStockData } from './hooks/useStockData';
import { useStockStore } from './stores/stockStore';
import './index.css';

function App() {
  const { viewMode } = useStockStore();

  // Fetch stock data on mount and set up auto-refresh
  useStockData();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e27' }}>
      <Header />
      <TabNavigation />

      <main style={{ padding: '1rem' }}>
        {viewMode === 'radar' && <RadarView />}
        {viewMode === 'classic' && <ClassicView />}
        {viewMode === 'learn' && <LearnView />}
      </main>

      {/*Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0', fontSize: '0.9rem' }}>
        <p style={{ margin: '0' }}>
          Made with ✨ by transforming abstract data into intuitive experiences
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Powered by React + Three.js | Real-time 3D Physics Simulation
        </p>
      </footer>
    </div>
  );
}

export default App;
