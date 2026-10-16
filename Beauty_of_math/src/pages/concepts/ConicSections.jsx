import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const CONE_ANGLE_DEGREES = 45;
const CONE_SLOPE = Math.tan(THREE.MathUtils.degToRad(CONE_ANGLE_DEGREES));
const CONE_HEIGHT = 3.6;
const CONE_RADIUS = CONE_HEIGHT * CONE_SLOPE;
const HALF_HEIGHT = CONE_HEIGHT / 2;
const ANALYTIC_SAMPLE_COUNT = 2400;
const INTERSECTION_RADIUS = 0.04;
const PLANE_SIZE = 7;
const INTERSECTION_RENDER_LIMIT = PLANE_SIZE * 3;

function isBoundedConic(angle) {
  return Math.abs(angle) < CONE_ANGLE_DEGREES;
}

function isSinglePointConic(angle, horizontal, vertical) {
  return Boolean(classifyDegenerateConic(angle, horizontal, vertical)?.detail === "single point");
}

const PRESETS = [
  { name: "Circle", angle: 0, horizontal: 0, vertical: 1.25 },
  { name: "Ellipse", angle: 35, horizontal: 0, vertical: .50 },
  { name: "Parabola", angle: CONE_ANGLE_DEGREES, horizontal: 0, vertical: 0.69 },
  { name: "Hyperbola", angle: 70, horizontal: 1.00, vertical: 0 },
  { name: "Degenerate Parabola", angle: CONE_ANGLE_DEGREES, horizontal: 0, vertical: 0 },
  { name: "Degenerate Hyperbola", angle: 70, horizontal: 0, vertical: 0 },
  { name: "Single Point", angle: 0, horizontal: 0, vertical: 0 },
];

function getPlane(angle, horizontal, vertical) {
  const radians = THREE.MathUtils.degToRad(angle);
  return {
    center: new THREE.Vector3(horizontal, 0, vertical),
    normal: new THREE.Vector3(Math.sin(radians), 0, Math.cos(radians)),
    basisX: new THREE.Vector3(Math.cos(radians), 0, -Math.sin(radians)),
    basisY: new THREE.Vector3(0, 1, 0),
  };
}

function classifyConic(angle) {
  const absoluteAngle = Math.abs(angle);
  if (absoluteAngle < 0.5) return { name: "Circle", eccentricity: "= 0" };
  if (absoluteAngle < CONE_ANGLE_DEGREES - 1) return { name: "Ellipse", eccentricity: "< 1" };
  if (absoluteAngle === CONE_ANGLE_DEGREES) return { name: "Parabola", eccentricity: "= 1" };
  return { name: "Hyperbola", eccentricity: "> 1" };
}

function classifyDegenerateConic(angle, horizontal, vertical) {
  if (Math.abs(horizontal) > 0.005 || Math.abs(vertical) > 0.005) return null;
  const absoluteAngle = Math.abs(angle);
  if (absoluteAngle > CONE_ANGLE_DEGREES + 1.5) {
    return { name: "Degenerate Hyperbola", eccentricity: "> 1", detail: "cross" };
  }
  if (Math.abs(absoluteAngle - CONE_ANGLE_DEGREES) <= 1.5) {
    return { name: "Degenerate Parabola", eccentricity: "= 1", detail: "line" };
  }
  return { name: "Degenerate Ellipse", eccentricity: "< 1", detail: "single point" };
}

function createDoubleCone() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0x47758b,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    roughness: 0.34,
    metalness: 0.08,
    depthWrite: false,
  });
  const upper = new THREE.Mesh(
    new THREE.ConeGeometry(CONE_RADIUS, CONE_HEIGHT, 32, 1, true),
    material,
  );
  upper.position.z = HALF_HEIGHT;
  upper.rotation.x = -Math.PI / 2;
  const lower = new THREE.Mesh(
    new THREE.ConeGeometry(CONE_RADIUS, CONE_HEIGHT, 32, 1, true),
    material,
  );
  lower.position.z = -HALF_HEIGHT;
  lower.rotation.x = Math.PI / 2;
  group.add(upper, lower);
  return group;
}

function createIntersectionPaths(angle, horizontal, vertical) {
  const { center, basisX, basisY } = getPlane(angle, horizontal, vertical);
  const degenerate = classifyDegenerateConic(angle, horizontal, vertical);
  if (degenerate) {
    const radians = THREE.MathUtils.degToRad(angle);
    const tangentSquared = CONE_SLOPE ** 2 * Math.tan(radians) ** 2 - 1;
    if (degenerate.detail === "single point") {
      const point = center.clone();
      return [[point, point.clone()]];
    }
    if (Math.abs(Math.abs(angle) - 90) < 0.5) {
      const lineDirections = [
        new THREE.Vector3(0, CONE_SLOPE, 1),
        new THREE.Vector3(0, -CONE_SLOPE, 1),
      ];
      return lineDirections.map((direction) => {
        const limit = CONE_HEIGHT / Math.abs(direction.z);
        return [direction.clone().multiplyScalar(-limit), direction.clone().multiplyScalar(limit)];
      });
    }
    const y = Math.sqrt(Math.max(0, tangentSquared));
    const direction = new THREE.Vector3(1, y, -Math.tan(radians));
    const limit = CONE_HEIGHT / Math.abs(direction.z);
    const paths = [[
      direction.clone().multiplyScalar(-limit),
      direction.clone().multiplyScalar(limit),
    ]];
    if (y > 0.00001) {
      const secondDirection = new THREE.Vector3(1, -y, -Math.tan(radians));
      paths.push([
        secondDirection.clone().multiplyScalar(-limit),
        secondDirection.clone().multiplyScalar(limit),
      ]);
    }
    return paths;
  }
  const radians = THREE.MathUtils.degToRad(angle);
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  const quadraticA = CONE_SLOPE ** 2 * sine ** 2 - cosine ** 2;
  const quadraticB = -2 * (CONE_SLOPE ** 2 * center.z * sine + center.x * cosine);
  const quadraticC = CONE_SLOPE ** 2 * center.z ** 2 - center.x ** 2;
  const discriminant = quadraticB ** 2 - 4 * quadraticA * quadraticC;
  const uLimit = INTERSECTION_RENDER_LIMIT;
  const intervals = [];
  const evaluate = (u) => quadraticA * u ** 2 + quadraticB * u + quadraticC;
  if (Math.abs(quadraticA) < 0.000001) {
    if (Math.abs(quadraticB) < 0.000001) {
      if (quadraticC >= 0) intervals.push([-uLimit, uLimit]);
    } else {
      const root = -quadraticC / quadraticB;
      if (quadraticB > 0) intervals.push([root, uLimit]);
      else intervals.push([-uLimit, root]);
    }
  } else if (discriminant >= 0) {
    const rootOffset = Math.sqrt(discriminant);
    const roots = [
      (-quadraticB - rootOffset) / (2 * quadraticA),
      (-quadraticB + rootOffset) / (2 * quadraticA),
    ].sort((first, second) => first - second);
    if (quadraticA > 0) {
      intervals.push([-uLimit, roots[0]], [roots[1], uLimit]);
    } else {
      intervals.push([roots[0], roots[1]]);
    }
  }
  const paths = [];
  intervals.forEach(([start, end]) => {
    const sampleCount = Math.max(24, Math.ceil(
      ANALYTIC_SAMPLE_COUNT * Math.min(1, (end - start) / (uLimit * 2)),
    ));
    const upperPath = [];
    const lowerPath = [];
    for (let index = 0; index <= sampleCount; index += 1) {
      const u = start + (end - start) * index / sampleCount;
      const pointOnPlane = center.clone().addScaledVector(basisX, u);
      const y = Math.sqrt(Math.max(0, evaluate(u)));
      upperPath.push(pointOnPlane.clone().addScaledVector(basisY, y));
      lowerPath.push(pointOnPlane.clone().addScaledVector(basisY, -y));
    }
    if (upperPath.length > 1) {
      paths.push(upperPath, lowerPath);
    }
  });
  if (isBoundedConic(angle) && paths.length === 2) {
    return [[
      ...paths[0],
      ...paths[1].slice().reverse(),
    ]];
  }
  return paths;
}

function createFlatPath(points, plane, closed = false) {
  const path = points.map((point, index) => {
    const relative = point.clone().sub(plane.center);
    const x = relative.dot(plane.basisY);
    const y = relative.dot(plane.basisX);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(4)} ${(-y).toFixed(4)}`;
  }).join(" ");
  return closed ? `${path} Z` : path;
}

function getFlatPoint(point, plane) {
  const relative = point.clone().sub(plane.center);
  return {
    x: relative.dot(plane.basisY),
    y: -relative.dot(plane.basisX),
  };
}

function getFlatViewBox(paths, plane) {
  const coordinates = paths.flatMap((points) => points.map((point) => {
    const relative = point.clone().sub(plane.center);
    return [relative.dot(plane.basisY), -relative.dot(plane.basisX)];
  }));
  if (!coordinates.length) return "-3 -3 6 6";
  const xs = coordinates.map(([x]) => x);
  const ys = coordinates.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padding = Math.max((maxX - minX) * 0.12, (maxY - minY) * 0.12, 0.5);
  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}

function formatCameraCoordinate(value) {
  return value === 0 && 1 / value === -Infinity ? "-0.0" : value.toFixed(1);
}

export default function ConicSections() {
  const mountRef = useRef(null);
  const spinningRef = useRef(false);
  const scenePartsRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(1.25);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFlatView, setIsFlatView] = useState(false);
  const [cameraReadout, setCameraReadout] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState("Circle");
  const conic = classifyDegenerateConic(angle, horizontal, vertical) || classifyConic(angle);
  const intersectionPaths = useMemo(
    () => createIntersectionPaths(angle, horizontal, vertical),
    [angle, horizontal, vertical],
  );
  const plane = useMemo(
    () => getPlane(angle, horizontal, vertical),
    [angle, horizontal, vertical],
  );
  const flatPaths = useMemo(
    () => isSinglePointConic(angle, horizontal, vertical)
      ? []
      : intersectionPaths.map((points) => createFlatPath(
        points,
        plane,
        isBoundedConic(angle) && intersectionPaths.length === 1,
      )),
    [angle, horizontal, intersectionPaths, plane, vertical],
  );
  const flatViewBox = useMemo(
    () => getFlatViewBox(intersectionPaths, plane),
    [intersectionPaths, plane],
  );

  useEffect(() => {
    spinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5fbfe);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const initialPosition = new THREE.Vector3(15.0, -0.0, 6.1);
    const initialRotation = new THREE.Euler(
      THREE.MathUtils.degToRad(60),
      0,
      0,
      "XYZ",
    );
    const orbit = {
      yaw: Math.atan2(initialPosition.x, -initialPosition.y),
      pitch: Math.asin(initialPosition.z / initialPosition.length()),
      radius: initialPosition.length(),
    };
    camera.position.copy(initialPosition);
    camera.rotation.copy(initialRotation);
    camera.up.set(0, 0, 1);
    let lastReadout = 0;
    const updateCamera = (lookAtTarget = true, forceReadout = false) => {
      const horizontalRadius = orbit.radius * Math.cos(orbit.pitch);
      camera.position.set(
        horizontalRadius * Math.sin(orbit.yaw),
        -horizontalRadius * Math.cos(orbit.yaw),
        orbit.radius * Math.sin(orbit.pitch),
      );
      if (lookAtTarget) camera.lookAt(0, 0, 0);
      const now = performance.now();
      if (forceReadout || now - lastReadout > 100) {
        lastReadout = now;
        setCameraReadout({ position: camera.position.clone(), rotation: camera.rotation.clone() });
      }
    };
    updateCamera(true, true);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const model = new THREE.Group();
    const cone = createDoubleCone();
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
        new THREE.MeshStandardMaterial({
        color: 0xf5a65b,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    const intersectionGroup = new THREE.Group();
    model.add(cone, planeMesh, intersectionGroup);
    scene.add(model);
    scene.add(new THREE.HemisphereLight(0xbad7ff, 0x131827, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    const pointer = { dragging: false, x: 0, y: 0 };
    const onPointerDown = (event) => {
      event.preventDefault();
      pointer.dragging = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!pointer.dragging) return;
      orbit.yaw += (event.clientX - pointer.x) * 0.01;
      orbit.pitch = THREE.MathUtils.clamp(orbit.pitch + (event.clientY - pointer.y) * 0.01, -1.15, 1.15);
      updateCamera(true, true);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const stopDragging = () => {
      pointer.dragging = false;
    };
    const onWheel = (event) => {
      event.preventDefault();
      orbit.radius = THREE.MathUtils.clamp(orbit.radius + event.deltaY * 0.004, 8, 22);
      updateCamera(true, true);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", stopDragging);
    renderer.domElement.addEventListener("pointercancel", stopDragging);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    scenePartsRef.current = { cone, planeMesh, intersectionGroup };
    let frameId;
    const animate = () => {
      if (spinningRef.current && !pointer.dragging) {
        orbit.yaw += 0.004;
        updateCamera();
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      scenePartsRef.current = null;
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", stopDragging);
      renderer.domElement.removeEventListener("pointercancel", stopDragging);
      renderer.domElement.removeEventListener("wheel", onWheel);
      model.traverse((child) => {
        if (child.isMesh || child.isLine) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const parts = scenePartsRef.current;
    if (!parts) return;
    parts.cone.visible = !isFlatView;
    parts.planeMesh.visible = !isFlatView;
    parts.planeMesh.position.copy(plane.center);
    parts.planeMesh.rotation.set(0, THREE.MathUtils.degToRad(angle), 0);
    parts.intersectionGroup.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    parts.intersectionGroup.clear();
    const closed = isBoundedConic(angle) && intersectionPaths.length === 1;
    intersectionPaths.forEach((points) => {
      if (isSinglePointConic(angle, horizontal, vertical)) {
        const geometry = new THREE.SphereGeometry(INTERSECTION_RADIUS * 2.5, 16, 10);
        const point = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ color: 0xf08a45, depthTest: false }),
        );
        point.position.copy(points[0]);
        point.renderOrder = 3;
        point.visible = !isFlatView;
        parts.intersectionGroup.add(point);
        return;
      }
      const curve = new THREE.CatmullRomCurve3(points, closed, "centripetal");
      const geometry = new THREE.TubeGeometry(
        curve,
        points.length,
        INTERSECTION_RADIUS,
        6,
        closed,
      );
      const line = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color: 0xf08a45, depthTest: false }),
      );
      line.renderOrder = 3;
      line.visible = !isFlatView;
      parts.intersectionGroup.add(line);
    });
  }, [angle, horizontal, intersectionPaths, isFlatView, plane, vertical]);

  const applyPreset = (preset) => {
    setSelectedPreset(preset.name);
    setAngle(preset.angle);
    setHorizontal(preset.horizontal);
    setVertical(preset.vertical);
  };

  const updateAngle = (value) => {
    setSelectedPreset("Custom");
    setAngle(value);
  };

  const updateHorizontal = (value) => {
    setSelectedPreset("Custom");
    setHorizontal(value);
  };

  const updateVertical = (value) => {
    setSelectedPreset("Custom");
    setVertical(value);
  };

  return (
    <section className="conic-explorer" aria-label="Interactive conic sections explorer">
      <div className="conic-heading">
        <div>
          <span className="conic-kicker">Interactive field</span>
          <h2>One cone, four curves</h2>
        </div>
        <span className="conic-status" aria-live="polite">
          {conic.name}{conic.detail ? ` : ${conic.detail}` : ""} : eccentricity {conic.eccentricity}
        </span>
      </div>
      <div className="conic-workspace">
        <div className="conic-stage">
          <div ref={mountRef} className={`conic-canvas ${isFlatView ? "conic-canvas-hidden" : ""}`} aria-label={`${conic.name} slice through a double cone`} />
          {isFlatView && (
            <svg className="conic-flat-view" viewBox={flatViewBox} role="img" aria-label={`Flat view of the ${conic.name}`}>
              {flatPaths.map((path, index) => (
                <path key={`${conic.name}-${index}`} d={path} />
              ))}
              {isSinglePointConic(angle, horizontal, vertical) && intersectionPaths[0]?.[0] && (() => {
                const point = getFlatPoint(intersectionPaths[0][0], plane);
                return <circle cx={point.x} cy={point.y} r="0.12" />;
              })()}
            </svg>
          )}
          <span className="conic-stage-note">{isFlatView ? "Flat view · adjust the sliders" : "Drag to orbit · scroll to zoom"}</span>
          {!isFlatView && cameraReadout && (
            <span className="conic-camera-readout" aria-live="polite">
              <span>Camera: ({formatCameraCoordinate(cameraReadout.position.x)}, {formatCameraCoordinate(cameraReadout.position.y)}, {formatCameraCoordinate(cameraReadout.position.z)})</span>
              <span>Angle: ({THREE.MathUtils.radToDeg(cameraReadout.rotation.x).toFixed(0)}°, {THREE.MathUtils.radToDeg(cameraReadout.rotation.y).toFixed(0)}°, {THREE.MathUtils.radToDeg(cameraReadout.rotation.z).toFixed(0)}°)</span>
            </span>
          )}
        </div>
        <aside className="conic-controls">
          <label className="conic-mobile-selector-label" htmlFor="conic-selector">Choose a conic</label>
          <select
            className="conic-mobile-selector"
            id="conic-selector"
            value={selectedPreset}
            onChange={(event) => {
              const preset = PRESETS.find(({ name }) => name === event.target.value);
              if (preset) applyPreset(preset);
            }}
          >
            {PRESETS.map((preset) => <option key={preset.name} value={preset.name}>{preset.name}</option>)}
            <option value="Custom">Custom</option>
          </select>
          <div className="conic-presets" aria-label="Conic presets">
            {PRESETS.map((preset) => (
              <button
                className={selectedPreset === preset.name ? "active" : ""}
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <label htmlFor="conic-angle">Plane angle, θ: {angle.toFixed(0)}°</label>
          <input id="conic-angle" type="range" min="-90" max="90" step="1" value={angle} onChange={(event) => updateAngle(Number(event.target.value))} />
          <label htmlFor="conic-horizontal">Horizontal position, x: {horizontal.toFixed(2)}</label>
          <input id="conic-horizontal" type="range" min="-1.8" max="1.8" step="0.01" value={horizontal} onChange={(event) => updateHorizontal(Number(event.target.value))} />
          <label htmlFor="conic-vertical">Vertical position, z: {vertical.toFixed(2)}</label>
          <input id="conic-vertical" type="range" min="-1.8" max="1.8" step="0.01" value={vertical} onChange={(event) => updateVertical(Number(event.target.value))} />
          <button className="conic-spin-toggle" type="button" onClick={() => setIsSpinning((value) => !value)}>{isSpinning ? "Pause rotation" : "Resume rotation"}</button>
          <button className="conic-view-toggle" type="button" aria-pressed={isFlatView} onClick={() => setIsFlatView((value) => !value)}>{isFlatView ? "Show 3D cone" : "Show flat conic"}</button>
        </aside>
      </div>
    </section>
  );
}
