import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function AssistantCore() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.05;
  });

  return (
    <group ref={group} scale={1.2}>
      <mesh position={[0, -2.45, 0]}>
        <cylinderGeometry args={[1.9, 2.35, 0.35, 48]} />
        <meshStandardMaterial color="#090816" metalness={0.48} roughness={0.18} />
      </mesh>
      <mesh position={[0, -2.3, 0]}>
        <torusGeometry args={[1.9, 0.08, 18, 72]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.5} />
      </mesh>

      <group position={[0, -0.06, 0]}>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[1.15, 64, 64]} />
          <meshStandardMaterial color="#e2e6f2" metalness={0.78} roughness={0.16} />
        </mesh>

        <mesh position={[0, 0.25, 0.16]}>
          <sphereGeometry args={[0.76, 64, 64]} />
          <meshStandardMaterial color="#05060a" metalness={0.08} roughness={0.15} />
        </mesh>

        <mesh position={[0, 1.52, 0]}>
          <coneGeometry args={[1.45, 0.82, 4]} />
          <meshStandardMaterial color="#121829" metalness={0.58} roughness={0.22} />
        </mesh>

        <mesh position={[0, 1.58, 0]}>
          <torusGeometry args={[1.15, 0.05, 12, 64]} />
          <meshStandardMaterial color="#d384ff" emissive="#b600a8" emissiveIntensity={0.45} />
        </mesh>

        <mesh position={[0, -1.05, 0]}>
          <cylinderGeometry args={[0.92, 1.08, 1.8, 40]} />
          <meshStandardMaterial color="#c7ccda" metalness={0.84} roughness={0.18} />
        </mesh>

        <mesh position={[0, -2.35, 0]}>
          <capsuleGeometry args={[0.42, 1.3, 10, 24]} />
          <meshStandardMaterial color="#b8bfd2" metalness={0.88} roughness={0.18} />
        </mesh>

        <mesh position={[0.88, -2.1, 0.1]} rotation={[0.1, 0.15, -0.12]}>
          <boxGeometry args={[0.72, 1.28, 0.5]} />
          <meshStandardMaterial color="#e0e4f0" metalness={0.7} roughness={0.22} />
        </mesh>

        <mesh position={[-0.88, -2.1, 0.1]} rotation={[0.1, -0.12, 0.12]}>
          <boxGeometry args={[0.72, 1.28, 0.5]} />
          <meshStandardMaterial color="#e0e4f0" metalness={0.7} roughness={0.22} />
        </mesh>

        <mesh position={[0.5, 2.35, 0.04]} rotation={[0, 0, 0.28]}>
          <boxGeometry args={[0.22, 0.82, 0.22]} />
          <meshStandardMaterial color="#7c3aed" emissive="#c026d3" emissiveIntensity={1.1} />
        </mesh>

        <mesh position={[-0.5, 2.35, 0.04]} rotation={[0, 0, -0.28]}>
          <boxGeometry args={[0.22, 0.82, 0.22]} />
          <meshStandardMaterial color="#7c3aed" emissive="#c026d3" emissiveIntensity={1.1} />
        </mesh>
      </group>
    </group>
  );
}

function FloatingPanels() {
  return (
    <>
      <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh position={[-3.1, 1.3, -0.35]} rotation={[0.12, 0.24, -0.04]}>
          <boxGeometry args={[1.35, 1.8, 0.08]} />
          <meshStandardMaterial
            color="#15142a"
            metalness={0.5}
            roughness={0.16}
            emissive="#7c3aed"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float speed={0.95} rotationIntensity={0.18} floatIntensity={0.32}>
        <mesh position={[3.3, 1.55, 0.25]} rotation={[0.08, -0.25, 0.06]}>
          <boxGeometry args={[1.28, 1.72, 0.08]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.54}
            roughness={0.18}
            emissive="#0ea5e9"
            emissiveIntensity={0.24}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.3}>
        <mesh position={[-2.3, -1.85, -0.6]} rotation={[0.08, 0.1, -0.02]}>
          <torusGeometry args={[0.88, 0.07, 18, 64]} />
          <meshStandardMaterial color="#f5f3ff" emissive="#f472b6" emissiveIntensity={0.95} />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.35} floatIntensity={0.4}>
        <mesh position={[2.6, -1.7, -0.55]} rotation={[0.05, 0.35, 0.08]}>
          <icosahedronGeometry args={[0.78, 0]} />
          <meshStandardMaterial color="#ddd6fe" emissive="#a855f7" emissiveIntensity={0.55} />
        </mesh>
      </Float>
    </>
  );
}

export function Hero3DScene() {
  return (
    <div className="relative h-[38rem] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_12%,rgba(168,85,247,0.18),transparent_36%),radial-gradient(circle_at_65%_76%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,#050816,#02040c)] shadow-[0_30px_120px_-48px_rgba(0,0,0,0.95)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_58%)]" />
      <Canvas
        camera={{ position: [0, 0.35, 6.2], fov: 30 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 7, 15]} />
        <ambientLight intensity={1.7} />
        <directionalLight position={[5, 7, 8]} intensity={3.8} color="#f5f3ff" />
        <directionalLight position={[-4, -2, 5]} intensity={1.8} color="#7c3aed" />
        <pointLight position={[0, 2.3, 4]} intensity={30} color="#c026d3" />
        <pointLight position={[2.8, -1.4, 3]} intensity={24} color="#22d3ee" />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <AssistantCore />
        </Float>
        <FloatingPanels />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_46%,rgba(2,6,23,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.05)_30%,transparent_42%),linear-gradient(300deg,transparent_8%,rgba(255,255,255,0.03)_24%,transparent_36%)] opacity-55" />
    </div>
  );
}
