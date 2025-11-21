import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BubbleProperties } from '../utils/physics';
import { useStockStore } from '../stores/stockStore';
import '../shaders/bubbleShader'; // Import to register the shader

interface StockBubbleProps {
    ticker: string;
    position: [number, number, number];
    properties: BubbleProperties;
    onClick?: () => void;
}

export function StockBubble({ ticker, position, properties, onClick }: StockBubbleProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { showLabels, wave } = useStockStore();

    // Create color objects once
    const color = useMemo(() => new THREE.Color(properties.color), [properties.color]);
    const glowColor = useMemo(() => new THREE.Color(properties.glowColor), [properties.glowColor]);
    const heatColor = useMemo(() => new THREE.Color(properties.heatColor), [properties.heatColor]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
            // Lerp colors for smooth transitions if properties change
            materialRef.current.uColor.lerp(color, 0.1);
            materialRef.current.uGlowColor.lerp(glowColor, 0.1);
            materialRef.current.uHeatColor.lerp(heatColor, 0.1);
            materialRef.current.uOpacity = properties.opacity;

            // Synesthetic properties
            materialRef.current.uRoughness = properties.roughness;
            materialRef.current.uDensity = properties.density;
            materialRef.current.uHeatIntensity = properties.heatIntensity;

            // Wave uniforms
            materialRef.current.uWaveActive = wave.active ? 1.0 : 0.0;
            if (wave.active) {
                materialRef.current.uWaveCenter.set(wave.center[0], wave.center[1], wave.center[2]);
                materialRef.current.uWaveTime = (Date.now() / 1000) - wave.startTime;
            }
        }

        if (meshRef.current) {
            // Smooth hover scale effect
            const targetScale = isHovered ? 1.2 : 1.0;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={onClick}
                onPointerOver={() => {
                    setIsHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setIsHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <sphereGeometry args={[properties.size, 32, 32]} />
                {/* @ts-ignore */}
                <bubbleShaderMaterial
                    ref={materialRef}
                    transparent
                    uColor={color}
                    uGlowColor={glowColor}
                    uHeatColor={heatColor}
                    uOpacity={properties.opacity}
                    uFresnelBias={0.1}
                    uFresnelScale={1.0}
                    uFresnelPower={2.0}
                    uRoughness={properties.roughness}
                    uDensity={properties.density}
                    uHeatIntensity={properties.heatIntensity}
                />
            </mesh>

            {/* Label */}
            {showLabels && (
                <Text
                    position={[0, properties.size + 2, 0]}
                    fontSize={properties.size * 0.8}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.05}
                    outlineColor="#000000"
                >
                    {ticker}
                </Text>
            )}

            {/* Tooltip (HTML Overlay) */}
            {isHovered && (
                <Html distanceFactor={100} position={[0, properties.size + 5, 0]} style={{ pointerEvents: 'none' }}>
                    <div className="glass-panel" style={{
                        padding: '10px',
                        borderRadius: '8px',
                        width: '200px',
                        textAlign: 'left',
                        fontSize: '12px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white'
                    }}>
                        <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{ticker}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Price:</span>
                            <span style={{ fontWeight: 'bold' }}>${properties.price.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Change:</span>
                            <span style={{ color: properties.change_pct >= 0 ? '#4ade80' : '#f87171' }}>
                                {properties.change_pct > 0 ? '+' : ''}{properties.change_pct.toFixed(2)}%
                            </span>
                        </div>
                        <div style={{ marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Rule of 40:</span>
                                <span style={{ color: '#fbbf24' }}>{properties.rule_of_40.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}
