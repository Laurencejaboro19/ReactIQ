import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

/* CPK-inspired palette, slightly muted to sit well on the light stage. */
export const ELEMENT_INFO: Record<Element, { color: string; name: string; r: number; vdw: number }> = {
  C: { color: "#8a8d91", name: "Carbon", r: 0.36, vdw: 0.85 },
  Cc: { color: "#6f8296", name: "Reacting carbon", r: 0.38, vdw: 0.85 },
  H: { color: "#f4f4f4", name: "Hydrogen", r: 0.24, vdw: 0.6 },
  O: { color: "#e0352b", name: "Oxygen", r: 0.34, vdw: 0.78 },
  N: { color: "#3b5bdb", name: "Nitrogen", r: 0.34, vdw: 0.8 },
  Br: { color: "#a5502a", name: "Bromine", r: 0.5, vdw: 1.05 },
  Cl: { color: "#3fb950", name: "Chlorine", r: 0.46, vdw: 0.98 },
  Mg: { color: "#7bc96f", name: "Magnesium", r: 0.52, vdw: 1.0 },
  P: { color: "#ff8c1a", name: "Phosphorus", r: 0.48, vdw: 1.0 },
  Al: { color: "#c9a8a8", name: "Aluminium", r: 0.5, vdw: 1.0 },
  S: { color: "#e6c229", name: "Sulfur", r: 0.48, vdw: 1.0 },
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const UP = new THREE.Vector3(0, 1, 0);

function sample(frames: number[] | Vec3[], time: number) {
  const i = Math.max(0, Math.min(Math.floor(time), frames.length - 2));
  const u = smooth(Math.min(1, Math.max(0, time - i)));
  return { i, u };
}

/** Bounding sphere across every frame so the camera can frame any molecule. */
function sceneBounds(scene: Scene3D) {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const a of scene.atoms) {
    for (const p of a.frames) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k] ?? Infinity, p[k] ?? 0);
        max[k] = Math.max(max[k] ?? -Infinity, p[k] ?? 0);
      }
    }
  }
  const center: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const half: Vec3 = [(max[0] - min[0]) / 2 + 0.6, (max[1] - min[1]) / 2 + 0.6, (max[2] - min[2]) / 2 + 0.6];
  let radius = 1;
  for (const a of scene.atoms) {
    for (const p of a.frames) {
      const d = Math.hypot(p[0] - center[0], p[1] - center[1], p[2] - center[2]);
      radius = Math.max(radius, d);
    }
  }
  return { center, radius, half };
}

const FOV = 42;
/** Camera distance that fits the whole box in view for a given aspect ratio. */
function fitDistance(half: Vec3, aspect: number) {
  const t = Math.tan((FOV / 2) * (Math.PI / 180));
  const dY = half[1] / t;
  const dX = half[0] / (t * aspect);
  return Math.min(30, Math.max(5.5, Math.max(dX, dY) * 0.85 + half[2] * 0.5 + 0.5));
}

function CameraRig({ half }: { half: Vec3 }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const d = fitDistance(half, Math.max(0.9, size.width / Math.max(1, size.height)));
    camera.position.set(d * 0.06, d * 0.22, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, half, size.width, size.height]);
  return null;
}

function Molecule({
  scene,
  center,
  timeRef,
  modeRef,
  speedRef,
  style,
  spin,
  onEnd,
}: {
  scene: Scene3D;
  center: Vec3;
  timeRef: React.MutableRefObject<number>;
  modeRef: React.MutableRefObject<Mode>;
  speedRef: React.MutableRefObject<number>;
  style: Style;
  spin: boolean;
  onEnd: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const atomRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bondRefs = useRef<(THREE.Mesh | null)[][]>([]);
  const dir = useRef(1);
  const hold = useRef(0);
  const max = scene.frameLabels.length - 1;
  const tmp = useMemo(
    () => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3(), n: new THREE.Vector3(), q: new THREE.Quaternion() }),
    [],
  );

  const posAt = (k: number, time: number): Vec3 => {
    const f = scene.atoms[k]?.frames ?? [];
    const { i, u } = sample(f, time);
    const A: Vec3 = f[i] ?? [0, 0, 0];
    const B: Vec3 = f[i + 1] ?? A;
    return [A[0] + (B[0] - A[0]) * u - center[0], A[1] + (B[1] - A[1]) * u - center[1], A[2] + (B[2] - A[2]) * u - center[2]];
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
          if (mode === "repeat") {
            dir.current = -1;
            hold.current = 0.7;
          } else onEnd();
        } else if (t <= 0) {
          t = 0;
          dir.current = 1;
          hold.current = 0.7;
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
      const meshes = bondRefs.current[k] ?? [];
      const { i, u } = sample(b.frames, time);
      const o0 = b.frames[i] ?? 0;
      const o1 = b.frames[i + 1] ?? o0;
      const order = o0 + (o1 - o0) * u;
      const visible = order > 0.03 && style !== "space";
      if (!visible) {
        meshes.forEach((m) => m && (m.visible = false));
        return;
      }
      tmp.a.set(...posAt(b.a, time));
      tmp.b.set(...posAt(b.b, time));
      tmp.d.subVectors(tmp.b, tmp.a);
      const len = tmp.d.length();
      tmp.d.normalize();
      tmp.q.setFromUnitVectors(UP, tmp.d);
      // perpendicular offset direction for multiple bonds
      tmp.n.set(0, 0, 1);
      if (Math.abs(tmp.d.dot(tmp.n)) > 0.9) tmp.n.set(1, 0, 0);
      tmp.n.cross(tmp.d).normalize();

      // How many sticks: 1 for single/partial, 2 for ~double, 3 for triple.
      const count = order >= 2.5 ? 3 : order >= 1.35 ? 2 : 1;
      const partial = order < 0.85;
      const r = style === "sticks" ? 0.13 : count > 1 ? 0.065 : 0.09;
      const gap = count === 3 ? 0.17 : 0.13;
      for (let s = 0; s < 3; s++) {
        const m = meshes[s];
        if (!m) continue;
        if (s >= count) {
          m.visible = false;
          continue;
        }
        m.visible = true;
        const off = count === 1 ? 0 : count === 2 ? (s === 0 ? -gap : gap) : (s - 1) * gap;
        m.position.copy(tmp.a).addScaledVector(tmp.d, len / 2).addScaledVector(tmp.n, off);
        m.quaternion.copy(tmp.q);
        m.scale.set(r, len, r);
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.opacity = partial ? Math.min(1, 0.25 + order) : 1;
        mat.transparent = partial;
      }
    });
    if (spin && group.current) group.current.rotation.y += dt * 0.5;
  });

  const bondR = style === "sticks" ? 0.13 : 0.09;
  return (
    <group ref={group}>
      {scene.atoms.map((a, k) => {
        const info = ELEMENT_INFO[a.el];
        return (
          <mesh key={k} ref={(m) => { atomRefs.current[k] = m; }} castShadow>
            <sphereGeometry args={[style === "space" ? info.vdw : style === "sticks" ? bondR : info.r, 40, 40]} />
            <meshStandardMaterial color={info.color} roughness={0.25} metalness={0.05} />
          </mesh>
        );
      })}
      {scene.bonds.map((_, k) =>
        [0, 1, 2].map((s) => (
          <mesh
            key={`${k}-${s}`}
            ref={(m) => {
              (bondRefs.current[k] ??= [])[s] = m;
            }}
          >
            <cylinderGeometry args={[1, 1, 1, 20]} />
            <meshStandardMaterial color={style === "sticks" ? "#8a8d91" : "#b8bcc2"} roughness={0.35} />
          </mesh>
        )),
      )}
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
  const bounds = useMemo(() => sceneBounds(scene), [scene]);
  const legend = useMemo(() => Array.from(new Set(scene.atoms.map((a) => (a.el === "Cc" ? "C" : a.el)))) as Element[], [scene]);

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    timeRef.current = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("paused");
    const id = setInterval(() => setFrame(timeRef.current), 120);
    return () => clearInterval(id);
  }, [scene]);

  const jump = (d: number) => {
    setMode("paused");
    const t = timeRef.current;
    timeRef.current = Math.min(max, Math.max(0, d > 0 ? Math.floor(t + 0.001) + 1 : Math.ceil(t - 0.001) - 1));
    setFrame(timeRef.current);
  };

  const label = scene.frameLabels[Math.round(frame)] ?? "";

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-stage sm:aspect-[16/9]">
        <Canvas camera={{ position: [0, 2.2, 8.5], fov: FOV }} dpr={[1, 2]} shadows>
          <color attach="background" args={["#efede8"]} />
          <CameraRig half={bounds.half} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 6]} intensity={1.6} />
          <directionalLight position={[-6, -2, -4]} intensity={0.4} />
          <Environment resolution={64}>
            <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
            <Lightformer intensity={1} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          </Environment>
          <Molecule
            scene={scene}
            center={bounds.center}
            timeRef={timeRef}
            modeRef={modeRef}
            speedRef={speedRef}
            style={style}
            spin={spin}
            onEnd={() => setMode("paused")}
          />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={Math.max(16, bounds.radius * 5)} />
        </Canvas>
        <div className="pointer-events-none absolute left-3 top-3 max-w-[80%] rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground">
          {label} · frame {Math.round(frame) + 1}/{max + 1}
        </div>
        <p className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-stage-foreground/60">Drag to rotate · pinch to zoom</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={mode === "once" ? "default" : "secondary"}
          onClick={() => {
            if (timeRef.current >= max) timeRef.current = 0;
            setMode("once");
          }}
        >
          <Play /> Play once
        </Button>
        <Button size="sm" variant={mode === "repeat" ? "default" : "secondary"} onClick={() => setMode("repeat")}>
          <Repeat /> <span className="hidden sm:inline">Play repeatedly (backwards and forwards)</span>
          <span className="sm:hidden">Repeat</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setMode("stopped");
            timeRef.current = 0;
            setFrame(0);
          }}
        >
          <Square /> Stop
        </Button>
        <Button size="icon" variant="secondary" onClick={() => jump(-1)} aria-label="Previous frame">
          <ChevronLeft />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => jump(1)} aria-label="Next frame">
          <ChevronRight />
        </Button>
      </div>

      <div className="grid gap-4 rounded-2xl border bg-surface p-4 sm:grid-cols-3 sm:items-center">
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Speed · {speed.toFixed(2)}×</span>
          <Slider value={[speed]} min={0.25} max={2} step={0.05} onValueChange={([v]) => setSpeed(v ?? 1)} aria-label="Animation speed" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={spin} onCheckedChange={setSpin} aria-label="Spin" /> Spin
        </label>
        <ToggleGroup type="single" value={style} onValueChange={(v) => v && setStyle(v as Style)} aria-label="Display style" className="justify-start sm:justify-end">
          <ToggleGroupItem value="ball">Ball &amp; stick</ToggleGroupItem>
          <ToggleGroupItem value="sticks">Sticks</ToggleGroupItem>
          <ToggleGroupItem value="space">Spacefill</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Colour key">
        {legend.map((el) => (
          <li key={el} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full border border-black/10" style={{ background: ELEMENT_INFO[el].color }} aria-hidden />
            {ELEMENT_INFO[el].name}
          </li>
        ))}
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-black/10" style={{ background: ELEMENT_INFO.Cc.color }} aria-hidden />
          Reacting carbon
        </li>
      </ol>
    </div>
  );
}
