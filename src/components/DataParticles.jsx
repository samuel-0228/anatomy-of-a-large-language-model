import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 300; // Increased particle count for a denser data stream

const DataParticles = ({ activeLayer }) => {
  const meshRef = useRef();
  
  // Create random initial positions, speeds, and subtle color variations
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 6, // Wider spread
        y: (Math.random() - 0.5) * 4.5,
        z: Math.random() * 20 - 10,
        speed: Math.random() * 0.08 + 0.02,
        scale: Math.random() * 0.5 + 0.5
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Pause flow if a layer is focused
    const isPaused = activeLayer !== null;

    particles.forEach((particle, i) => {
      if (!isPaused) {
        particle.z -= particle.speed;
        
        // Add subtle sine wave motion to x/y for organic flow
        particle.x += Math.sin(state.clock.elapsedTime * 2 + i) * 0.005;
        particle.y += Math.cos(state.clock.elapsedTime * 2 + i) * 0.005;

        if (particle.z < -12) {
          particle.z = 10;
        }
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      {/* Box geometry looks more like digital tokens than spheres */}
      <boxGeometry args={[0.08, 0.08, 0.2]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
};

export default DataParticles;
