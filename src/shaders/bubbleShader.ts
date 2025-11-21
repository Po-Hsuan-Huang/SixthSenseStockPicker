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
    uWaveCenter: new THREE.Vector3(0, 0, 0),
    uWaveTime: 0,
    uWaveActive: 0,
    // Synesthetic properties
    uRoughness: 0.0,
    uDensity: 1.0,
    uHeatIntensity: 0.0,
    uHeatColor: new THREE.Color(1.0, 0.5, 0.0),
  },
  // Vertex Shader
  `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vWaveIntensity;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform vec3 uWaveCenter;
    uniform float uWaveTime;
    uniform float uWaveActive;
    uniform float uRoughness;
    uniform float uHeatIntensity;

    // Simple 3D noise function
    float noise3D(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      vPosition = position;
      vec3 pos = position;
      
      // Add surface roughness displacement
      if (uRoughness > 0.01) {
          float noiseScale = 5.0;
          float n = noise3D(position * noiseScale + uTime * 0.1);
          float displacement = (n - 0.5) * uRoughness * 0.3;
          pos += normal * displacement;
      }
      
      // Add heat pulsing displacement
      if (uHeatIntensity > 0.3) {
          float heatPulse = sin(uTime * 3.0 * uHeatIntensity) * 0.05 * uHeatIntensity;
          pos += normal * heatPulse;
      }
      
      vNormal = normalize(normalMatrix * normalize(pos));
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      
      // Wave calculation
      float dist = distance(position, uWaveCenter);
      float waveRadius = uWaveTime * 50.0;
      float waveWidth = 10.0;
      
      float wave = 0.0;
      if (uWaveActive > 0.5) {
          float diff = abs(dist - waveRadius);
          if (diff < waveWidth) {
              wave = 1.0 - (diff / waveWidth);
              wave = smoothstep(0.0, 1.0, wave);
          }
      }
      vWaveIntensity = wave;
      
      // Subtle pulsing effect + Wave displacement
      float pulse = 1.0 + 0.03 * sin(uTime * 2.0 + position.x * 10.0);
      float waveDisplacement = wave * 0.2;
      
      gl_Position = projectionMatrix * mvPosition * vec4(pulse + waveDisplacement, pulse + waveDisplacement, pulse + waveDisplacement, 1.0);
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
    uniform float uRoughness;
    uniform float uDensity;
    uniform float uHeatIntensity;
    uniform vec3 uHeatColor;
    uniform float uTime;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vWaveIntensity;
    varying vec3 vWorldPosition;

    // Simple noise for roughness texture
    float noise3D(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect calculation
      float fresnelTerm = uFresnelBias + uFresnelScale * pow(1.0 - dot(viewDir, normal), uFresnelPower);
      fresnelTerm = clamp(fresnelTerm, 0.0, 1.0);
      
      // Base color mixing
      vec3 finalColor = mix(uColor, uGlowColor, fresnelTerm);
      
      // Add roughness texture (spiky/noisy surface for high P/E)
      if (uRoughness > 0.01) {
          float noiseVal = noise3D(vWorldPosition * 8.0);
          float roughnessEffect = mix(1.0, noiseVal, uRoughness * 0.5);
          finalColor *= roughnessEffect;
      }
      
      // Add pulsating brightness for high volume (heat effect)
      if (uHeatIntensity > 0.1) {
          float heatPulse = 0.5 + 0.5 * sin(uTime * 4.0 * uHeatIntensity);
          float brightnessBump = 1.0 + (uHeatIntensity * heatPulse * 0.3);
          finalColor *= brightnessBump;
      }
      
      // Add rim light boost
      finalColor += vec3(fresnelTerm * 0.5);
      
      // Add wave highlight
      if (vWaveIntensity > 0.01) {
          finalColor += vec3(0.5, 0.8, 1.0) * vWaveIntensity * 2.0;
      }

      // Density affects opacity (denser = more opaque)
      float densityOpacity = mix(0.5, 1.0, uDensity);
      float finalOpacity = uOpacity * densityOpacity * (0.6 + 0.4 * fresnelTerm) + vWaveIntensity * 0.5;

      gl_FragColor = vec4(finalColor, finalOpacity);
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
