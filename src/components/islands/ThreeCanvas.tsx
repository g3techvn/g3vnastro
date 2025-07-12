import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// Floating chair component
function FloatingChair() {
  const chairRef = useRef<THREE.Group>(null);
  const chairRef2 = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (chairRef.current) {
      chairRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      chairRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (chairRef2.current) {
      chairRef2.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      chairRef2.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <>
      {/* Main Chair */}
      <group ref={chairRef} position={[2, 0, 0]}>
        {/* Chair base */}
        <Cylinder args={[0.8, 0.8, 0.2, 8]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#2563eb" />
        </Cylinder>
        
        {/* Chair stem */}
        <Cylinder args={[0.15, 0.15, 1.2, 8]} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
        
        {/* Chair seat */}
        <Box args={[1.2, 0.2, 1.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
        
        {/* Chair back */}
        <Box args={[1.2, 1.5, 0.2]} position={[0, 0.8, -0.5]}>
          <meshStandardMaterial color="#1e40af" />
        </Box>
        
        {/* Armrests */}
        <Box args={[0.2, 0.8, 0.8]} position={[-0.6, 0.4, 0]}>
          <meshStandardMaterial color="#1e40af" />
        </Box>
        <Box args={[0.2, 0.8, 0.8]} position={[0.6, 0.4, 0]}>
          <meshStandardMaterial color="#1e40af" />
        </Box>
      </group>

      {/* Secondary Chair */}
      <group ref={chairRef2} position={[-2.5, 0, 1]} scale={0.8}>
        {/* Chair base */}
        <Cylinder args={[0.8, 0.8, 0.2, 8]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#10b981" />
        </Cylinder>
        
        {/* Chair stem */}
        <Cylinder args={[0.15, 0.15, 1.2, 8]} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
        
        {/* Chair seat */}
        <Box args={[1.2, 0.2, 1.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#34d399" />
        </Box>
        
        {/* Chair back */}
        <Box args={[1.2, 1.5, 0.2]} position={[0, 0.8, -0.5]}>
          <meshStandardMaterial color="#059669" />
        </Box>
        
        {/* Armrests */}
        <Box args={[0.2, 0.8, 0.8]} position={[-0.6, 0.4, 0]}>
          <meshStandardMaterial color="#059669" />
        </Box>
        <Box args={[0.2, 0.8, 0.8]} position={[0.6, 0.4, 0]}>
          <meshStandardMaterial color="#059669" />
        </Box>
      </group>
    </>
  );
}

// Floating particles
function FloatingParticles() {
  const particleCount = 50;
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />

      {/* Main content */}
      <FloatingChair />
      <FloatingParticles />
      
      {/* Subtle orbit controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main component
export default function ThreeCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
    </div>
  );
} 