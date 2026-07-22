"use client";

import { Float, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, MathUtils, TextureLoader } from "three";

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
    color: "#f59e0b",
    position: [-2.8, 1.15, -0.7],
    rotationSpeed: 0.55,
  },
  {
    label: "merci",
    translation: "thanks",
    color: "#0ea5e9",
    position: [2.5, 1.55, -1.1],
    rotationSpeed: -0.45,
  },
  {
    label: "lernen",
    translation: "learn",
    color: "#10b981",
    position: [-2.15, -1.3, -0.15],
    rotationSpeed: -0.35,
  },
  {
    label: "hanasu",
    translation: "speak",
    color: "#f43f5e",
    position: [2.45, -1.05, -0.35],
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
      camera={{ position: [0, 0, 6.8], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <color attach="background" args={["#f7f4ef"]} />
      <ambientLight intensity={1.65} />
      <directionalLight position={[4, 5, 5]} intensity={2.4} />
      <pointLight position={[-3, -2, 4]} intensity={6} color="#0ea5e9" />
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
  const mascotTexture = useLoader(TextureLoader, "/mascot.png");
  const tokenMap = useMemo(() => new Map(tokens.map((token) => [token.label, token])), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.16;
    group.rotation.x = MathUtils.lerp(group.rotation.x, state.pointer.y * 0.16, 0.06);
    group.rotation.z = MathUtils.lerp(group.rotation.z, state.pointer.x * -0.08, 0.06);
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={58}
        speed={0.28}
        size={2.2}
        scale={[7, 3.8, 2.6]}
        color="#f59e0b"
        opacity={0.34}
      />

      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.25, 2]} />
          <meshStandardMaterial
            color="#182a2f"
            roughness={0.52}
            metalness={0.12}
            emissive="#0f172a"
            emissiveIntensity={0.08}
          />
        </mesh>

        <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0.14]}>
          <torusGeometry args={[1.72, 0.018, 16, 120]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0.12]} rotation={[0.55, 0.2, -0.38]}>
          <torusGeometry args={[2.18, 0.012, 16, 120]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.42} metalness={0.18} />
        </mesh>

        <mesh position={[0, 0, 1.31]}>
          <planeGeometry args={[1.32, 1.32]} />
          <meshStandardMaterial map={mascotTexture} transparent roughness={0.9} />
        </mesh>
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

      <mesh position={[0, -2.25, -0.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 3.45, 96]} />
        <meshStandardMaterial color="#d9d1c6" roughness={0.85} transparent opacity={0.45} />
      </mesh>
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
        >
          <boxGeometry args={[1.25, 0.72, 0.14]} />
          <meshStandardMaterial
            color={isActive || isHovered ? token.color : "#fff8ed"}
            roughness={0.48}
            metalness={0.04}
            emissive={token.color}
            emissiveIntensity={isActive || isHovered ? 0.14 : 0.02}
          />
        </mesh>

        <Text
          position={[0, 0.02, 0.091]}
          fontSize={0.22}
          maxWidth={1}
          anchorX="center"
          anchorY="middle"
          color={isActive || isHovered ? "#ffffff" : "#182a2f"}
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
            color="#182a2f"
          >
            {activeTranslation}
          </Text>
        )}
      </group>
    </Float>
  );
}
