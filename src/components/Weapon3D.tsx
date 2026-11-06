"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { WeaponCategoryId } from "@/data/schema";
import { SHAPES } from "./WeaponArt";

export interface Weapon3DHandle {
  reset: () => void;
  zoom: (factor: number) => void;
  setAutoRotate: (on: boolean) => void;
  setExploded: (on: boolean) => void;
}

interface Part {
  group: THREE.Group;
  home: THREE.Vector3;
  out: THREE.Vector3;
}

const OLIVE = 0xa5ae73;
const GOLD = 0xc4a45b;

/**
 * Builds an extruded 3D model from the class schematic. Original geometry —
 * a stand-in until licensed MW4 models exist — and labelled as such in the UI.
 */
function buildModel(category: WeaponCategoryId) {
  const root = new THREE.Group();
  const parts: Part[] = [];
  const body = new THREE.MeshStandardMaterial({ color: 0x3e4541, metalness: 0.8, roughness: 0.34, side: THREE.DoubleSide });
  const face = new THREE.MeshStandardMaterial({ color: 0x56604f, metalness: 0.6, roughness: 0.42, side: THREE.DoubleSide });
  const edge = new THREE.LineBasicMaterial({ color: OLIVE, transparent: true, opacity: 0.85 });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${SHAPES[category].map((d) => `<path d="${d}"/>`).join("")}</svg>`;
  const data = new SVGLoader().parse(svg);
  const bbox = new THREE.Box3();

  data.paths.forEach((p, i) => {
    const shapes = SVGLoader.createShapes(p).filter((s) => Math.abs(THREE.ShapeUtils.area(s.getPoints())) > 20);
    if (!shapes.length) return;
    const pts = shapes[0].getPoints();
    const ys = pts.map((v) => v.y);
    const h = Math.max(...ys) - Math.min(...ys);
    // Thinner parts (barrels, rails) get less depth; bodies get more.
    const depth = Math.min(26, Math.max(7, h * 0.75));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 1.1, bevelSegments: 2, curveSegments: 16 });
    geo.translate(0, 0, -depth / 2);
    const mesh = new THREE.Mesh(geo, [face, body]);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), edge);
    const g = new THREE.Group();
    g.add(mesh, lines);
    g.userData.index = i;
    root.add(g);
    geo.computeBoundingBox();
    bbox.union(geo.boundingBox!);
    parts.push({ group: g, home: new THREE.Vector3(), out: new THREE.Vector3() });
  });

  // SVG y points down — flip, then centre the model on the origin.
  root.scale.set(1, -1, 1);
  const center = bbox.getCenter(new THREE.Vector3());
  root.children.forEach((c) => c.position.sub(new THREE.Vector3(center.x, center.y, 0)));
  root.updateMatrixWorld(true);
  const n = parts.length;
  parts.forEach((p, i) => {
    const pb = new THREE.Box3().setFromObject(p.group);
    const pc = pb.getCenter(new THREE.Vector3());
    p.home.copy(p.group.position);
    const dir = new THREE.Vector3(pc.x, pc.y, 0);
    if (dir.lengthSq() < 1) dir.set(0, 1, 0);
    dir.normalize();
    // Exploded diagram: parts fan out a little in-plane and layer apart in depth.
    p.out.copy(p.home).add(new THREE.Vector3(dir.x * 16, -dir.y * 22, (i - (n - 1) / 2) * 18));
  });
  const size = bbox.getSize(new THREE.Vector3());
  return { root, parts, size };
}

export default function Weapon3D({ category, onReady, autoRotate = true, className = "" }: { category: WeaponCategoryId; onReady?: (h: Weapon3DHandle) => void; autoRotate?: boolean; className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.setAttribute("aria-label", "3D weapon model — drag to rotate, scroll or pinch to zoom, right-drag to pan");
    renderer.domElement.setAttribute("role", "img");

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);
    const { root, parts, size } = buildModel(category);
    const pivot = new THREE.Group();
    pivot.add(root);
    scene.add(pivot);

    scene.add(new THREE.HemisphereLight(0xdfe6d0, 0x0b0e0b, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(200, 260, 320);
    scene.add(key);
    const rim = new THREE.DirectionalLight(GOLD, 2.4);
    rim.position.set(-320, 80, -260);
    scene.add(rim);
    const fill = new THREE.PointLight(OLIVE, 1.2, 0, 0);
    fill.position.set(0, -160, 200);
    scene.add(fill);

    const grid = new THREE.GridHelper(900, 36, 0x3a463c, 0x1f2720);
    grid.position.y = -size.y / 2 - 40;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    scene.add(grid);

    const viewDir = new THREE.Vector3(0.42, 0.24, 0.9).normalize();
    const home = new THREE.Vector3();
    let fitDist = 600;
    let userMoved = false;
    const fit = (aspect: number) => {
      const vt = Math.tan((camera.fov * Math.PI) / 360);
      const ht = vt * aspect;
      // Fill most of the width on wide stages; leave more margin on phones,
      // where the toolbar takes a larger share of the frame. Never overflow vertically.
      const fill = aspect >= 1.6 ? 0.78 : aspect >= 1.1 ? 0.64 : 0.56;
      fitDist = Math.max(size.x / 2 / ht / fill, (size.y * 1.6) / 2 / vt);
      home.copy(viewDir).multiplyScalar(fitDist);
    };
    fit(1.8);
    camera.position.copy(home);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 40;
    controls.maxDistance = 2600;
    controls.autoRotate = autoRotate && !reduce;
    controls.autoRotateSpeed = 1.1;
    controls.zoomToCursor = true;
    controls.maxPolarAngle = Math.PI * 0.8;
    controls.target.set(0, 0, 0);

    let explodedTarget = 0;
    let explode = 0;
    let camGoal: THREE.Vector3 | null = null;
    let intro = reduce ? 1 : 0;

    const stopAuto = () => {
      controls.autoRotate = false;
      userMoved = true;
    };
    controls.addEventListener("start", stopAuto);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit(w / h);
      if (!userMoved) camera.position.copy(home);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (intro < 1) {
        intro = Math.min(1, intro + dt * 0.9);
        const e = 1 - Math.pow(1 - intro, 3);
        pivot.rotation.y = (1 - e) * -1.4;
        pivot.position.y = (1 - e) * -30;
      }
      explode += (explodedTarget - explode) * Math.min(1, dt * 7);
      parts.forEach((p) => p.group.position.lerpVectors(p.home, p.out, explode));
      if (camGoal) {
        camera.position.lerp(camGoal, Math.min(1, dt * 6));
        controls.target.lerp(new THREE.Vector3(), Math.min(1, dt * 6));
        if (camera.position.distanceTo(camGoal) < 0.5) camGoal = null;
      }
      controls.update(dt);
      renderer.render(scene, camera);
    };
    tick();

    onReady?.({
      reset: () => {
        camGoal = home.clone();
        explodedTarget = 0;
      },
      zoom: (f) => {
        const dir = camera.position.clone().sub(controls.target);
        const len = THREE.MathUtils.clamp(dir.length() * f, controls.minDistance, controls.maxDistance);
        camGoal = controls.target.clone().add(dir.setLength(len));
      },
      setAutoRotate: (on) => (controls.autoRotate = on && !reduce),
      setExploded: (on) => {
        explodedTarget = on ? 1 : 0;
        // Pull back (or return) along the current viewing direction so every part stays in frame.
        const dir = camera.position.clone().sub(controls.target).normalize();
        camGoal = dir.multiplyScalar(fitDist * (on ? 1.35 : 1));
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (failed) return <div className={`flex items-center justify-center text-sm text-dim ${className}`}>3D view needs WebGL, which this browser has disabled.</div>;
  return <div ref={mount} className={`h-full w-full cursor-grab active:cursor-grabbing ${className}`} />;
}
