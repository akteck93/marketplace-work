'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const MILESTONE_NODES = [
  { id: 'pending', label: '1. Pending Escrow', color: '#94a3b8', pos: [-3, 0, 0], status: 'WAITING' },
  { id: 'active', label: '2. Active Milestone', color: '#06b6d4', pos: [-1, 1, 0], status: 'IN_PROGRESS' },
  { id: 'review', label: '3. Deliverable Review', color: '#8b5cf6', pos: [1, -0.5, 0], status: 'SUBMITTED' },
  { id: 'completed', label: '4. Funds Released', color: '#10b981', pos: [3, 0.5, 0], status: 'APPROVED' }
];

function ProgressPath() {
  const points = MILESTONE_NODES.map(n => n.pos);
  return (
    <Line
      points={points}
      color="#06b6d4"
      lineWidth={3}
      dashed={true}
      dashScale={5}
      dashSize={0.5}
      dashGap={0.2}
    />
  );
}

function ProjectNode({ node, activeNode, onSelectNode }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isSelected = activeNode === node.id;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={node.pos}>
      <mesh
        ref={meshRef}
        onClick={() => onSelectNode(node.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isSelected ? 1.4 : hovered ? 1.2 : 1.0}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.9 : hovered ? 0.6 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <Html position={[0, 0.75, 0]} center distanceFactor={7}>
        <button
          onClick={() => onSelectNode(node.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            isSelected
              ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 scale-105'
              : 'bg-slate-900/90 text-slate-200 border border-slate-700 hover:border-cyan-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }}></span>
          <span>{node.label}</span>
        </button>
      </Html>
    </Float>
  );
}

export default function Dashboard3DCanvas({ activeNode = 'active', onSelectNode = () => {} }) {
  return (
    <div className="w-full h-[320px] relative rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 shadow-xl">
      <div className="absolute top-3 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-400">
        3D Isometric Milestone Progress Pipeline
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[-5, -5, -2]} intensity={0.6} color="#8b5cf6" />

        <ProgressPath />

        {MILESTONE_NODES.map(node => (
          <ProjectNode
            key={node.id}
            node={node}
            activeNode={activeNode}
            onSelectNode={onSelectNode}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
