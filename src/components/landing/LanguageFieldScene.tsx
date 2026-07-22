"use client";

import { ContactShadows, Float, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, MathUtils, Object3D } from "three";

type Token = {
  label: string;
  translation: string;
  color: string;
  position: [number, number, number];
  rotationSpeed: number;
};

type PixelCell = {
  id: string;
  color: string;
  emissive?: string;
  position: [number, number, number];
};

const tokens: Token[] = [
  {
    label: "hola",
    translation: "hello",
    color: "#ffd84d",
    position: [-2.6, 1.32, -0.55],
    rotationSpeed: 0.4,
  },
  {
    label: "merci",
    translation: "thanks",
    color: "#55d7ff",
    position: [2.6, 1.38, -0.7],
    rotationSpeed: -0.36,
  },
  {
    label: "lernen",
    translation: "learn",
    color: "#b8ff4f",
    position: [-2.35, -1.32, -0.2],
    rotationSpeed: -0.32,
  },
  {
    label: "hanasu",
    translation: "speak",
    color: "#ff6b8a",
    position: [2.25, -1.2, -0.24],
    rotationSpeed: 0.35,
  },
];

const duckSprite = [
  "...........R...........",
  "..........ARA..........",
  ".........ARRRA.........",
  "........AROORA........",
  ".......AROOORA........",
  "......XXXRRRXXX.......",
  ".....XYYYYYYYYYX......",
  "....XYYYYYYYYYYYX.....",
  "...XYYEYYYYYEYYYX.....",
  "...XYYWYYYYYWYYYX.....",
  "...XYYYYOOOOYYYYX.....",
  "...XYPPOOOOPPYYYX.....",
  "....XYYYYOOYYYYX......",
  "....XYYYYYYYYYYX......",
  "...XYYYYYYYYYYYYX.....",
  "..XYYYYYYYYYYYYYYX....",
  "..XYYYYHHHHYYYYYYX....",
  "...XYYYYYYYYYYYYX.....",
  "....XYYYYYYYYYYX......",
  ".....XOO....OOX.......",
  "......OO....OO........",
];

const palette: Record<string, { color: string; emissive?: string }> = {
  X: { color: "#3a2416" },
  Y: { color: "#ffd84d", emissive: "#4f3500" },
  H: { color: "#f2b72a", emissive: "#3c2800" },
  O: { color: "#ff8a1f", emissive: "#5f1d00" },
  P: { color: "#ff9db0", emissive: "#4c0717" },
  E: { color: "#0a0909" },
  W: { color: "#ffffff" },
  R: { color: "#ff3b19", emissive: "#8a1300" },
  A: { color: "#ff7a1f", emissive: "#7a2100" },
};

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
      camera={{ position: [0, 0.05, 7.4], fov: 39 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={1.25} />
      <directionalLight position={[3.8, 4.8, 5.2]} intensity={2.35} castShadow />
      <pointLight position={[-3.2, 1.7, 3.4]} intensity={4.2} color="#55d7ff" />
      <pointLight position={[3.2, -1.6, 3.2]} intensity={4.4} color="#ff6b8a" />
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
  const rigRef = useRef<Group>(null);
  const activeTokenData = tokens.find((token) => token.label === activeToken) ?? tokens[0];
  const tokenMap = useMemo(() => new Map(tokens.map((token) => [token.label, token])), []);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    rig.rotation.y += delta * 0.08;
    rig.rotation.x = MathUtils.lerp(rig.rotation.x, state.pointer.y * 0.09, 0.06);
    rig.rotation.z = MathUtils.lerp(rig.rotation.z, state.pointer.x * -0.04, 0.06);
  });

  return (
    <group ref={rigRef}>
      <Sparkles
        count={82}
        speed={0.26}
        size={1.9}
        scale={[6.7, 3.9, 2.8]}
        color="#b8ff4f"
        opacity={0.26}
      />

      <OrbitRings accent={activeTokenData.color} />
      <VoiceMeter accent={activeTokenData.color} />

      <Float speed={1.55} rotationIntensity={0.1} floatIntensity={0.3}>
        <PixelDuckMascot accent={activeTokenData.color} />
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

      <mesh position={[0, -2.08, -0.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.85, 4]} />
        <meshStandardMaterial color="#17201d" roughness={0.85} transparent opacity={0.46} />
      </mesh>
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={5.5}
        blur={1.3}
        far={3.2}
        color="#050605"
      />
    </group>
  );
}

function PixelDuckMascot({ accent }: { accent: string }) {
  const mascotRef = useRef<Group>(null);
  const cells = useMemo(() => buildDuckCells(), []);

  useFrame((state) => {
    const mascot = mascotRef.current;
    if (!mascot) return;

    const t = state.clock.elapsedTime;
    mascot.position.y = Math.sin(t * 2.2) * 0.05;
    mascot.rotation.y = MathUtils.lerp(mascot.rotation.y, -0.2 + state.pointer.x * 0.16, 0.06);
    mascot.rotation.x = MathUtils.lerp(mascot.rotation.x, 0.08 + state.pointer.y * 0.08, 0.06);
  });

  return (
    <group ref={mascotRef} position={[0, 0.06, 0.85]} rotation={[0.08, -0.2, 0]} scale={1.08}>
      <group position={[0.1, -0.05, -0.16]}>
        {cells.map((cell) => (
          <Voxel key={cell.id} cell={cell} />
        ))}
      </group>

      <mesh position={[0.1, -0.24, -0.24]} scale={[1.72, 1.2, 0.12]} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={accent} roughness={0.72} transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

function Voxel({ cell }: { cell: PixelCell }) {
  return (
    <mesh position={cell.position} castShadow receiveShadow>
      <boxGeometry args={[0.145, 0.145, 0.24]} />
      <meshStandardMaterial
        color={cell.color}
        roughness={0.5}
        metalness={0.02}
        emissive={cell.emissive ?? "#000000"}
        emissiveIntensity={cell.emissive ? 0.12 : 0}
      />
    </mesh>
  );
}

function buildDuckCells() {
  const cellSize = 0.15;
  const maxWidth = Math.max(...duckSprite.map((row) => row.length));

  return duckSprite.flatMap((row, rowIndex) =>
    row.split("").flatMap((key, columnIndex) => {
      const swatch = palette[key];
      if (!swatch) return [];

      const x = (columnIndex - maxWidth / 2) * cellSize;
      const y = (duckSprite.length / 2 - rowIndex) * cellSize;
      const z = key === "X" ? -0.01 : 0.02;

      return [
        {
          id: `${rowIndex}-${columnIndex}`,
          color: swatch.color,
          emissive: swatch.emissive,
          position: [x, y, z] as [number, number, number],
        },
      ];
    }),
  );
}

function OrbitRings({ accent }: { accent: string }) {
  const ringRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const ring = ringRef.current;
    if (!ring) return;

    ring.rotation.z += delta * 0.18;
    ring.rotation.y -= delta * 0.1;
  });

  return (
    <group ref={ringRef} position={[0.04, 0.02, 0.2]}>
      <mesh rotation={[0.62, 0.12, -0.32]}>
        <torusGeometry args={[1.82, 0.014, 8, 96]} />
        <meshStandardMaterial color="#55d7ff" roughness={0.3} emissive="#10243a" emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[0.12, -0.52, 0.36]}>
        <torusGeometry args={[2.18, 0.012, 8, 112]} />
        <meshStandardMaterial color={accent} roughness={0.35} emissive={accent} emissiveIntensity={0.08} />
      </mesh>
      <mesh rotation={[-0.72, 0.24, 0.2]}>
        <torusGeometry args={[2.52, 0.008, 8, 120]} />
        <meshStandardMaterial color="#f8efd0" roughness={0.4} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function VoiceMeter({ accent }: { accent: string }) {
  const meterRef = useRef<Group>(null);

  useFrame((state) => {
    const bars = meterRef.current?.children ?? [];
    bars.forEach((bar: Object3D, index) => {
      const target = 0.35 + Math.abs(Math.sin(state.clock.elapsedTime * 2.6 + index * 0.8)) * 0.9;
      bar.scale.y = MathUtils.lerp(bar.scale.y, target, 0.14);
      bar.position.y = -1.9 + target * 0.12;
    });
  });

  return (
    <group ref={meterRef} position={[-1.88, -0.05, 1.08]} rotation={[0.04, 0.24, 0]}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[index * 0.12, -1.9, 0]} scale={[1, 0.45, 1]} castShadow>
          <boxGeometry args={[0.07, 0.42, 0.08]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? accent : "#b8ff4f"}
            roughness={0.45}
            emissive={index % 2 === 0 ? accent : "#b8ff4f"}
            emissiveIntensity={0.18}
          />
        </mesh>
      ))}
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
    const targetScale = isActive || isHovered ? 1.12 : 1;
    group.scale.setScalar(MathUtils.lerp(group.scale.x, targetScale, 0.13));
  });

  return (
    <Float speed={1.1} rotationIntensity={0.09} floatIntensity={0.25}>
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
          <boxGeometry args={[1.08, 0.58, 0.16]} />
          <meshStandardMaterial
            color={isActive || isHovered ? token.color : "#f8efd0"}
            roughness={0.55}
            metalness={0.02}
            emissive={token.color}
            emissiveIntensity={isActive || isHovered ? 0.16 : 0.02}
          />
        </mesh>

        <Text
          position={[0, 0.02, 0.096]}
          fontSize={0.18}
          maxWidth={0.96}
          anchorX="center"
          anchorY="middle"
          color={isActive || isHovered ? "#0b0d0b" : "#17110d"}
        >
          {token.label}
        </Text>

        {isActive && (
          <Text
            position={[0, -0.45, 0.09]}
            fontSize={0.1}
            maxWidth={1.25}
            anchorX="center"
            anchorY="middle"
            color="#f8efd0"
          >
            {activeTranslation}
          </Text>
        )}
      </group>
    </Float>
  );
}
