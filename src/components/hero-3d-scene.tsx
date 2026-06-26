import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Float,
  Html,
  useAnimations,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { BrainCircuit, BookOpen, MapPin, Search, Sparkles } from "lucide-react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Group } from "three";

function AssistantRobot() {
  const group = useRef<Group>(null);
  const gltf = useLoader(GLTFLoader, "/models/futuristic_flying_animated_robot_-_low_poly.glb");
  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions.Scene;
    action?.reset().fadeIn(0.35).play();
    return () => {
      action?.fadeOut(0.25);
    };
  }, [actions]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.set(0, 0, 0);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.04 - 0.06;
  });

  return (
    <group ref={group} scale={2.85} position={[0, -0.18, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function FloatingPanels() {
  return (
    <>
      <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh position={[-2.25, 1.05, -0.35]} rotation={[0.12, 0.24, -0.04]}>
          <boxGeometry args={[1.2, 1.6, 0.08]} />
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
        <mesh position={[2.45, 1.18, 0.25]} rotation={[0.08, -0.25, 0.06]}>
          <boxGeometry args={[1.15, 1.58, 0.08]} />
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
        <mesh position={[-1.75, -1.45, -0.6]} rotation={[0.08, 0.1, -0.02]}>
          <torusGeometry args={[0.76, 0.07, 18, 64]} />
          <meshStandardMaterial color="#f5f3ff" emissive="#f472b6" emissiveIntensity={0.95} />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.35} floatIntensity={0.4}>
        <mesh position={[1.95, -1.3, -0.55]} rotation={[0.05, 0.35, 0.08]}>
          <icosahedronGeometry args={[0.68, 0]} />
          <meshStandardMaterial color="#ddd6fe" emissive="#a855f7" emissiveIntensity={0.55} />
        </mesh>
      </Float>
    </>
  );
}

export function Hero3DScene() {
  return (
    <div className="relative h-[38rem] w-full overflow-visible">
      <Canvas
        className="!bg-transparent"
        camera={{ position: [0, 0.08, 3.75], fov: 20 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, physicallyCorrectLights: true }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={2.05} color="#fbfdff" groundColor="#050816" />
        <directionalLight position={[5, 7, 8]} intensity={5.2} color="#ffffff" />
        <directionalLight position={[-4, -2, 5]} intensity={3.2} color="#7c3aed" />
        <pointLight position={[0, 2.3, 4]} intensity={40} color="#c026d3" />
        <pointLight position={[2.8, -1.4, 3]} intensity={32} color="#22d3ee" />
        <spotLight
          position={[0, 7, 4.5]}
          angle={0.5}
          penumbra={0.8}
          intensity={110}
          color="#ffffff"
          castShadow
        />
        <Suspense
          fallback={
            <Html center className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Loading 3D model
            </Html>
          }
        >
          <Float speed={0.45} rotationIntensity={0} floatIntensity={0.06}>
            <AssistantRobot />
          </Float>
          <FloatingPanels />
          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.55}
            scale={7.5}
            blur={2.4}
            far={3.5}
            color="#0a1023"
          />
        </Suspense>
      </Canvas>
      <div className="floating-ai-cards">
        <div className="ai-mini-panel ai-panel-1" style={{ transform: "translate3d(0,0,0)" }}>
          <span className="ai-mini-panel-icon">
            <Search className="h-3.5 w-3.5" />
          </span>
          <span>
            <strong className="ai-mini-panel-title">Quick question</strong>
            <small className="ai-mini-panel-meta">Ask anything about courses</small>
          </span>
        </div>
        <div className="ai-mini-panel ai-panel-2" style={{ transform: "translate3d(0,0,0)" }}>
          <span className="ai-mini-panel-icon">
            <BrainCircuit className="h-3.5 w-3.5" />
          </span>
          <span>
            <strong className="ai-mini-panel-title">Study planning</strong>
            <small className="ai-mini-panel-meta">Smart next steps and paths</small>
          </span>
        </div>
        <div className="ai-mini-panel ai-panel-3" style={{ transform: "translate3d(0,0,0)" }}>
          <span className="ai-mini-panel-icon">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <span>
            <strong className="ai-mini-panel-title">Course search</strong>
            <small className="ai-mini-panel-meta">Credit hours and details</small>
          </span>
        </div>
        <div className="ai-mini-panel ai-panel-4" style={{ transform: "translate3d(0,0,0)" }}>
          <span className="ai-mini-panel-icon">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span>
            <strong className="ai-mini-panel-title">Campus guide</strong>
            <small className="ai-mini-panel-meta">Departments and locations</small>
          </span>
        </div>
        <div className="ai-mini-panel ai-panel-5" style={{ transform: "translate3d(0,0,0)" }}>
          <span className="ai-mini-panel-icon">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span>
            <strong className="ai-mini-panel-title">Always on</strong>
            <small className="ai-mini-panel-meta">Premium assistant experience</small>
          </span>
        </div>
      </div>
      <div className="hero-card-console">
        <span className="console-pulse" />
        <span>Murshidi live experience</span>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_46%,rgba(2,6,23,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.05)_30%,transparent_42%),linear-gradient(300deg,transparent_8%,rgba(255,255,255,0.03)_24%,transparent_36%)] opacity-55" />
    </div>
  );
}
