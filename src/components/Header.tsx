import { useStockStore } from '../stores/stockStore';
import type { ViewMode } from '../stores/stockStore';

export function Header() {
    return (
        <header style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '1.5rem',
            zIndex: 10,
            textAlign: 'left',
            pointerEvents: 'none' // Allow clicking through to canvas
        }}>
            <h1
                style={{
                    margin: '0 0 0.5rem 0',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '2rem',
                    fontWeight: '700',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    lineHeight: '1.2'
                }}
            >
                🌌 Stock Omniverse
            </h1>
            <p style={{ color: '#a0aec0', margin: '0 0 1rem 0', fontSize: '0.9rem', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                Experience stocks through AI's sixth sense
            </p>
            <TabNavigation />
        </header>
    );
}

export function TabNavigation() {
    const { viewMode, setViewMode } = useStockStore();

    const tabs: { value: ViewMode; label: string }[] = [
        { value: 'radar', label: '🌌 Omniverse View' },
        { value: 'classic', label: '📊 Rule of 40 Classic' },
        { value: 'learn', label: '📖 Learn' },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0',
            marginTop: '1rem',
            pointerEvents: 'auto' // Re-enable pointer events for buttons
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setViewMode(tab.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid',
                        borderColor: viewMode === tab.value ? '#667eea' : 'rgba(102, 126, 234, 0.3)',
                        backgroundColor: viewMode === tab.value ? 'rgba(45, 53, 97, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                        color: '#f0f0f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: viewMode === tab.value ? '600' : '400',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
