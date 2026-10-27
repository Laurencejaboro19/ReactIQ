import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Play, Repeat, Square } from "lucide-react";
import type { Element, Scene3D, Vec3 } from "@/data/reactions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Mode = "stopped" | "once" | "repeat" | "paused";
type Style = "ball" | "sticks" | "space";

const COLORS: Record<Element, string> = {
  C: "#8a8d91",
  Cc: "#6f8296",
  H: "#f4f4f4",
  O: "#e0352b",
  Br: "#a5502a",
  N: "#3b5bdb",
};
const RADII: Record<Element, number> = { C: 0.36, Cc: 0.38, H: 0.24, O: 0.34, Br: 0.5, N: 0.34 };
const SPACE: Record<Element, number> = { C: 0.85, Cc: 0.85, H: 0.6, O: 0.78, Br: 1.05, N: 0.8 };

const smooth = (t: number) => t * t * (3 - 2 * t);
const UP = new THREE.Vector3(0, 1, 0);

function sample(frames: number[] | Vec3[], time: number) {
  const i = Math.min(Math.floor(time), frames.length - 2);
  const u = smooth(Math.min(1, Math.max(0, time - i)));
  return { i, u };
}

function Molecule({
  scene,
  timeRef,
  modeRef,
  speedRef,
  style,
  spin,
  onEnd,
}: {
  scene: Scene3D;
  timeRef: React.MutableRefObject<number>;
  modeRef: React.MutableRefObject<Mode>;
  speedRef: React.MutableRefObject<number>;
  style: Style;
  spin: boolean;
  onEnd: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const atomRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dir = useRef(1);
  const hold = useRef(0);
  const max = scene.frameLabels.length - 1;
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3() }), []);

  const posAt = (k: number, time: number) => {
    const f = scene.atoms[k]?.frames ?? [];
    const { i, u } = sample(f, time);
    const A: Vec3 = f[i] ?? [0, 0, 0];
    const B: Vec3 = f[i + 1] ?? A;
    return [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u] as Vec3;
  };

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const mode = modeRef.current;
    if (mode === "once" || mode === "repeat") {
      if (hold.current > 0) hold.current -= dt;
      else {
        let t = timeRef.current + dir.current * dt * 0.6 * speedRef.current;
        if (t >= max) {
          t = max;
          if (mode === "repeat") { dir.current = -1; hold.current = 0.6; }
          else onEnd();
        } else if (t <= 0) {
          t = 0;
          dir.current = 1;
          hold.current = 0.6;
        }
        timeRef.current = t;
      }
    } else dir.current = 1;
    const time = timeRef.current;

    scene.atoms.forEach((_, k) => {
      const m = atomRefs.current[k];
      if (m) m.position.set(...posAt(k, time));
    });
    scene.bonds.forEach((b, k) => {
      const m = bondRefs.current[k];
      if (!m) return;
      const { i, u } = sample(b.frames, time);
      const o0 = b.frames[i] ?? 0;
      const o1 = b.frames[i + 1] ?? o0;
      const order = o0 + (o1 - o0) * u;
      const visible = order > 0.03 && style !== "space";
      m.visible = visible;
      if (!visible) return;
      tmp.a.set(...posAt(b.a, time));
      tmp.b.set(...posAt(b.b, time));
      tmp.d.subVectors(tmp.b, tmp.a);
      const len = tmp.d.length();
      m.position.addVectors(tmp.a, tmp.b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, tmp.d.normalize());
      const r = order > 0.95 ? 1 : 0.45;
      m.scale.set(r, len, r);
      (m.material as THREE.MeshStandardMaterial).opacity = Math.min(1, order * 1.8);
    });
    if (spin && group.current) group.current.rotation.y += dt * 0.5;
  });

  const bondR = style === "sticks" ? 0.13 : 0.09;
  return (
    <group ref={group}>
      {scene.atoms.map((a, k) => (
        <mesh key={k} ref={(m) => { atomRefs.current[k] = m; }} castShadow>
          <sphereGeometry args={[style === "space" ? SPACE[a.el] : style === "sticks" ? bondR : RADII[a.el], 40, 40]} />
          <meshStandardMaterial color={COLORS[a.el]} roughness={0.22} metalness={0.05} />
        </mesh>
      ))}
      {scene.bonds.map((_, k) => (
        <mesh key={k} ref={(m) => { bondRefs.current[k] = m; }}>
          <cylinderGeometry args={[bondR, bondR, 1, 20]} />
          <meshStandardMaterial color={style === "sticks" ? "#8a8d91" : "#b8bcc2"} roughness={0.35} transparent />
        </mesh>
      ))}
    </group>
  );
}

export default function Molecule3D({ scene }: { scene: Scene3D }) {
  const timeRef = useRef(0);
  const modeRef = useRef<Mode>("repeat");
  const speedRef = useRef(1);
  const [mode, setModeState] = useState<Mode>("repeat");
  const [speed, setSpeed] = useState(1);
  const [spin, setSpin] = useState(false);
  const [style, setStyle] = useState<Style>("ball");
  const [frame, setFrame] = useState(0);
  const max = scene.frameLabels.length - 1;

  const setMode = (m: Mode) => { modeRef.current = m; setModeState(m); };
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("paused");
    const id = setInterval(() => setFrame(timeRef.current), 120);
    return () => clearInterval(id);
  }, []);

  const jump = (d: number) => {
    setMode("paused");
    timeRef.current = Math.min(max, Math.max(0, d > 0 ? Math.floor(timeRef.current + 0.001) + 1 : Math.ceil(timeRef.current - 0.001) - 1));
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-stage sm:aspect-[16/9]">
        <Canvas camera={{ position: [0, 2.2, 8.5], fov: 45 }} dpr={[1, 2]} shadows>
          <color attach="background" args={["#efede8"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 6]} intensity={1.6} />
          <directionalLight position={[-6, -2, -4]} intensity={0.4} />
          <Environment resolution={64}>
            <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
            <Lightformer intensity={1} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          </Environment>
          <Molecule
            scene={scene}
            timeRef={timeRef}
            modeRef={modeRef}
            speedRef={speedRef}
            style={style}
            spin={spin}
            onEnd={() => setMode("paused")}
          />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={16} />
        </Canvas>
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
          {scene.frameLabels[Math.round(frame)]} · frame {Math.round(frame) + 1}/{max + 1}
        </div>
        <p className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-stage-foreground/60">Drag to rotate · pinch to zoom</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={mode === "once" ? "default" : "secondary"} onClick={() => { if (timeRef.current >= max) timeRef.current = 0; setMode("once"); }}>
          <Play /> Play once
        </Button>
        <Button size="sm" variant={mode === "repeat" ? "default" : "secondary"} onClick={() => setMode("repeat")}>
          <Repeat /> <span className="hidden sm:inline">Play repeatedly (backwards and forwards)</span><span className="sm:hidden">Repeat</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => { setMode("stopped"); timeRef.current = 0; }}>
          <Square /> Stop
        </Button>
        <Button size="icon" variant="secondary" onClick={() => jump(-1)} aria-label="Previous frame"><ChevronLeft /></Button>
        <Button size="icon" variant="secondary" onClick={() => jump(1)} aria-label="Next frame"><ChevronRight /></Button>
      </div>

      <div className="grid gap-4 rounded-2xl border bg-surface p-4 sm:grid-cols-3 sm:items-center">
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Speed · {speed.toFixed(2)}×</span>
          <Slider value={[speed]} min={0.25} max={2} step={0.05} onValueChange={([v]) => setSpeed(v ?? 1)} aria-label="Animation speed" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={spin} onCheckedChange={setSpin} aria-label="Spin" /> Spin
        </label>
        <ToggleGroup type="single" value={style} onValueChange={(v) => v && setStyle(v as Style)} aria-label="Display style" className="justify-start">
          <ToggleGroupItem value="ball" className="text-xs">Ball & stick</ToggleGroupItem>
          <ToggleGroupItem value="sticks" className="text-xs">Sticks</ToggleGroupItem>
          <ToggleGroupItem value="space" className="text-xs">Spacefill</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
