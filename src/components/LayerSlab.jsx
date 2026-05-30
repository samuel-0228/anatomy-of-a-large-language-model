import React, { useState, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Edges, Text, Image, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';

const BranchNode = ({ branch, color, isVisible }) => {
  const nodeRef = useRef();
  
  useFrame((state, delta) => {
    if (!nodeRef.current) return;
    const targetScale = isVisible ? 1 : 0;
    nodeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // Slowly rotate the branch node for a high-tech feel
    if (isVisible) {
      nodeRef.current.rotation.y += delta * 0.5;
      nodeRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={nodeRef} position={branch.position} scale={0}>
      <mesh>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshPhysicalMaterial 
          color={color}
          transparent
          opacity={0.8}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          emissive={color}
          emissiveIntensity={0.2}
        />
        <Edges linewidth={2} color="#ffffff" />
      </mesh>
      
      {/* Branch Label */}
      {isVisible && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {branch.title}
        </Text>
      )}

      {/* Neural connection line to center */}
      {isVisible && (
        <QuadraticBezierLine
          start={[0, 0, 0]} // Local relative to the branch node
          end={[-branch.position[0], -branch.position[1], -branch.position[2]]} // Back to parent center
          mid={[-branch.position[0] * 0.5, -branch.position[1] * 0.2, 2]} // Arcing outward slightly
          color={color}
          lineWidth={3}
          dashed={false}
        />
      )}
    </group>
  );
};

const LayerSlab = ({ data, index, activeLayer, setActiveLayer }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const materialRef = useRef();
  const innerMeshRef = useRef();
  
  const isActive = activeLayer === index;
  const isOtherActive = activeLayer !== null && activeLayer !== index;

  // Target states
  const targetScale = isActive ? 1.2 : hovered && !isOtherActive ? 1.05 : 1;
  const targetZ = isActive ? 0 : data.zPosition;
  const targetOpacity = isOtherActive ? 0.1 : 0.7;

  useFrame((state, delta) => {
    if (!groupRef.current || !materialRef.current || !innerMeshRef.current) return;

    const lerpFactor = 0.1;
    
    // Scale and Z translation
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpFactor);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpFactor);
    
    // Smooth opacity
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, lerpFactor);

    // Subtle rotation of inner core to look like active processing
    if (!isOtherActive) {
      innerMeshRef.current.rotation.y += delta * 0.2;
      innerMeshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, data.zPosition]}>
      
      {/* Floating 3D Title Label (Hidden when another layer is focused) */}
      {!isOtherActive && (
        <Text
          position={[-3.8, 2.5, 0]}
          fontSize={0.3}
          color={hovered || isActive ? '#ffffff' : '#888888'}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {data.title.split('. ')[1].toUpperCase()}
        </Text>
      )}

      {/* Main Glass Body */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveLayer(isActive ? null : index);
        }}
      >
        <boxGeometry args={[7, 4.5, 0.5]} />
        
        {/* Outer Glass Shell */}
        <meshPhysicalMaterial 
          ref={materialRef}
          color={data.color}
          transparent
          opacity={0.7}
          roughness={0.1}
          transmission={0.9}
          thickness={1.5}
          ior={1.5}
          emissive={hovered || isActive ? data.color : '#000000'}
          emissiveIntensity={hovered || isActive ? 0.6 : 0.1}
        />

        {/* Outer Glowing Edges */}
        <Edges
          linewidth={isActive ? 3 : 2}
          threshold={15}
          color={hovered || isActive ? '#ffffff' : data.color}
        />

        {/* Hover Tooltip - HTML Overlay */}
        {hovered && !isActive && !isOtherActive && (
          <Html position={[0, 2.8, 0]} center zIndexRange={[100, 0]}>
            <div className="tooltip" style={{ 
              background: `rgba(0,0,0,0.85)`,
              border: `1px solid ${data.color}`,
              boxShadow: `0 0 10px ${data.color}40`,
              padding: '10px 16px',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Click to Explore Layer
            </div>
          </Html>
        )}
      </mesh>

      {/* Inner "Circuit/Core" Mesh for Sophistication */}
      <mesh ref={innerMeshRef} scale={[0.95, 0.9, 0.6]}>
        <boxGeometry args={[6.8, 4.3, 0.2]} />
        <meshBasicMaterial 
          color={data.color} 
          wireframe={true} 
          transparent 
          opacity={isActive || hovered ? 0.4 : 0.1} 
        />
      </mesh>

      {/* Embedded Image Icon representing the layer's role */}
      <Suspense fallback={null}>
        <Image 
          url={data.image} 
          position={[0, 0, 0.26]} // Slightly in front of the glass surface
          scale={[3, 3]} // Adjust size to fit nicely in the 7x4.5 slab
          transparent
          opacity={isOtherActive ? 0.1 : 0.85}
        />
      </Suspense>

      {/* Render Branches if they exist and layer is active */}
      {data.branches && data.branches.map((branch, i) => (
        <BranchNode key={branch.id} branch={branch} color={data.color} isVisible={isActive} />
      ))}

    </group>
  );
};

export default LayerSlab;
