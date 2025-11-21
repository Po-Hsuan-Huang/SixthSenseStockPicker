import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            bubbleShaderMaterial: Object3DNode<THREE.ShaderMaterial, typeof THREE.ShaderMaterial> & {
                uColor?: THREE.Color;
                uGlowColor?: THREE.Color;
                uOpacity?: number;
                uFresnelBias?: number;
                uFresnelScale?: number;
                uFresnelPower?: number;
                uTime?: number;
            };
        }
    }
}
