import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const BubbleShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(0.0, 0.0, 0.0),
        uGlowColor: new THREE.Color(0.0, 1.0, 0.0),
        uOpacity: 1.0,
        uFresnelBias: 0.1,
        uFresnelScale: 1.0,
        uFresnelPower: 2.0,
    },
    // Vertex Shader
    `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;

    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      // Subtle pulsing effect
      float pulse = 1.0 + 0.03 * sin(uTime * 2.0 + position.x * 10.0);
      gl_Position = projectionMatrix * mvPosition * vec4(pulse, pulse, pulse, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    uniform float uOpacity;
    uniform float uFresnelBias;
    uniform float uFresnelScale;
    uniform float uFresnelPower;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect calculation
      float fresnelTerm = uFresnelBias + uFresnelScale * pow(1.0 - dot(viewDir, normal), uFresnelPower);
      fresnelTerm = clamp(fresnelTerm, 0.0, 1.0);
      
      // Mix base color with glow based on fresnel
      vec3 finalColor = mix(uColor, uGlowColor, fresnelTerm);
      
      // Add a subtle rim light boost
      finalColor += vec3(fresnelTerm * 0.5);

      gl_FragColor = vec4(finalColor, uOpacity * (0.6 + 0.4 * fresnelTerm));
    }
  `
);

extend({ BubbleShaderMaterial });

// Add type definition for the new material
declare global {
    namespace JSX {
        interface IntrinsicElements {
            bubbleShaderMaterial: any;
        }
    }
}
