import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export function ValueCore() {
    const ring1Ref = useRef<Mesh>(null);
    const ring2Ref = useRef<Mesh>(null);
    const coreRef = useRef<Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Rotate rings
        if (ring1Ref.current) {
            ring1Ref.current.rotation.z = time * 0.1;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.z = -time * 0.15;
        }

        // Pulse core
        if (coreRef.current) {
            const pulse = 1 + Math.sin(time * 2) * 0.1;
            coreRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            {/* Center glowing core */}
            <mesh ref={coreRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#667eea"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Concentric rings */}
            <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[12, 12.3, 64]} />
                <meshBasicMaterial
                    color="#667eea"
                    transparent
                    opacity={0.15}
                />
            </mesh>

            <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[20, 20.3, 64]} />
                <meshBasicMaterial
                    color="#764ba2"
                    transparent
                    opacity={0.1}
                />
            </mesh>

            {/* "VALUE CORE" label */}
            <mesh position={[0, 0, 0]}>
                <circleGeometry args={[1.5, 32]} />
                <meshBasicMaterial
                    color="#667eea"
                    transparent
                    opacity={0.1}
                />
            </mesh>
        </group>
    );
}
