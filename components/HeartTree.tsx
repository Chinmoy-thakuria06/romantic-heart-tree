"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type HeartTreeProps = {
  burstSeed: number;
  onTreeClick: () => void;
};

type Heart = {
  position: THREE.Vector3;
  speed: number;
  drift: number;
  scale: number;
  rotation: THREE.Vector3;
};

function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  const heartWidth = 0.5;

  shape.moveTo(x, y + heartWidth / 2);
  shape.bezierCurveTo(x, y + heartWidth / 2, x - heartWidth, y + heartWidth / 3, x - heartWidth, y - heartWidth / 8);
  shape.bezierCurveTo(x - heartWidth, y - heartWidth / 2, x - heartWidth / 1.8, y - heartWidth, x, y - heartWidth * 1.15);
  shape.bezierCurveTo(x + heartWidth / 1.8, y - heartWidth, x + heartWidth, y - heartWidth / 2, x + heartWidth, y - heartWidth / 8);
  shape.bezierCurveTo(x + heartWidth, y + heartWidth / 3, x, y + heartWidth / 2, x, y + heartWidth / 2);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 2
  });
  geometry.center();
  return geometry;
}

function HeartMesh({
  position,
  scale,
  rotation,
  color = "#ff92cf",
  opacity = 1
}: {
  position: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => createHeartShape(), []);
  return (
    <mesh position={position} scale={scale} rotation={rotation} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.08}
        transmission={0.08}
        transparent
        opacity={opacity}
        emissive={new THREE.Color(color)}
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function TreeCore({ burstSeed, onTreeClick }: HeartTreeProps) {
  const trunk = useRef<THREE.Group>(null);
  const fallingHearts = useRef<THREE.Mesh[]>([]);
  const leafHearts = useRef<THREE.Mesh[]>([]);
  const burstHearts = useRef<Array<{ mesh: THREE.Mesh | null; velocity: THREE.Vector3; life: number }>>([]);
  const tick = useRef(0);

  const heartGeometry = useMemo(() => createHeartShape(), []);
  const falling = useMemo<Heart[]>(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          1.8 + Math.random() * 5.5,
          (Math.random() - 0.5) * 3.2
        ),
        speed: 0.006 + Math.random() * 0.013,
        drift: (Math.random() - 0.5) * 0.0025,
        scale: 0.06 + Math.random() * 0.08,
        rotation: new THREE.Vector3(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5)
      })),
    []
  );

  const leafLayout = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const radius = 1.6 + Math.random() * 1.7;
        const theta = (i / 28) * Math.PI * 2;
        const phi = (Math.random() * 0.5 + 0.25) * Math.PI;
        return new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * radius,
          1.7 + Math.cos(phi) * 1.5,
          Math.sin(theta) * Math.sin(phi) * radius * 0.8
        );
      }),
    []
  );

  const burstGeometry = useMemo(() => createHeartShape(), []);

  useFrame((state, delta) => {
    tick.current += delta;

    if (trunk.current) {
      trunk.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
      trunk.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.55) * 0.04;
      trunk.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }

    fallingHearts.current.forEach((mesh, index) => {
      if (!mesh) return;
      const item = falling[index];
      mesh.position.y -= item.speed * (delta * 60);
      mesh.position.x += Math.sin(tick.current * 1.7 + index) * item.drift;
      mesh.rotation.x += 0.01 * (delta * 60);
      mesh.rotation.y += 0.015 * (delta * 60);
      mesh.rotation.z += 0.006 * (delta * 60);

      if (mesh.position.y < -2.3) {
        mesh.position.y = 5 + Math.random() * 1.8;
        mesh.position.x = (Math.random() - 0.5) * 8;
        mesh.position.z = (Math.random() - 0.5) * 3.2;
      }
    });

    leafHearts.current.forEach((mesh, index) => {
      if (!mesh) return;
      const base = leafLayout[index];
      const sway = Math.sin(state.clock.elapsedTime * 1.1 + index) * 0.08;
      mesh.position.set(base.x + sway, base.y + Math.sin(state.clock.elapsedTime * 1.7 + index) * 0.06, base.z);
      mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.6;
      mesh.rotation.x = 0.25 + Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.08;
    });

    burstHearts.current = burstHearts.current.filter((entry) => {
      if (!entry.mesh) return false;
      entry.life -= delta;
      entry.mesh.position.addScaledVector(entry.velocity, delta * 60);
      entry.mesh.rotation.x += 0.04;
      entry.mesh.rotation.y += 0.03;
      entry.mesh.rotation.z += 0.02;
      (entry.mesh.material as THREE.Material).opacity = Math.max(0, entry.life / 1.35);
      entry.mesh.scale.setScalar(Math.max(0, entry.life / 1.35) * entry.mesh.scale.x);
      return entry.life > 0;
    });
  });

  const burst = () => {
    const next = Array.from({ length: 22 }, () => {
      const mesh = new THREE.Mesh(burstGeometry, new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.92 + Math.random() * 0.04, 0.9, 0.78),
        emissive: new THREE.Color("#ff8fd0"),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 1
      }));
      mesh.position.set((Math.random() - 0.5) * 0.7, 0.9 + Math.random() * 0.6, (Math.random() - 0.5) * 0.7);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      mesh.scale.setScalar(0.12 + Math.random() * 0.12);
      return {
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          0.05 + Math.random() * 0.11,
          (Math.random() - 0.5) * 0.08
        ),
        life: 1.35
      };
    });

    burstHearts.current.push(...next);
    onTreeClick();
  };

  return (
    <group ref={trunk} onPointerDown={(e) => {
      e.stopPropagation();
      burst();
    }}>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 5, 4]} intensity={38} color="#ff9fd7" distance={20} />
      <pointLight position={[-4, 2, -2]} intensity={18} color="#8ab4ff" distance={18} />
      <pointLight position={[4, 1, -2]} intensity={12} color="#b8a0ff" distance={14} />
      <Sparkles count={90} scale={10} size={2.8} speed={0.18} color="#fff0fa" opacity={0.6} />

      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.72, 3.2, 18, 1, false]} />
        <meshPhysicalMaterial color="#5b3a4d" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[-0.45, 0.55, 0.1]} rotation={[0.4, 0.2, -0.82]}>
        <cylinderGeometry args={[0.09, 0.14, 1.25, 12]} />
        <meshPhysicalMaterial color="#6a465b" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[0.38, 0.88, -0.06]} rotation={[-0.35, -0.08, 0.84]}>
        <cylinderGeometry args={[0.08, 0.12, 1.05, 12]} />
        <meshPhysicalMaterial color="#70485d" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[0.18, 1.35, 0.04]} rotation={[-0.2, 0.14, 1.0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.92, 12]} />
        <meshPhysicalMaterial color="#7c5164" roughness={1} metalness={0} />
      </mesh>

      <group position={[0, 1.55, 0]}>
        <mesh>
          <sphereGeometry args={[1.7, 32, 32]} />
          <meshBasicMaterial color="#ff8fcd" transparent opacity={0.08} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial color="#ffcaea" transparent opacity={0.08} />
        </mesh>
        {leafLayout.map((position, i) => (
          <mesh
            key={i}
            ref={(el) => {
              leafHearts.current[i] = el as THREE.Mesh;
            }}
            position={position}
            scale={0.11 + (i % 3) * 0.02}
          >
            <primitive object={heartGeometry} attach="geometry" />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? "#ff93d1" : "#ffd6ef"}
              roughness={0.35}
              metalness={0.04}
              transmission={0.06}
              transparent
              opacity={0.92}
              emissive={new THREE.Color(i % 2 === 0 ? "#ff6cb8" : "#ffe7f4")}
              emissiveIntensity={0.18}
            />
          </mesh>
        ))}
      </group>

      {falling.map((heart, i) => (
        <mesh
          key={`falling-${i}`}
          ref={(el) => {
            fallingHearts.current[i] = el as THREE.Mesh;
          }}
          position={heart.position}
          rotation={[heart.rotation.x, heart.rotation.y, heart.rotation.z]}
          scale={heart.scale}
        >
          <primitive object={heartGeometry} attach="geometry" />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? "#ff8ccd" : "#b9abff"}
            roughness={0.35}
            metalness={0.04}
            transparent
            opacity={0.85}
            emissive={new THREE.Color(i % 2 === 0 ? "#ff6cb8" : "#8fa8ff")}
            emissiveIntensity={0.16}
          />
        </mesh>
      ))}

      {burstHearts.current.map((entry, i) => (
        <primitive key={`burst-${burstSeed}-${i}`} object={entry.mesh!} />
      ))}

      <mesh position={[0, -1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshBasicMaterial color="#0a1030" transparent opacity={0.20} />
      </mesh>
    </group>
  );
}

export default function HeartTree({ burstSeed, onTreeClick }: HeartTreeProps) {
  return (
    <div className="relative h-[520px] w-full md:h-[680px]">
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(255,165,219,0.14),transparent_55%),linear-gradient(180deg,rgba(17,21,44,0.25),rgba(8,11,22,0.65))] blur-0" />
      <Canvas
        shadows={false}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.2, 8.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#070b18"]} />
        <fog attach="fog" args={["#070b18", 8, 20]} />
        <TreeCore burstSeed={burstSeed} onTreeClick={onTreeClick} />
      </Canvas>
    </div>
  );
}
