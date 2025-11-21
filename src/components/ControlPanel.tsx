import { useStockStore } from '../stores/stockStore';
import type { FilterMode } from '../stores/stockStore';

export function ControlPanel() {
    const {
        filterMode,
        setFilterMode,
        gravityStrength,
        setGravityStrength,
        timeSpeed,
        setTimeSpeed,
        collisionsEnabled,
        setCollisionsEnabled,
        physicsEnabled,
        setPhysicsEnabled,
        showLabels,
        setShowLabels,
    } = useStockStore();

    const filterButtons: { mode: FilterMode; label: string }[] = [
        { mode: 'all', label: 'All Stocks' },
        { mode: 'gainers', label: 'Top Gainers' },
        { mode: 'most-traded', label: 'Most Traded' },
        { mode: 'best-value', label: 'Best Value' },
    ];

    return (
        <div
            style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(26, 26, 46, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '12px',
                minWidth: '250px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                color: '#f0f0f0',
            }}
        >
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚙️ Controls</h4>

            {/* Filter buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0aec0' }}>
                    Filter:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {filterButtons.map((button) => (
                        <button
                            key={button.mode}
                            onClick={() => setFilterMode(button.mode)}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid',
                                borderColor: filterMode === button.mode ? '#667eea' : '#2d3561',
                                backgroundColor: filterMode === button.mode ? '#2d3561' : 'transparent',
                                color: '#f0f0f0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time speed slider */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a0aec0' }}>
                    Time Speed: {timeSpeed.toFixed(2)}x
                </label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={timeSpeed}
                    onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Gravity slider */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
                        Gravity: {(gravityStrength * 100).toFixed(0)}%
                    </label>
                    {Math.abs(gravityStrength - 0.05) < 0.005 && (
                        <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>⚖️ Equilibrium</span>
                    )}
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="range"
                        min="0"
                        max="0.1"
                        step="0.005"
                        value={gravityStrength}
                        onChange={(e) => setGravityStrength(parseFloat(e.target.value))}
                        style={{ width: '100%', position: 'relative', zIndex: 2 }}
                    />
                    {/* Tick mark at 0.05 (center of 0-0.1) */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '2px',
                            height: '12px',
                            backgroundColor: '#4ade80',
                            zIndex: 1,
                            opacity: 0.7
                        }}
                    />
                </div>
            </div>

            {/* Toggle switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={physicsEnabled}
                        onChange={(e) => setPhysicsEnabled(e.target.checked)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Physics Simulation</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={collisionsEnabled}
                        onChange={(e) => setCollisionsEnabled(e.target.checked)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Collisions</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={(e) => setShowLabels(e.target.checked)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>Show Labels</span>
                </label>
            </div>
        </div>
    );
}
