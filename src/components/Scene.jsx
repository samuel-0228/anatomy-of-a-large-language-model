import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import LLMPipeline from './LLMPipeline';
import DataParticles from './DataParticles';

const SceneContent = ({ activeLayer, setActiveLayer }) => {
  const groupRef = useRef();

  // Subtle floating and parallax based on mouse
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smoothly interpolate group rotation based on pointer
    const targetX = (state.pointer.y * Math.PI) / 16;
    const targetY = (state.pointer.x * Math.PI) / 16;
    
    groupRef.current.rotation.x += 0.05 * (targetX - groupRef.current.rotation.x);
    groupRef.current.rotation.y += 0.05 * (targetY - groupRef.current.rotation.y);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Abstract Environment for nice glass reflections */}
      <Environment preset="city" />

      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          {/* Slight isometric angle by default */}
          <group rotation={[Math.PI / 12, -Math.PI / 8, 0]}>
            <LLMPipeline activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
            <DataParticles activeLayer={activeLayer} />
          </group>
        </Float>
      </group>

      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#000000" />
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const Scene = ({ activeLayer, setActiveLayer }) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={[1, 2]} // Better performance/quality balance
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0b0f14' }}
    >
      <SceneContent activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
    </Canvas>
  );
};

export default Scene;
