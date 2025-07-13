import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles component
function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 0.2 + 0.1,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
      {particles.map((particle, i) => (
        <group key={i} position={particle.position as [number, number, number]}>
          <mesh scale={particle.scale}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
    </instancedMesh>
  );
}

// Simple 3D office chair
function OfficeChair() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5}>
      <group ref={groupRef} position={[2, 0, 0]}>
        {/* Chair seat */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.2, 1]} />
          <meshLambertMaterial color="#4a5568" />
        </mesh>
        
        {/* Chair back */}
        <mesh position={[0, 0.8, -0.4]}>
          <boxGeometry args={[1.2, 1.2, 0.2]} />
          <meshLambertMaterial color="#4a5568" />
        </mesh>
        
        {/* Chair legs */}
        {[[-0.4, -0.5, 0.4], [0.4, -0.5, 0.4], [-0.4, -0.5, -0.4], [0.4, -0.5, -0.4]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshLambertMaterial color="#2d3748" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Shopping box with floating animation
function ShoppingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="#e53e3e" />
    </mesh>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <FloatingParticles />
      <OfficeChair />
      <ShoppingBox />
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

// Main component
export default function ShoppingGuide3D() {
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