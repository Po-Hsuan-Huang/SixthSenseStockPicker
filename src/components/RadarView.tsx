import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { StockBubble } from './StockBubble';
import { ValueCore } from './ValueCore';
import { PhysicsEngine } from './PhysicsEngine';
import { ControlPanel } from './ControlPanel';
import { useStockStore } from '../stores/stockStore';

export function RadarView() {
    const { stocks, isLoading, error, physicsEnabled } = useStockStore();

    if (isLoading && stocks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
                <div>Loading stock data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ff6b6b' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                <div>Error: {error}</div>
                <div style={{ marginTop: '1rem', color: '#a0aec0' }}>
                    Make sure the API server is running on port 3001
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '700px' }}>
            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 50], fov: 60 }}
                style={{ background: '#0a0e27' }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />

                {/* Background stars */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Value core */}
                <ValueCore />

                {/* Stock bubbles */}
                {stocks.map((stock) => (
                    <StockBubble
                        key={stock.ticker}
                        ticker={stock.ticker}
                        position={[stock.x, stock.y, stock.z]}
                        properties={stock}
                        onClick={() => console.log('Clicked', stock.ticker)}
                    />
                ))}

                {/* Physics simulation */}
                {physicsEnabled && <PhysicsEngine />}

                {/* Camera controls */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxDistance={100}
                    minDistance={20}
                />

                {/* Post-processing effects */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        height={300}
                        intensity={1.5}
                    />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <Noise opacity={0.02} />
                </EffectComposer>
            </Canvas>

            {/* Control panel overlay */}
            <ControlPanel />

            {/* Legend */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    maxWidth: '400px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
            >
                <h4 style={{ margin: '0 0 1rem 0', color: '#f0f0f0' }}>🎨 Visual Properties</h4>
                <div style={{ color: '#a0aec0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <div>🔵 Size = Market Cap | 🎨 Color = Price Change (Blue→Red)</div>
                    <div>✨ Glow = Rule of 40 Score | 🌫️ Opacity = Debt Level</div>
                    <div style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                        📍 Bubbles are attracted to high-value stocks (bright glowing bubbles)
                    </div>
                </div>
            </div>
        </div>
    );
}
