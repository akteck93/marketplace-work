'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS_NODES = [
  { name: 'React Three Fiber', color: '#06b6d4', pos: [2.2, 1.2, 0.5] },
  { name: 'Three.js & WebGL', color: '#8b5cf6', pos: [-2.4, 0.8, -0.6] },
  { name: 'Next.js 15 & AI', color: '#10b981', pos: [1.8, -1.5, 1.2] },
  { name: 'Stripe Escrow', color: '#ec4899', pos: [-2.0, -1.4, -0.8] },
  { name: 'Blender 3D Asset', color: '#f59e0b', pos: [0, 2.3, -1.0] }
];

function RotatingGlobe() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Core Globe */}
      <Sphere args={[1.4, 64, 64]}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe outer shell */}
      <Sphere args={[1.55, 24, 24]}>
        <meshStandardMaterial
          color="#8b5cf6"
          wireframe={true}
          transparent={true}
          opacity={0.25}
        />
      </Sphere>
    </group>
  );
}

function FloatingSkillNode({ name, color, position }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5} position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1.0}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.4} />
      </mesh>
      
      <Html position={[0, 0.45, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 pointer-events-none shadow-lg ${
          hovered 
            ? 'bg-cyan-500 text-slate-950 scale-110 shadow-cyan-500/50' 
            : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/30'
        }`}>
          {name}
        </div>
      </Html>
    </Float>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-[450px] lg:h-[540px] relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-400 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Interactive 3D Visual Mesh Engine</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
        Drag to Rotate • Scroll to Zoom
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8b5cf6" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
        
        <RotatingGlobe />

        {SKILLS_NODES.map((node, index) => (
          <FloatingSkillNode key={index} name={node.name} color={node.color} position={node.pos} />
        ))}

        <OrbitControls
          enableZoom={true}
          maxDistance={8}
          minDistance={3.5}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
