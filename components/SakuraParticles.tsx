"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function createPetalShape() {
  const x = 0, y = 0;
  const petalShape = new THREE.Shape();
  petalShape.moveTo(x, y);
  petalShape.bezierCurveTo(x - 0.2, y + 0.2, x - 0.4, y + 0.5, x, y + 1);
  petalShape.bezierCurveTo(x + 0.4, y + 0.5, x + 0.2, y + 0.2, x, y);
  return petalShape;
}

export default function SakuraParticles({ count = 200, intensity = 0 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const geometry = useMemo(() => {
    const shape = createPetalShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01
    });
    geo.center();
    // Scale it down
    geo.scale(0.1, 0.1, 0.1);
    return geo;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20 + 10; // Start higher
      const z = (Math.random() - 0.5) * 15 - 5;
      const rx = Math.random() * Math.PI;
      const ry = Math.random() * Math.PI;
      const rz = Math.random() * Math.PI;
      const speed = 0.02 + Math.random() * 0.03;
      const drift = (Math.random() - 0.5) * 0.04;
      const rs = (Math.random() - 0.5) * 0.02;
      temp.push({ x, y, z, rx, ry, rz, speed, drift, rs });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Extra speed/drift based on music intensity
    const beatDrift = intensity * 0.05;
    
    particles.forEach((p, i) => {
      p.y -= p.speed * (delta * 60);
      p.x += (p.drift + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01) * (delta * 60) + beatDrift;
      p.rx += p.rs * (delta * 60);
      p.ry += p.rs * (delta * 60);
      
      if (p.y < -10) {
        p.y = 10 + Math.random() * 5;
        p.x = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      
      // Slight scale bounce on beat
      const scale = 1 + intensity * 0.3 * Math.sin(i);
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color="#ffb7d5" 
        emissive="#ff9ebf"
        emissiveIntensity={0.2}
        roughness={0.4}
        transmission={0.4}
        thickness={0.5}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
