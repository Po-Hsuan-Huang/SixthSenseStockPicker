import { useStockStore } from '../stores/stockStore';
import type { ViewMode } from '../stores/stockStore';

export function Header() {
    return (
        <header style={{ textAlign: 'center', padding: '2rem 1rem 1rem' }}>
            <h1
                style={{
                    margin: '0',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                }}
            >
                🌌 Synesthetic Stock Radar
            </h1>
            <p style={{ color: '#a0aec0', margin: '0.5rem 0' }}>
                Experience stocks through AI's sixth sense - where financial data becomes intuitive physics
            </p>
        </header>
    );
}

export function TabNavigation() {
    const { viewMode, setViewMode } = useStockStore();

    const tabs: { value: ViewMode; label: string }[] = [
        { value: 'radar', label: '🌌 Radar View' },
        { value: 'classic', label: '📊 Rule of 40 Classic' },
        { value: 'learn', label: '📖 Learn' },
    ];

    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', padding: '0 1rem' }}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setViewMode(tab.value)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: '1px solid',
                        borderColor: viewMode === tab.value ? '#667eea' : '#2d3561',
                        backgroundColor: viewMode === tab.value ? '#2d3561' : 'transparent',
                        color: '#f0f0f0',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: viewMode === tab.value ? '600' : '400',
                        transition: 'all 0.2s',
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
