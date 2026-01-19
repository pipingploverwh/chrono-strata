import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Vinyl record configurations with different audio sources
export interface VinylRecord {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  labelColor: string;
  vinylColor: string;
  bpm: number;
  genre: string;
}

export const VINYL_COLLECTION: VinylRecord[] = [
  {
    id: 'deep-house',
    title: 'Deep Groove',
    artist: 'SoundHelix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    labelColor: '#2a4a6a',
    vinylColor: '#0a0a0a',
    bpm: 120,
    genre: 'Deep House'
  },
  {
    id: 'techno',
    title: 'Synthesized',
    artist: 'SoundHelix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    labelColor: '#6a2a4a',
    vinylColor: '#1a0a0a',
    bpm: 128,
    genre: 'Techno'
  },
  {
    id: 'ambient',
    title: 'Atmospheric',
    artist: 'SoundHelix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    labelColor: '#2a6a4a',
    vinylColor: '#0a1a0a',
    bpm: 90,
    genre: 'Ambient'
  },
  {
    id: 'electro',
    title: 'Electric Dreams',
    artist: 'SoundHelix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    labelColor: '#6a4a2a',
    vinylColor: '#1a1a0a',
    bpm: 135,
    genre: 'Electro'
  },
  {
    id: 'breakbeat',
    title: 'Break It Down',
    artist: 'SoundHelix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    labelColor: '#4a2a6a',
    vinylColor: '#0a0a1a',
    bpm: 140,
    genre: 'Breakbeat'
  },
];

// Camera preset configurations
const CAMERA_PRESETS = {
  default: { position: [4, 3, 4], target: [0, 0, 0], label: 'DEFAULT', icon: '◇' },
  topDown: { position: [0, 8, 0.01], target: [0, 0, 0], label: 'TOP', icon: '⬡' },
  side: { position: [8, 0.5, 0], target: [0, 0, 0], label: 'SIDE', icon: '▭' },
  front: { position: [0, 1, 8], target: [0, 0, 0], label: 'FRONT', icon: '▯' },
  isometric: { position: [5, 5, 5], target: [0, 0, 0], label: 'ISO', icon: '◈' },
  closeup: { position: [2, 1.5, 2], target: [0, -0.3, 0], label: 'CLOSE', icon: '◉' },
} as const;

type CameraPreset = keyof typeof CAMERA_PRESETS;

// Smooth camera controller component
const CameraController = ({ 
  activePreset, 
  isPlaying 
}: { 
  activePreset: CameraPreset; 
  isPlaying: boolean;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosition = useRef(new THREE.Vector3(4, 3, 4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(0);

  useEffect(() => {
    const preset = CAMERA_PRESETS[activePreset];
    targetPosition.current.set(...(preset.position as [number, number, number]));
    targetLookAt.current.set(...(preset.target as [number, number, number]));
    isTransitioning.current = true;
    transitionProgress.current = 0;
  }, [activePreset]);

  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      transitionProgress.current += delta * 1.5;
      const t = Math.min(transitionProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      camera.position.lerp(targetPosition.current, eased * 0.08);
      controlsRef.current.target.lerp(targetLookAt.current, eased * 0.08);
      controlsRef.current.update();

      if (t >= 1) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} 
      enableZoom={true} 
      minDistance={2} 
      maxDistance={12}
      autoRotate={isPlaying && !isTransitioning.current}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping
    />
  );
};

interface SpatialAudioCADProps {
  spectralData: { low: number; mid: number; high: number };
  temperature: number;
  isPlaying: boolean;
  selectedVinyl?: VinylRecord;
  onVinylSelect?: (vinyl: VinylRecord) => void;
}

// DJ Console with dynamic vinyl colors
const DJConsole = ({ 
  spectralData, 
  selectedVinyl,
  onVinylSelect 
}: { 
  spectralData: { low: number; mid: number; high: number };
  selectedVinyl?: VinylRecord;
  onVinylSelect?: (vinyl: VinylRecord) => void;
}) => {
  const leftRecords = VINYL_COLLECTION.slice(0, 3);
  const rightRecords = VINYL_COLLECTION.slice(3);
  
  return (
    <group position={[0, -0.8, 0]}>
      <RoundedBox args={[4, 0.5, 1.2]} radius={0.2} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.95} 
          roughness={0.05}
          envMapIntensity={2}
        />
      </RoundedBox>
      
      <RoundedBox args={[0.8, 0.3, 0.6]} radius={0.05} smoothness={4} position={[0, -0.35, 0]}>
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.9} 
          roughness={0.1}
        />
      </RoundedBox>
      
      <Turntable 
        position={[-1.2, 0.3, 0]} 
        spinning={spectralData.low > 0.2} 
        intensity={spectralData.low}
        labelColor={selectedVinyl?.labelColor || '#2a4a6a'}
      />
      
      <Turntable 
        position={[1.2, 0.3, 0]} 
        spinning={spectralData.high > 0.2} 
        intensity={spectralData.high}
        labelColor={selectedVinyl?.labelColor || '#2a4a6a'}
      />
      
      <MixerSection position={[0, 0.35, 0]} spectralData={spectralData} />
      
      <VinylCrate 
        position={[-1.8, 0.4, 0]} 
        records={leftRecords}
        selectedVinyl={selectedVinyl}
        onVinylSelect={onVinylSelect}
      />
      <VinylCrate 
        position={[1.8, 0.4, 0]} 
        records={rightRecords}
        selectedVinyl={selectedVinyl}
        onVinylSelect={onVinylSelect}
      />
    </group>
  );
};

const Turntable = ({ 
  position, 
  spinning, 
  intensity,
  labelColor = '#2a4a6a'
}: { 
  position: [number, number, number]; 
  spinning: boolean; 
  intensity: number;
  labelColor?: string;
}) => {
  const platterRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (platterRef.current && spinning) {
      platterRef.current.rotation.y += delta * 2 * (0.5 + intensity);
    }
  });
  
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
      </mesh>
      
      <mesh ref={platterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.9} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[0.1, 0.38, 32, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color={labelColor} metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
};

const MixerSection = ({ position, spectralData }: { position: [number, number, number]; spectralData: { low: number; mid: number; high: number } }) => {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.8]} />
        <meshStandardMaterial color="#151515" metalness={0.4} roughness={0.6} />
      </mesh>
      
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
      
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.04, -0.2]}>
          <cylinderGeometry args={[0.03, 0.035, 0.02, 16]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// Interactive Vinyl Crate with selectable records
const VinylCrate = ({ 
  position, 
  records, 
  selectedVinyl,
  onVinylSelect
}: { 
  position: [number, number, number]; 
  records: VinylRecord[];
  selectedVinyl?: VinylRecord;
  onVinylSelect?: (vinyl: VinylRecord) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <group position={position}>
      {records.map((record, i) => {
        const isSelected = selectedVinyl?.id === record.id;
        const isHovered = hoveredIndex === i;
        const pullOut = isSelected ? 0.15 : isHovered ? 0.08 : 0;
        
        return (
          <group
            key={record.id}
            position={[pullOut, 0, -0.2 + i * 0.08]}
            rotation={[0.08 * (i - 1), 0.03 * i, 0]}
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
            onClick={() => onVinylSelect?.(record)}
          >
            <mesh>
              <boxGeometry args={[0.02, 0.32, 0.32]} />
              <meshStandardMaterial 
                color={record.labelColor}
                metalness={0.1} 
                roughness={0.9}
                emissive={isSelected ? record.labelColor : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            
            <mesh position={[0.015, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.01, 32]} />
              <meshStandardMaterial 
                color={record.vinylColor}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            
            {isSelected && (
              <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.15, 0.005, 8, 32]} />
                <meshBasicMaterial color="#ff6b35" transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Spatial audio particles
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
        const baseY = positions[i * 3 + 1];
        positions[i * 3 + 1] = baseY + Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * spectralData.low * 0.1;
        
        const t = (temperature - 20) / 50;
        colors[i * 3] = 0.3 + t * 0.7;
        colors[i * 3 + 1] = 0.2 + (1 - t) * 0.3;
        colors[i * 3 + 2] = 0.1;
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

// Sound wave rings
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

export const SpatialAudioCAD = ({ 
  spectralData, 
  temperature, 
  isPlaying,
  selectedVinyl,
  onVinylSelect 
}: SpatialAudioCADProps) => {
  const [activePreset, setActivePreset] = useState<CameraPreset>('default');

  return (
    <div className="w-full h-full relative">
      {/* CAD technical overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-white/40 tracking-wider">
        <div>SPATIAL_AUDIO_v2.1</div>
        <div>RENDER: REAL-TIME</div>
        <div>FREQ: L:{(spectralData.low * 100).toFixed(0)} M:{(spectralData.mid * 100).toFixed(0)} H:{(spectralData.high * 100).toFixed(0)}</div>
      </div>
      
      {/* Camera Preset Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <div className="font-mono text-[9px] text-white/30 tracking-widest mb-1">CAMERA_VIEW</div>
        <div className="flex flex-wrap gap-1 max-w-[180px] justify-end">
          {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setActivePreset(preset)}
              className={`
                font-mono text-[9px] px-2 py-1.5 border transition-all duration-300
                ${activePreset === preset 
                  ? 'bg-orange-500/20 border-orange-500/60 text-orange-400' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30 hover:text-white/70'
                }
              `}
            >
              <span className="mr-1">{CAMERA_PRESETS[preset].icon}</span>
              {CAMERA_PRESETS[preset].label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Vinyl Selection Panel */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[320px]">
        <div className="font-mono text-[9px] text-white/30 tracking-widest mb-2">VINYL_SELECT</div>
        <div className="flex flex-wrap gap-1.5">
          {VINYL_COLLECTION.map((vinyl) => (
            <button
              key={vinyl.id}
              onClick={() => onVinylSelect?.(vinyl)}
              className={`
                group relative font-mono text-[8px] px-2 py-2 border transition-all duration-300
                ${selectedVinyl?.id === vinyl.id 
                  ? 'bg-orange-500/20 border-orange-500/60' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                }
              `}
            >
              {/* Vinyl disc icon */}
              <div 
                className="w-6 h-6 rounded-full mb-1 mx-auto relative"
                style={{ backgroundColor: vinyl.vinylColor }}
              >
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: vinyl.labelColor }}
                />
                {selectedVinyl?.id === vinyl.id && (
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-pulse" />
                )}
              </div>
              <div className={`text-center truncate ${selectedVinyl?.id === vinyl.id ? 'text-orange-400' : 'text-white/50'}`}>
                {vinyl.title}
              </div>
              <div className="text-center text-white/30 text-[7px]">{vinyl.bpm} BPM</div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                <div className="text-white/80">{vinyl.artist}</div>
                <div className="text-white/50">{vinyl.genre}</div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Current track info */}
        {selectedVinyl && (
          <div className="mt-3 p-2 border border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full relative flex-shrink-0"
                style={{ 
                  backgroundColor: selectedVinyl.vinylColor,
                  animation: isPlaying ? 'spin 2s linear infinite' : 'none'
                }}
              >
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedVinyl.labelColor }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-white/80 truncate">{selectedVinyl.title}</div>
                <div className="text-[8px] text-white/40 truncate">{selectedVinyl.artist} • {selectedVinyl.genre}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-white/40 tracking-wider text-right">
        <div>THERMAL: {temperature.toFixed(1)}°C</div>
        <div>STATUS: {isPlaying ? 'ACTIVE' : 'STANDBY'}</div>
        <div className="text-white/20 mt-1">VIEW: {CAMERA_PRESETS[activePreset].label}</div>
        {selectedVinyl && (
          <div className="text-orange-400/60 mt-1">TRACK: {selectedVinyl.bpm} BPM</div>
        )}
      </div>
      
      {/* Corner markers */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-white/20" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-white/20" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-white/20" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-white/20" />
      
      {/* Transition indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-orange-500/30 rounded-full" />
        </div>
      </div>
      
      <Canvas camera={{ position: [4, 3, 4], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 15]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5e0" />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#e0f0ff" />
        <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff6b35" />
        
        <DJConsole 
          spectralData={spectralData} 
          selectedVinyl={selectedVinyl}
          onVinylSelect={onVinylSelect}
        />
        <SpatialParticles spectralData={spectralData} temperature={temperature} />
        <SoundWaveRings spectralData={spectralData} />
        <SpectrumBars3D spectralData={spectralData} />
        <CADGrid />
        
        <CameraController activePreset={activePreset} isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
};

export default SpatialAudioCAD;