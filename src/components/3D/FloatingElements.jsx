import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import { useTheme } from '../../contexts/ThemeContext';

const FloatingShape = ({ position, geometry, color }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
};

const FloatingElements = ({ className = "" }) => {
  const { theme } = useTheme();

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FloatingShape 
          position={[-3, 2, 0]} 
          geometry={<Sphere args={[0.5, 32, 32]} />}
          color={theme.glowColor}
        />
        
        <FloatingShape 
          position={[3, -1, -2]} 
          geometry={<Box args={[0.8, 0.8, 0.8]} />}
          color={theme.glowColor}
        />
        
        <FloatingShape 
          position={[0, -3, 1]} 
          geometry={<Torus args={[0.6, 0.2, 16, 100]} />}
          color={theme.glowColor}
        />
        
        <FloatingShape 
          position={[-2, -2, -1]} 
          geometry={<Sphere args={[0.3, 32, 32]} />}
          color={theme.glowColor}
        />
        
        <FloatingShape 
          position={[2, 3, -1]} 
          geometry={<Box args={[0.4, 0.4, 0.4]} />}
          color={theme.glowColor}
        />
      </Canvas>
    </div>
  );
};

export default FloatingElements;