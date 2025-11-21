import { Header } from './components/Header';
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
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0a0e27', overflow: 'hidden', position: 'relative' }}>
      <Header />

      <main style={{ width: '100%', height: '100%' }}>
        {viewMode === 'radar' && <RadarView />}
        {viewMode === 'classic' && <ClassicView />}
        {viewMode === 'learn' && <LearnView />}
      </main>

      {/*Footer */}
      <footer style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        padding: '1rem',
        color: 'rgba(160, 174, 192, 0.6)',
        fontSize: '0.8rem',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <p style={{ margin: '0' }}>
          Made with ✨ by transforming abstract data into intuitive experiences
        </p>
        <p style={{ margin: '0.25rem 0 0 0' }}>
          Powered by React + Three.js | Real-time 3D Physics Simulation
        </p>
      </footer>
    </div>
  );
}

export default App;
