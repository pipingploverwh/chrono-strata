import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SpatialAudioCADProps {
  spectralData: { low: number; mid: number; high: number };
  temperature: number;
  isPlaying: boolean;
}

// DJ Console inspired by the chrome/metallic aesthetic
const DJConsole = ({ spectralData }: { spectralData: { low: number; mid: number; high: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={[0, -0.8, 0]}>
      {/* Main chrome body - elongated capsule shape */}
      <RoundedBox args={[4, 0.5, 1.2]} radius={0.2} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.95} 
          roughness={0.05}
          envMapIntensity={2}
        />
      </RoundedBox>
      
      {/* Brass/gold pedestal */}
      <RoundedBox args={[0.8, 0.3, 0.6]} radius={0.05} smoothness={4} position={[0, -0.35, 0]}>
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.9} 
          roughness={0.1}
        />
      </RoundedBox>
      
      {/* Left turntable */}
      <Turntable position={[-1.2, 0.3, 0]} spinning={spectralData.low > 0.2} intensity={spectralData.low} />
      
      {/* Right turntable */}
      <Turntable position={[1.2, 0.3, 0]} spinning={spectralData.high > 0.2} intensity={spectralData.high} />
      
      {/* Center mixer section */}
      <MixerSection position={[0, 0.35, 0]} spectralData={spectralData} />
      
      {/* Vinyl crates */}
      <VinylCrate position={[-1.8, 0.4, 0]} />
      <VinylCrate position={[1.8, 0.4, 0]} />
    </group>
  );
};

const Turntable = ({ position, spinning, intensity }: { position: [number, number, number]; spinning: boolean; intensity: number }) => {
  const platterRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (platterRef.current && spinning) {
      platterRef.current.rotation.y += delta * 2 * (0.5 + intensity);
    }
  });
  
  return (
    <group position={position}>
      {/* Turntable base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
      </mesh>
      
      {/* Platter */}
      <mesh ref={platterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.9} />
      </mesh>
      
      {/* Vinyl grooves effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[0.1, 0.38, 32, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
      </mesh>
      
      {/* Label center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#2a4a6a" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
};

const MixerSection = ({ position, spectralData }: { position: [number, number, number]; spectralData: { low: number; mid: number; high: number } }) => {
  return (
    <group position={position}>
      {/* Mixer surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.8]} />
        <meshStandardMaterial color="#151515" metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Fader channels */}
      {[-0.3, 0, 0.3].map((x, i) => {
        const val = i === 0 ? spectralData.low : i === 1 ? spectralData.mid : spectralData.high;
        return (
          <group key={i} position={[x, 0.02, 0.15]}>
            <mesh>
              <boxGeometry args={[0.08, 0.02, 0.4]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
            <mesh position={[0, 0.02, -0.15 + val * 0.3]}>
              <boxGeometry args={[0.06, 0.03, 0.08]} />
              <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      })}
      
      {/* Knobs */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.04, -0.2]}>
          <cylinderGeometry args={[0.03, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const VinylCrate = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Vinyl records stack */}
      {[0, 0.02, 0.04, 0.06, 0.08].map((z, i) => (
        <mesh key={i} position={[0, 0, -0.2 + z * 3]} rotation={[0.1 * (i - 2), 0.05 * i, 0]}>
          <boxGeometry args={[0.02, 0.32, 0.32]} />
          <meshStandardMaterial 
            color={['#3a2a1a', '#2a3a4a', '#4a2a3a', '#2a4a3a', '#3a3a2a'][i]} 
            metalness={0.1} 
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};

// Spatial audio particles orbiting in 3D space
const SpatialParticles = ({ spectralData, temperature }: { spectralData: { low: number; mid: number; high: number }; temperature: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      const theta = (i / 200) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      const y = (Math.random() - 0.5) * 2;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0.2;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1 * (1 + spectralData.mid);
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < 200; i++) {
        // Pulsate based on frequency
        const baseY = positions[i * 3 + 1];
        positions[i * 3 + 1] = baseY + Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * spectralData.low * 0.1;
        
        // Color based on temperature
        const t = (temperature - 20) / 50;
        colors[i * 3] = 0.3 + t * 0.7; // R
        colors[i * 3 + 1] = 0.2 + (1 - t) * 0.3; // G
        colors[i * 3 + 2] = 0.1; // B
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

// Sound wave rings emanating from console
const SoundWaveRings = ({ spectralData }: { spectralData: { low: number; mid: number; high: number } }) => {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 - i * 0.5) * spectralData.low * 0.3;
        mesh.scale.set(scale, scale, scale);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.3 - i * 0.08;
      });
    }
  });
  
  return (
    <group ref={ringsRef} position={[0, 0, 0]}>
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 64]} />
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.3 - i * 0.08} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// Frequency spectrum bars in 3D
const SpectrumBars3D = ({ spectralData }: { spectralData: { low: number; mid: number; high: number } }) => {
  const barsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (barsRef.current) {
      const values = [spectralData.low, spectralData.mid, spectralData.high];
      barsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const targetScale = 0.1 + values[i % 3] * 1.5;
        mesh.scale.y += (targetScale - mesh.scale.y) * 0.2;
      });
    }
  });
  
  return (
    <group ref={barsRef} position={[0, 1.5, 0]}>
      {[-0.4, 0, 0.4].map((x, i) => (
        <Float key={i} speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[x, 0, 0]}>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshStandardMaterial
              color={i === 0 ? '#ff4444' : i === 1 ? '#44ff44' : '#4444ff'}
              metalness={0.6}
              roughness={0.3}
              emissive={i === 0 ? '#ff4444' : i === 1 ? '#44ff44' : '#4444ff'}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// CAD grid floor
const CADGrid = () => {
  return (
    <group position={[0, -1.2, 0]}>
      <gridHelper args={[10, 20, '#333', '#222']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export const SpatialAudioCAD = ({ spectralData, temperature, isPlaying }: SpatialAudioCADProps) => {
  return (
    <div className="w-full h-full relative">
      {/* CAD technical overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-white/40 tracking-wider">
        <div>SPATIAL_AUDIO_v2.1</div>
        <div>RENDER: REAL-TIME</div>
        <div>FREQ: L:{(spectralData.low * 100).toFixed(0)} M:{(spectralData.mid * 100).toFixed(0)} H:{(spectralData.high * 100).toFixed(0)}</div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-white/40 tracking-wider text-right">
        <div>THERMAL: {temperature.toFixed(1)}°C</div>
        <div>STATUS: {isPlaying ? 'ACTIVE' : 'STANDBY'}</div>
      </div>
      
      {/* Corner markers */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-white/20" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-white/20" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-white/20" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-white/20" />
      
      <Canvas camera={{ position: [4, 3, 4], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 15]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5e0" />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#e0f0ff" />
        <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff6b35" />
        
        <DJConsole spectralData={spectralData} />
        <SpatialParticles spectralData={spectralData} temperature={temperature} />
        <SoundWaveRings spectralData={spectralData} />
        <SpectrumBars3D spectralData={spectralData} />
        <CADGrid />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={10}
          autoRotate={isPlaying}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SpatialAudioCAD;
