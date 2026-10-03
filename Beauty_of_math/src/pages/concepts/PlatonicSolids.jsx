import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SOLIDS = {
  tetrahedron: {
    name: "Tetrahedron",
    faces: "4 triangular faces",
    description: "The simplest Platonic solid, with three faces meeting at every vertex.",
    geometry: () => new THREE.TetrahedronGeometry(1.55),
    color: 0xf5a65b,
  },
  cube: {
    name: "Cube",
    faces: "6 square faces",
    description: "The familiar six-faced solid, dual to the octahedron.",
    geometry: () => new THREE.BoxGeometry(2.2, 2.2, 2.2),
    color: 0x65d6c1,
  },
  octahedron: {
    name: "Octahedron",
    faces: "8 triangular faces",
    description: "Two square pyramids joined at their bases, dual to the cube.",
    geometry: () => new THREE.OctahedronGeometry(1.7),
    color: 0x8ea7ff,
  },
  dodecahedron: {
    name: "Dodecahedron",
    faces: "12 pentagonal faces",
    description: "A twelve-faced solid whose dual is the icosahedron.",
    geometry: () => new THREE.DodecahedronGeometry(1.3),
    color: 0xe587c4,
  },
  icosahedron: {
    name: "Icosahedron",
    faces: "20 triangular faces",
    description: "A highly symmetrical solid with five triangles meeting at every vertex.",
    geometry: () => new THREE.IcosahedronGeometry(1.35),
    color: 0xb8d66b,
  },
};

const SOLID_KEYS = Object.keys(SOLIDS);

export default function PlatonicSolids() {
  const mountRef = useRef(null);
  const spinningRef = useRef(true);
  const [selectedSolid, setSelectedSolid] = useState("tetrahedron");
  const [isSpinning, setIsSpinning] = useState(true);
  const selected = SOLIDS[selectedSolid];

  useEffect(() => {
    spinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5fbfe);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.2, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const solid = new THREE.Mesh(
      selected.geometry(),
      new THREE.MeshStandardMaterial({
        color: selected.color,
        roughness: 0.28,
        metalness: 0.12,
        flatShading: true,
      }),
    );
    scene.add(solid);

    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(solid.geometry),
      new THREE.LineBasicMaterial({ color: 0x16344a, transparent: true, opacity: 0.35 }),
    );
    scene.add(wireframe);

    scene.add(new THREE.HemisphereLight(0xbad7ff, 0x131827, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(selected.color, 10, 8);
    rimLight.position.set(-3, -1, 3);
    scene.add(rimLight);

    const pointer = { dragging: false, x: 0, y: 0 };
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    const onPointerDown = (event) => {
      event.preventDefault();
      pointer.dragging = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!pointer.dragging) return;
      solid.rotation.y += (event.clientX - pointer.x) * 0.01;
      solid.rotation.x += (event.clientY - pointer.y) * 0.01;
      wireframe.rotation.copy(solid.rotation);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const stopDragging = () => {
      pointer.dragging = false;
    };
    const onWheel = (event) => {
      event.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.004, 3.6, 9);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", stopDragging);
    renderer.domElement.addEventListener("pointercancel", stopDragging);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frameId;
    const animate = () => {
      if (spinningRef.current && !pointer.dragging) {
        solid.rotation.y += 0.006;
        wireframe.rotation.copy(solid.rotation);
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", stopDragging);
      renderer.domElement.removeEventListener("pointercancel", stopDragging);
      renderer.domElement.removeEventListener("wheel", onWheel);
      solid.geometry.dispose();
      solid.material.dispose();
      wireframe.geometry.dispose();
      wireframe.material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [selectedSolid, selected]);

  return (
    <section className="platonic-explorer" aria-label="Interactive Platonic solids explorer">
      <div className="platonic-heading">
        <div>
          <span className="platonic-kicker">Interactive field</span>
          <h2>Five perfect solids</h2>
        </div>
        <span className="platonic-status" aria-live="polite">
          {selected.name} / {selected.faces}
        </span>
      </div>
      <div className="platonic-workspace">
        <div className="platonic-stage">
          <div ref={mountRef} className="platonic-canvas" aria-label={`${selected.name} 3D model`} />
          <span className="platonic-stage-note">Drag to orbit · scroll to zoom</span>
        </div>
        <aside className="platonic-controls">
          <label htmlFor="platonic-selector">Choose a solid</label>
          <select
            id="platonic-selector"
            value={selectedSolid}
            onChange={(event) => setSelectedSolid(event.target.value)}
          >
            {SOLID_KEYS.map((key) => (
              <option key={key} value={key}>
                {SOLIDS[key].name}
              </option>
            ))}
          </select>
          <p>{selected.description}</p>
          <button
            className="platonic-spin-toggle"
            type="button"
            onClick={() => setIsSpinning((value) => !value)}
          >
            {isSpinning ? "Pause rotation" : "Resume rotation"}
          </button>
          <div className="platonic-facts">
            <span>Only five exist</span>
            <small>Each face is a congruent regular polygon.</small>
          </div>
        </aside>
      </div>
    </section>
  );
}