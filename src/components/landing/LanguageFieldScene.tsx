"use client";

import { ContactShadows, Float, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, MathUtils } from "three";

type Token = {
  label: string;
  translation: string;
  color: string;
  position: [number, number, number];
  rotationSpeed: number;
};

const tokens: Token[] = [
  {
    label: "hola",
    translation: "hello",
    color: "#f7b801",
    position: [-2.25, 1.12, -0.65],
    rotationSpeed: 0.55,
  },
  {
    label: "merci",
    translation: "thanks",
    color: "#2563eb",
    position: [2.15, 1.52, -1.05],
    rotationSpeed: -0.45,
  },
  {
    label: "lernen",
    translation: "learn",
    color: "#00a67e",
    position: [-1.85, -1.28, -0.15],
    rotationSpeed: -0.35,
  },
  {
    label: "hanasu",
    translation: "speak",
    color: "#ff4d6d",
    position: [2.05, -1.05, -0.35],
    rotationSpeed: 0.4,
  },
];

export default function LanguageFieldScene({
  activeToken,
  onTokenChange,
}: {
  activeToken: string;
  onTokenChange: (token: string) => void;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 6.9], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={1.55} />
      <directionalLight position={[4, 5, 5]} intensity={2.6} castShadow />
      <pointLight position={[-3, -2, 4]} intensity={5.5} color="#2563eb" />
      <pointLight position={[3.5, 2, 3]} intensity={4.8} color="#ff4d6d" />
      <SceneContent activeToken={activeToken} onTokenChange={onTokenChange} />
    </Canvas>
  );
}

function SceneContent({
  activeToken,
  onTokenChange,
}: {
  activeToken: string;
  onTokenChange: (token: string) => void;
}) {
  const groupRef = useRef<Group>(null);
  const tokenMap = useMemo(() => new Map(tokens.map((token) => [token.label, token])), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.14;
    group.rotation.x = MathUtils.lerp(group.rotation.x, state.pointer.y * 0.13, 0.06);
    group.rotation.z = MathUtils.lerp(group.rotation.z, state.pointer.x * -0.07, 0.06);
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={64}
        speed={0.3}
        size={2.3}
        scale={[7, 3.8, 2.6]}
        color="#00a67e"
        opacity={0.32}
      />

      <Float speed={1.3} rotationIntensity={0.16} floatIntensity={0.32}>
        <mesh position={[0, -0.05, -0.02]} castShadow receiveShadow>
          <icosahedronGeometry args={[1.18, 2]} />
          <meshStandardMaterial
            color="#10201f"
            roughness={0.52}
            metalness={0.1}
            emissive="#00a67e"
            emissiveIntensity={0.05}
          />
        </mesh>

        <mesh position={[0, 0, 0.04]} rotation={[0, 0, 0.14]}>
          <torusGeometry args={[1.72, 0.018, 16, 120]} />
          <meshStandardMaterial color="#f7b801" roughness={0.3} metalness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0.08]} rotation={[0.55, 0.2, -0.38]}>
          <torusGeometry args={[2.18, 0.012, 16, 120]} />
          <meshStandardMaterial color="#2563eb" roughness={0.42} metalness={0.18} />
        </mesh>

        <DuckMascot />
      </Float>

      {tokens.map((token) => (
        <LanguageToken
          key={token.label}
          token={token}
          isActive={activeToken === token.label}
          activeTranslation={tokenMap.get(activeToken)?.translation ?? ""}
          onTokenChange={onTokenChange}
        />
      ))}

      <mesh position={[0, -2.25, -0.65]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.35, 3.45, 96]} />
        <meshStandardMaterial color="#94cfc0" roughness={0.85} transparent opacity={0.34} />
      </mesh>
      <ContactShadows
        position={[0, -2.04, 0]}
        opacity={0.28}
        scale={6.2}
        blur={1.7}
        far={4}
        color="#10201f"
      />
    </group>
  );
}

function DuckMascot() {
  const duckRef = useRef<Group>(null);

  useFrame((state) => {
    const duck = duckRef.current;
    if (!duck) return;

    duck.position.y = Math.sin(state.clock.elapsedTime * 1.7) * 0.045;
    duck.rotation.y = MathUtils.lerp(duck.rotation.y, state.pointer.x * 0.16, 0.05);
    duck.rotation.x = MathUtils.lerp(duck.rotation.x, state.pointer.y * 0.08, 0.05);
  });

  return (
    <group ref={duckRef} position={[0, 0.02, 1.16]} rotation={[0.03, -0.08, 0]} scale={0.95}>
      <mesh position={[0, -0.28, 0]} scale={[0.98, 0.74, 0.78]} castShadow>
        <sphereGeometry args={[0.88, 64, 32]} />
        <meshStandardMaterial
          color="#ffd84d"
          roughness={0.44}
          metalness={0.03}
          emissive="#f7b801"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 0.55, 0.08]} scale={[0.84, 0.78, 0.76]} castShadow>
        <sphereGeometry args={[0.62, 64, 32]} />
        <meshStandardMaterial
          color="#ffe778"
          roughness={0.42}
          metalness={0.03}
          emissive="#f7b801"
          emissiveIntensity={0.04}
        />
      </mesh>

      <mesh position={[-0.62, 0.52, 0.08]} scale={[0.12, 0.42, 0.2]} rotation={[0, 0, -0.16]}>
        <sphereGeometry args={[0.58, 32, 16]} />
        <meshStandardMaterial color="#2b2017" roughness={0.5} />
      </mesh>
      <mesh position={[0.62, 0.52, 0.08]} scale={[0.12, 0.42, 0.2]} rotation={[0, 0, 0.16]}>
        <sphereGeometry args={[0.58, 32, 16]} />
        <meshStandardMaterial color="#2b2017" roughness={0.5} />
      </mesh>

      <mesh position={[-0.22, 0.68, 0.6]} scale={[1, 1.08, 0.72]}>
        <sphereGeometry args={[0.075, 24, 16]} />
        <meshStandardMaterial color="#10201f" roughness={0.22} />
      </mesh>
      <mesh position={[0.22, 0.68, 0.6]} scale={[1, 1.08, 0.72]}>
        <sphereGeometry args={[0.075, 24, 16]} />
        <meshStandardMaterial color="#10201f" roughness={0.22} />
      </mesh>
      <mesh position={[-0.245, 0.71, 0.65]} scale={[1, 1, 0.7]}>
        <sphereGeometry args={[0.024, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.195, 0.71, 0.65]} scale={[1, 1, 0.7]}>
        <sphereGeometry args={[0.024, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      <mesh position={[0, 0.46, 0.78]} rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={[1, 0.68, 0.26]} castShadow>
        <coneGeometry args={[0.28, 0.58, 4]} />
        <meshStandardMaterial
          color="#ff8a1f"
          roughness={0.34}
          metalness={0.02}
          emissive="#ff4d00"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0, 0.37, 0.73]} scale={[0.72, 0.16, 0.16]} castShadow>
        <sphereGeometry args={[0.34, 32, 16]} />
        <meshStandardMaterial color="#d95f00" roughness={0.42} />
      </mesh>

      <mesh position={[-0.4, 0.38, 0.6]} scale={[0.16, 0.08, 0.04]}>
        <sphereGeometry args={[0.5, 24, 12]} />
        <meshStandardMaterial color="#ff9fb1" roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0.38, 0.6]} scale={[0.16, 0.08, 0.04]}>
        <sphereGeometry args={[0.5, 24, 12]} />
        <meshStandardMaterial color="#ff9fb1" roughness={0.5} />
      </mesh>

      <mesh position={[-0.72, -0.24, 0.14]} rotation={[0, 0.16, -0.28]} scale={[0.22, 0.52, 0.1]} castShadow>
        <sphereGeometry args={[0.74, 32, 16]} />
        <meshStandardMaterial color="#f7b801" roughness={0.48} />
      </mesh>
      <mesh position={[0.72, -0.24, 0.14]} rotation={[0, -0.16, 0.28]} scale={[0.22, 0.52, 0.1]} castShadow>
        <sphereGeometry args={[0.74, 32, 16]} />
        <meshStandardMaterial color="#f7b801" roughness={0.48} />
      </mesh>

      <mesh position={[-0.28, -0.96, 0.28]} scale={[0.3, 0.1, 0.16]} castShadow>
        <sphereGeometry args={[0.5, 24, 12]} />
        <meshStandardMaterial color="#ff8a1f" roughness={0.38} />
      </mesh>
      <mesh position={[0.28, -0.96, 0.28]} scale={[0.3, 0.1, 0.16]} castShadow>
        <sphereGeometry args={[0.5, 24, 12]} />
        <meshStandardMaterial color="#ff8a1f" roughness={0.38} />
      </mesh>

      <group position={[0, 1.04, 0.08]} rotation={[0.02, 0, 0]}>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.08]} scale={[0.9, 1.12, 0.75]} castShadow>
          <coneGeometry args={[0.24, 0.92, 7]} />
          <meshStandardMaterial
            color="#ff6b1f"
            roughness={0.34}
            emissive="#ff4d00"
            emissiveIntensity={0.12}
          />
        </mesh>
        <mesh position={[-0.18, 0.06, 0.03]} rotation={[0.08, 0, 0.26]} scale={[0.58, 0.74, 0.55]}>
          <coneGeometry args={[0.2, 0.62, 7]} />
          <meshStandardMaterial color="#ff4d6d" roughness={0.36} emissive="#ff4d6d" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0.16, 0.02, 0.04]} rotation={[0.08, 0, -0.24]} scale={[0.48, 0.62, 0.5]}>
          <coneGeometry args={[0.18, 0.52, 7]} />
          <meshStandardMaterial color="#ffd84d" roughness={0.32} emissive="#f7b801" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function LanguageToken({
  token,
  isActive,
  activeTranslation,
  onTokenChange,
}: {
  token: Token;
  isActive: boolean;
  activeTranslation: string;
  onTokenChange: (token: string) => void;
}) {
  const tokenRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((_, delta) => {
    const group = tokenRef.current;
    if (!group) return;

    group.rotation.y += delta * token.rotationSpeed;
    const targetScale = isActive || isHovered ? 1.13 : 1;
    group.scale.setScalar(MathUtils.lerp(group.scale.x, targetScale, 0.12));
  });

  return (
    <Float speed={1.15} rotationIntensity={0.12} floatIntensity={0.28}>
      <group ref={tokenRef} position={token.position}>
        <mesh
          onClick={() => onTokenChange(token.label)}
          onPointerOver={() => {
            setIsHovered(true);
            onTokenChange(token.label);
          }}
          onPointerOut={() => setIsHovered(false)}
          castShadow
        >
          <boxGeometry args={[1.25, 0.72, 0.14]} />
          <meshStandardMaterial
            color={isActive || isHovered ? token.color : "#ffffff"}
            roughness={0.42}
            metalness={0.04}
            emissive={token.color}
            emissiveIntensity={isActive || isHovered ? 0.16 : 0.02}
          />
        </mesh>

        <Text
          position={[0, 0.02, 0.091]}
          fontSize={0.22}
          maxWidth={1}
          anchorX="center"
          anchorY="middle"
          color={isActive || isHovered ? "#ffffff" : "#10201f"}
        >
          {token.label}
        </Text>

        {isActive && (
          <Text
            position={[0, -0.58, 0.09]}
            fontSize={0.11}
            maxWidth={1.4}
            anchorX="center"
            anchorY="middle"
            color="#10201f"
          >
            {activeTranslation}
          </Text>
        )}
      </group>
    </Float>
  );
}
