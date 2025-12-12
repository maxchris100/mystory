// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import {
//   PiCursor,
//   PiLineSegment,
//   PiCircle,
//   PiRuler,
//   PiLineSegments,
//   PiArrowFatLineUp,
//   PiGridNine,
//   PiArrowsOutCardinal,
//   PiPolygon,
//   PiCaretDown,
// } from "react-icons/pi";

// interface Extrusion {
//   points: THREE.Vector3[];
//   depth: number;
// }

// interface State {
//   shapes: THREE.Vector3[][] | any[];
//   activePoints: THREE.Vector3[];
//   selectedShapeIndex: number | null;
//   selectedExtrusionIndex: number | null;
//   extrusions: Extrusion[];
//   unit: string;
// }

// const MyThreeScene: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement | null>(null);
//   const lengthInputRef = useRef<HTMLInputElement | null>(null);
//   const extrudeInputRef = useRef<HTMLInputElement | null>(null);
//   const circleInputRef = useRef<HTMLInputElement | null>(null);
//   const moveXInputRef = useRef<HTMLInputElement | null>(null);
//   const moveZInputRef = useRef<HTMLInputElement | null>(null);
//   const moveYInputRef = useRef<HTMLInputElement | null>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<
//     THREE.PerspectiveCamera | THREE.OrthographicCamera | null
//   >(null);
//   const controlsRef = useRef<OrbitControls | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const gridHelperRef = useRef<THREE.Group | null>(null);
//   const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
//   const activeLineRef = useRef<THREE.Line | null>(null);
//   const previewLineRef = useRef<THREE.Line | null>(null);
//   const measureLineRef = useRef<THREE.Line | null>(null);
//   const measureLabelRef = useRef<THREE.Mesh | null>(null);
//   const activeMarkersRef = useRef<THREE.Mesh[]>([]);
//   const shapeObjectsRef = useRef<(THREE.Mesh | THREE.Line)[]>([]);
//   const extrudedObjectsRef = useRef<(THREE.Mesh | THREE.LineSegments)[]>([]);
//   const movePreviewRef = useRef<THREE.Object3D | null>(null);
//   const moveHandlesRef = useRef<THREE.Object3D[]>([]);
//   const tempPointRef = useRef<THREE.Vector3 | null>(null);
//   const moveStartRef = useRef<THREE.Vector3 | null>(null);

//   const [unit, setUnit] = useState<string>("m");
//   const [showLengthInput, setShowLengthInput] = useState<boolean>(false);
//   const [showExtrudeInput, setShowExtrudeInput] = useState<boolean>(false);
//   const [showCircleInput, setShowCircleInput] = useState<boolean>(false);
//   const [showMoveInputs, setShowMoveInputs] = useState<boolean>(false);
//   const [moveError, setMoveError] = useState<string>("");
//   const [extrudeError, setExtrudeError] = useState<string>("");
//   const [circleError, setCircleError] = useState<string>("");
//   const [mode, setMode] = useState<string>("select");
//   const [viewMode, setViewMode] = useState<string>("3d");
//   const [projectionMode, setProjectionMode] = useState<string>("perspective");
//   const [showGrid, setShowGrid] = useState<boolean>(true);
//   const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
//   const [loadedFont, setLoadedFont] = useState<any>(null);
//   const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);
//   const [isDragging, setIsDragging] = useState<boolean>(false);
//   const [moveAxis, setMoveAxis] = useState<string | null>(null);

//   // Persistent drawing state
//   const shapesRef = useRef<THREE.Vector3[][] | any[]>([]);
//   const activePointsRef = useRef<THREE.Vector3[]>([]);
//   const extrusionsRef = useRef<Extrusion[]>([]);
//   const selectedShapeIndexRef = useRef<number | null>(null);
//   const selectedExtrusionIndexRef = useRef<number | null>(null);
//   const rectangleStartRef = useRef<THREE.Vector3 | null>(null);
//   const measurePointsRef = useRef<THREE.Vector3[]>([]);
//   const undoStackRef = useRef<State[]>([]);
//   const redoStackRef = useRef<State[]>([]);
//   const circleCenterRef = useRef<THREE.Vector3 | null>(null);

//   const unitConversions: { [key: string]: number } = {
//     m: 1,
//     cm: 0.01,
//     mm: 0.001,
//     inch: 0.0254,
//   };

//   const baseCameraDistance = 30;
//   const gridSnapSize = 1; // Grid snap size in base units (meters)

//   useEffect(() => {
//     const fontLoader = new FontLoader();
//     fontLoader.load(
//       "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
//       (loadedFont) => {
//         setLoadedFont(loadedFont);
//       }
//     );
//   }, []);

//   // Initialize scene and renderer
//   useEffect(() => {
//     document.body.style.overflow = "hidden";

//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xebebeb);
//     rendererRef.current = renderer;
//     if (mountRef.current) {
//       mountRef.current.appendChild(renderer.domElement);
//     }

//     updateCameraAndControls();
//     updateGridAndAxes(unit);

//     const animate = () => {
//       if (rendererRef.current && sceneRef.current && cameraRef.current) {
//         requestAnimationFrame(animate);
//         if (controlsRef.current) controlsRef.current.update();
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//       }
//     };
//     animate();

//     const handleResize = () => {
//       if (cameraRef.current && rendererRef.current) {
//         const aspect = window.innerWidth / window.innerHeight;
//         if (projectionMode === "perspective") {
//           (cameraRef.current as THREE.PerspectiveCamera).aspect = aspect;
//           (
//             cameraRef.current as THREE.PerspectiveCamera
//           ).updateProjectionMatrix();
//         } else {
//           const frustumSize = 30 * unitConversions[unit];
//           (cameraRef.current as THREE.OrthographicCamera).left =
//             (frustumSize * aspect) / -2;
//           (cameraRef.current as THREE.OrthographicCamera).right =
//             (frustumSize * aspect) / 2;
//           (cameraRef.current as THREE.OrthographicCamera).top = frustumSize / 2;
//           (cameraRef.current as THREE.OrthographicCamera).bottom =
//             frustumSize / -2;
//           (
//             cameraRef.current as THREE.OrthographicCamera
//           ).updateProjectionMatrix();
//         }
//         rendererRef.current.setSize(window.innerWidth, window.innerHeight);
//       }
//     };
//     window.addEventListener("resize", handleResize);

//     renderShapes();
//     renderExtruded();
//     updateActiveLine();
//     updateMeasureLine();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.body.style.overflow = "";
//       if (mountRef.current && renderer.domElement) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     updateCameraAndControls();
//   }, [viewMode, projectionMode, unit]);

//   useEffect(() => {
//     updateGridAndAxes(unit);
//   }, [showGrid, unit]);

//   useEffect(() => {
//     updateMoveHandles();
//   }, [
//     selectedShapeIndexRef.current,
//     selectedExtrusionIndexRef.current,
//     unit,
//     viewMode,
//   ]);

//   const updateGridAndAxes = (currentUnit: string) => {
//     if (!sceneRef.current) return;
//     if (gridHelperRef.current) sceneRef.current.remove(gridHelperRef.current);
//     if (axesHelperRef.current) sceneRef.current.remove(axesHelperRef.current);

//     const gridSize = Math.max(999 * unitConversions[currentUnit], 0.1);
//     gridHelperRef.current = new THREE.Group();
//     const baseGrid = new THREE.GridHelper(gridSize, 999);
//     gridHelperRef.current.add(baseGrid);
//     axesHelperRef.current = new THREE.AxesHelper(
//       10 * unitConversions[currentUnit]
//     );

//     sceneRef.current.add(axesHelperRef.current);
//     if (showGrid) {
//       sceneRef.current.add(gridHelperRef.current);
//     }
//   };

//   const updateCameraAndControls = () => {
//     if (!sceneRef.current || !rendererRef.current) return;

//     const aspect = window.innerWidth / window.innerHeight;
//     let newCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
//     const newCameraDistance = baseCameraDistance * unitConversions[unit];

//     if (projectionMode === "perspective") {
//       newCamera = new THREE.PerspectiveCamera(
//         75,
//         aspect,
//         0.01 * unitConversions[unit],
//         10000 * unitConversions[unit]
//       );
//     } else {
//       const frustumSize = 30 * unitConversions[unit];
//       newCamera = new THREE.OrthographicCamera(
//         (frustumSize * aspect) / -2,
//         (frustumSize * aspect) / 2,
//         frustumSize / 2,
//         frustumSize / -2,
//         0.01 * unitConversions[unit],
//         10000 * unitConversions[unit]
//       );
//     }

//     newCamera.up.set(0, 1, 0);

//     if (viewMode === "2d") {
//       newCamera.position.set(0, newCameraDistance, 0);
//       newCamera.rotation.set(-Math.PI / 2, 0, 0);
//     } else {
//       newCamera.position.set(
//         20 * unitConversions[unit],
//         20 * unitConversions[unit],
//         20 * unitConversions[unit]
//       );
//       newCamera.lookAt(0, 0, 0);
//     }

//     cameraRef.current = newCamera;

//     if (controlsRef.current) {
//       controlsRef.current.dispose();
//     }

//     controlsRef.current = new OrbitControls(
//       newCamera,
//       rendererRef.current.domElement
//     );
//     controlsRef.current.enableDamping = true;
//     controlsRef.current.target.set(0, 0, 0);

//     if (viewMode === "2d") {
//       newCamera.position.set(0, newCameraDistance, 0);
//       newCamera.rotation.set(-Math.PI, -Math.PI, 0);
//       controlsRef.current.enableRotate = false;
//       controlsRef.current.minPolarAngle = 0;
//       controlsRef.current.maxPolarAngle = Math.PI;
//       controlsRef.current.minAzimuthAngle = -Infinity;
//       controlsRef.current.maxAzimuthAngle = Infinity;
//       controlsRef.current.target.set(0, 0, 0);
//     } else {
//       controlsRef.current.enableRotate = true;
//       controlsRef.current.enablePan = true;
//       controlsRef.current.enableZoom = true;
//       controlsRef.current.minPolarAngle = 0;
//       controlsRef.current.maxPolarAngle = Math.PI;
//       controlsRef.current.minAzimuthAngle = -Infinity;
//       controlsRef.current.maxAzimuthAngle = Infinity;
//     }
//     controlsRef.current.update();

//     renderShapes();
//     renderExtruded();
//     updateActiveLine();
//     updateMeasureLine();
//     updateMoveHandles();
//   };

//   const toggleGrid = () => {
//     setShowGrid((prev) => !prev);
//   };

//   const toggleSnapToGrid = () => {
//     setSnapToGrid((prev) => !prev);
//   };

//   const clearActiveMarkers = () => {
//     if (!sceneRef.current) return;
//     activeMarkersRef.current.forEach((m) => sceneRef.current!.remove(m));
//     activeMarkersRef.current = [];
//   };

//   const clearMeasure = () => {
//     if (!sceneRef.current) return;
//     if (measureLineRef.current) {
//       sceneRef.current.remove(measureLineRef.current);
//       measureLineRef.current = null;
//     }
//     if (measureLabelRef.current) {
//       sceneRef.current.remove(measureLabelRef.current);
//       measureLabelRef.current = null;
//     }
//     measurePointsRef.current.length = 0;
//   };

//   const clearPreview = () => {
//     if (!sceneRef.current) return;
//     if (previewLineRef.current) {
//       sceneRef.current.remove(previewLineRef.current);
//       previewLineRef.current = null;
//     }
//     tempPointRef.current = null;
//   };

//   const clearMovePreview = () => {
//     if (!sceneRef.current) return;
//     if (movePreviewRef.current) {
//       sceneRef.current.remove(movePreviewRef.current);
//       movePreviewRef.current = null;
//     }
//   };

//   const updateActiveLine = () => {
//     if (!sceneRef.current) return;
//     if (activeLineRef.current) sceneRef.current.remove(activeLineRef.current);
//     clearActiveMarkers();

//     const activePoints = activePointsRef.current;
//     if (activePoints.length > 0) {
//       const markerMat = new THREE.MeshBasicMaterial({ color: 0xbb0000 });
//       activePoints.forEach((p, i) => {
//         const geo = new THREE.SphereGeometry(
//           0.1 * unitConversions[unit],
//           16,
//           16
//         );
//         const mat =
//           i === activePoints.length - 1
//             ? new THREE.MeshBasicMaterial({ color: 0x00bb00 })
//             : markerMat;
//         const marker = new THREE.Mesh(geo, mat);
//         marker.position.copy(p);
//         sceneRef.current!.add(marker);
//         activeMarkersRef.current.push(marker);
//       });
//     }

//     if (activePoints.length >= 2) {
//       const geometry = new THREE.BufferGeometry().setFromPoints(activePoints);
//       const material = new THREE.LineBasicMaterial({ color: 0x00bb00 });
//       activeLineRef.current = new THREE.Line(geometry, material);
//       sceneRef.current.add(activeLineRef.current);
//     }
//   };

//   const updateMeasureLine = () => {
//     if (!sceneRef.current) return;
//     if (measureLineRef.current) sceneRef.current.remove(measureLineRef.current);
//     if (measureLabelRef.current)
//       sceneRef.current.remove(measureLabelRef.current);

//     const measurePoints = measurePointsRef.current;
//     if (measurePoints.length === 2) {
//       const geometry = new THREE.BufferGeometry().setFromPoints(measurePoints);
//       const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
//       measureLineRef.current = new THREE.Line(geometry, material);
//       sceneRef.current.add(measureLineRef.current);

//       if (loadedFont) {
//         const distance =
//           measurePoints[0].distanceTo(measurePoints[1]) / unitConversions[unit];
//         const textGeo = new TextGeometry(`${distance.toFixed(2)} ${unit}`, {
//           font: loadedFont,
//           size: 0.3 * unitConversions[unit],
//           depth: 0.025 * unitConversions[unit],
//         });
//         const textMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
//         measureLabelRef.current = new THREE.Mesh(textGeo, textMat);

//         const midPoint = measurePoints[0].clone().lerp(measurePoints[1], 0.5);
//         measureLabelRef.current.position.set(
//           midPoint.x + 1 * unitConversions[unit],
//           midPoint.y,
//           midPoint.z
//         );

//         const direction = measurePoints[1]
//           .clone()
//           .sub(measurePoints[0])
//           .normalize();
//         const quaternion = new THREE.Quaternion();
//         const up = new THREE.Vector3(0, 1, 0);
//         const axis = new THREE.Vector3(1, 0, 0);
//         const targetAxis = direction;
//         quaternion.setFromUnitVectors(axis, targetAxis);
//         measureLabelRef.current.setRotationFromQuaternion(quaternion);
//         measureLabelRef.current.rotateX(Math.PI / 2);
//         measureLabelRef.current.rotateY(Math.PI);
//         sceneRef.current.add(measureLabelRef.current);
//       }
//     }
//   };

//   const renderShapes = () => {
//     if (!sceneRef.current) return;
//     shapeObjectsRef.current.forEach((obj) => sceneRef.current!.remove(obj));
//     shapeObjectsRef.current.length = 0;

//     const shapes = shapesRef.current;
//     shapes.forEach((shape, idx) => {
//       let geom: THREE.BufferGeometry;
//       if ((shape as any).isCircle) {
//         const radius = (shape as any).radius * unitConversions[unit];
//         geom = new THREE.CircleGeometry(radius, 64);
//         geom.rotateX(Math.PI / 2);
//         geom.translate(
//           (shape as any).center.x,
//           (shape as any).center.y || 0,
//           (shape as any).center.z
//         );
//       } else {
//         const pts2D = shape.map((p: any) => new THREE.Vector2(p.x, p.z));
//         const shape2D = new THREE.Shape(pts2D);
//         geom = new THREE.ShapeGeometry(shape2D);
//         geom.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
//         geom.translate(0, shape[0].y || 0, 0);
//       }

//       const mat = new THREE.MeshBasicMaterial({
//         color: idx === selectedShapeIndexRef.current ? 0x0000ff : 0x00ff00,
//         opacity: 0.3,
//         transparent: true,
//         side: THREE.DoubleSide,
//       });
//       const mesh = new THREE.Mesh(geom, mat);
//       (mesh.userData as any).shapeIndex = idx;
//       (mesh.userData as any).isShape = true;
//       mesh.updateMatrixWorld();
//       sceneRef.current!.add(mesh);
//       shapeObjectsRef.current.push(mesh);

//       const points = (shape as any).isCircle
//         ? createCirclePoints((shape as any).center, (shape as any).radius, 64)
//         : shape;
//       const geometry = new THREE.BufferGeometry().setFromPoints(points);
//       const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
//       const line = new THREE.LineLoop(geometry, lineMat);
//       (line.userData as any).shapeIndex = idx;
//       (line.userData as any).isShape = true;
//       line.updateMatrixWorld();
//       sceneRef.current!.add(line);
//       shapeObjectsRef.current.push(line);
//     });
//   };

//   const renderExtruded = () => {
//     if (!sceneRef.current) return;
//     extrudedObjectsRef.current.forEach((obj) => sceneRef.current!.remove(obj));
//     extrudedObjectsRef.current.length = 0;

//     const extrusions = extrusionsRef.current;
//     extrusions.forEach((ext, idx) => {
//       const shape2D = new THREE.Shape(
//         ext.points.map((p) => new THREE.Vector2(p.x, p.z))
//       );
//       const extrudeSettings = {
//         depth: ext.depth * unitConversions[unit],
//         bevelEnabled: false,
//       };
//       const geometry = new THREE.ExtrudeGeometry(shape2D, extrudeSettings);
//       geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
//       geometry.translate(0, ext.depth * unitConversions[unit], 0);
//       geometry.computeVertexNormals();

//       const mat = new THREE.MeshBasicMaterial({
//         color: idx === selectedExtrusionIndexRef.current ? 0x0000ff : 0xebebeb,
//         side: THREE.DoubleSide,
//       });
//       const mesh = new THREE.Mesh(geometry, mat);
//       (mesh.userData as any).isExtruded = true;
//       (mesh.userData as any).shapeIndex = idx;
//       mesh.updateMatrixWorld();
//       sceneRef.current!.add(mesh);
//       extrudedObjectsRef.current.push(mesh);

//       const edgeGeom = new THREE.EdgesGeometry(geometry);
//       const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000 });
//       const edges = new THREE.LineSegments(edgeGeom, edgeMat);
//       (edges.userData as any).shapeIndex = idx;
//       (edges.userData as any).isExtruded = true;
//       edges.updateMatrixWorld();
//       sceneRef.current!.add(edges);
//       extrudedObjectsRef.current.push(edges);
//     });
//   };

//   const updateMoveHandles = () => {
//     if (!sceneRef.current) return;
//     moveHandlesRef.current.forEach((handle) =>
//       sceneRef.current!.remove(handle)
//     );
//     moveHandlesRef.current = [];

//     if (
//       (selectedShapeIndexRef.current === null &&
//         selectedExtrusionIndexRef.current === null) ||
//       mode !== "move"
//     ) {
//       return;
//     }

//     const center = new THREE.Vector3();
//     if (selectedShapeIndexRef.current !== null) {
//       const shape = shapesRef.current[selectedShapeIndexRef.current];
//       if ((shape as any).isCircle) {
//         center.copy((shape as any).center);
//       } else {
//         const box = new THREE.Box3();
//         shape.forEach((p: THREE.Vector3) => box.expandByPoint(p));
//         box.getCenter(center);
//       }
//     } else if (selectedExtrusionIndexRef.current !== null) {
//       const extrusion =
//         extrusionsRef.current[selectedExtrusionIndexRef.current];
//       const box = new THREE.Box3();
//       extrusion.points.forEach((p) => box.expandByPoint(p));
//       box.getCenter(center);
//       center.y = (extrusion.depth * unitConversions[unit]) / 2;
//     }

//     const handleSize = 1 * unitConversions[unit];
//     const handleMaterial = (color: number) =>
//       new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });

//     // X-axis handle (red arrow)
//     const xHandleGeo = new THREE.ConeGeometry(handleSize / 4, handleSize, 16);
//     xHandleGeo.rotateZ(-Math.PI / 2);
//     xHandleGeo.translate(handleSize, 0, 0);
//     const xHandle = new THREE.Mesh(xHandleGeo, handleMaterial(0xff0000));
//     xHandle.position.copy(center);
//     (xHandle.userData as any).axis = "x";
//     sceneRef.current.add(xHandle);
//     moveHandlesRef.current.push(xHandle);

//     // Z-axis handle (blue arrow)
//     const zHandleGeo = new THREE.ConeGeometry(handleSize / 4, handleSize, 16);
//     zHandleGeo.translate(0, 0, handleSize);
//     const zHandle = new THREE.Mesh(zHandleGeo, handleMaterial(0x0000ff));
//     zHandle.position.copy(center);
//     (zHandle.userData as any).axis = "z";
//     sceneRef.current.add(zHandle);
//     moveHandlesRef.current.push(zHandle);

//     // Y-axis handle (green arrow) for both shapes and extrusions in 3D view
//     if (viewMode === "3d") {
//       const yHandleGeo = new THREE.ConeGeometry(handleSize / 4, handleSize, 16);
//       yHandleGeo.rotateX(Math.PI / 2);
//       yHandleGeo.translate(0, handleSize, 0);
//       const yHandle = new THREE.Mesh(yHandleGeo, handleMaterial(0x00ff00));
//       yHandle.position.copy(center);
//       (yHandle.userData as any).axis = "y";
//       sceneRef.current.add(yHandle);
//       moveHandlesRef.current.push(yHandle);
//     }
//   };

//   const cloneState = (): State => {
//     return {
//       shapes: shapesRef.current.map((s) => {
//         if ((s as any).isCircle) {
//           return {
//             ...s,
//             center: (s as any).center.clone(),
//             isCircle: true,
//             radius: (s as any).radius,
//           };
//         }
//         return s.map((p: any) => p.clone());
//       }),
//       activePoints: activePointsRef.current.map((p) => p.clone()),
//       selectedShapeIndex: selectedShapeIndexRef.current,
//       selectedExtrusionIndex: selectedExtrusionIndexRef.current,
//       extrusions: extrusionsRef.current.map((e) => ({
//         points: e.points.map((p) => p.clone()),
//         depth: e.depth,
//       })),
//       unit,
//     };
//   };

//   const restoreState = (state: State) => {
//     shapesRef.current.length = 0;
//     shapesRef.current.push(...state.shapes);
//     activePointsRef.current.length = 0;
//     activePointsRef.current.push(...state.activePoints);
//     selectedShapeIndexRef.current = state.selectedShapeIndex;
//     selectedExtrusionIndexRef.current = state.selectedExtrusionIndex;
//     extrusionsRef.current.length = 0;
//     extrusionsRef.current.push(...state.extrusions);
//     setUnit(state.unit);
//     updateSceneForUnit(state.unit);
//   };

//   const pushUndo = () => {
//     undoStackRef.current.push(cloneState());
//     redoStackRef.current.length = 0;
//   };

//   const createRectangle = (start: THREE.Vector3, end: THREE.Vector3) => {
//     const points = [
//       new THREE.Vector3(start.x, start.y || 0, start.z),
//       new THREE.Vector3(end.x, start.y || 0, start.z),
//       new THREE.Vector3(end.x, start.y || 0, end.z),
//       new THREE.Vector3(start.x, start.y || 0, end.z),
//     ];
//     return points;
//   };

//   const createCirclePoints = (
//     center: THREE.Vector3,
//     radius: number,
//     segments: number
//   ) => {
//     const points: THREE.Vector3[] = [];
//     const scaledRadius = radius * unitConversions[unit];
//     for (let i = 0; i < segments; i++) {
//       const theta = (i / segments) * Math.PI * 2;
//       points.push(
//         new THREE.Vector3(
//           center.x + scaledRadius * Math.cos(theta),
//           center.y || 0,
//           center.z + scaledRadius * Math.sin(theta)
//         )
//       );
//     }
//     return points;
//   };

//   const createCircle = (center: THREE.Vector3, radius: number) => {
//     return { isCircle: true, center, radius } as any;
//   };

//  const extrudeShape = (depth: number) => {
//   if (selectedShapeIndexRef.current === null) return;
//   const shape = shapesRef.current[selectedShapeIndexRef.current];
//   let points: THREE.Vector3[];
//   if ((shape as any).isCircle) {
//     points = createCirclePoints(
//       (shape as any).center,
//       (shape as any).radius,
//       64
//     );
//   } else {
//     points = shape.map((p: any) => p.clone());
//   }
//   extrusionsRef.current.push({ points, depth });
//   shapesRef.current.splice(selectedShapeIndexRef.current, 1);
//   selectedShapeIndexRef.current = null;
//   renderShapes();
//   renderExtruded();
// };

//   const moveShape = (index: number, delta: THREE.Vector3) => {
//     const shape = shapesRef.current[index];
//     if ((shape as any).isCircle) {
//       (shape as any).center.add(delta);
//     } else {
//       shape.forEach((point: THREE.Vector3) => point.add(delta));
//     }
//     renderShapes();
//   };

//   const moveExtrusion = (index: number, delta: THREE.Vector3) => {
//     const extrusion = extrusionsRef.current[index];
//     extrusion.points.forEach((point: THREE.Vector3) => point.add(delta));
//     renderExtruded();
//   };

//   const deleteSelected = () => {
//     if (!sceneRef.current) return;
//     let deleted = false;
//     if (selectedShapeIndexRef.current !== null) {
//       pushUndo();
//       shapesRef.current.splice(selectedShapeIndexRef.current, 1);
//       selectedShapeIndexRef.current = null;
//       renderShapes();
//       deleted = true;
//     }
//     if (selectedExtrusionIndexRef.current !== null) {
//       pushUndo();
//       extrusionsRef.current.splice(selectedExtrusionIndexRef.current, 1);
//       selectedExtrusionIndexRef.current = null;
//       renderExtruded();
//       deleted = true;
//     }
//     if (deleted) {
//       renderShapes();
//       renderExtruded();
//     }
//   };

//   const updateSceneForUnit = (newUnit: string) => {
//     const scaleFactor = unitConversions[unit] / unitConversions[newUnit];
//     const newCameraDistance = baseCameraDistance * unitConversions[newUnit];

//     if (cameraRef.current) {
//       if (viewMode === "2d") {
//         cameraRef.current.position.set(0, newCameraDistance, 0);
//         cameraRef.current.rotation.set(-Math.PI / 2, 0, 0);
//       } else {
//         cameraRef.current.position.multiplyScalar(scaleFactor);
//       }

//       if (projectionMode === "perspective") {
//         (cameraRef.current as THREE.PerspectiveCamera).near =
//           0.01 * unitConversions[newUnit];
//         (cameraRef.current as THREE.PerspectiveCamera).far =
//           10000 * unitConversions[newUnit];
//         (cameraRef.current as THREE.PerspectiveCamera).updateProjectionMatrix();
//       } else {
//         const aspect = window.innerWidth / window.innerHeight;
//         const frustumSize = 30 * unitConversions[newUnit];
//         (cameraRef.current as THREE.OrthographicCamera).left =
//           (frustumSize * aspect) / -2;
//         (cameraRef.current as THREE.OrthographicCamera).right =
//           (frustumSize * aspect) / 2;
//         (cameraRef.current as THREE.OrthographicCamera).top = frustumSize / 2;
//         (cameraRef.current as THREE.OrthographicCamera).bottom =
//           frustumSize / -2;
//         (cameraRef.current as THREE.OrthographicCamera).near =
//           0.01 * unitConversions[newUnit];
//         (cameraRef.current as THREE.OrthographicCamera).far =
//           10000 * unitConversions[newUnit];
//         (
//           cameraRef.current as THREE.OrthographicCamera
//         ).updateProjectionMatrix();
//       }
//     }

//     if (controlsRef.current) {
//       controlsRef.current.target.multiplyScalar(scaleFactor);
//       controlsRef.current.update();
//     }

//     shapesRef.current.forEach((shape) => {
//       if ((shape as any).isCircle) {
//         (shape as any).center.multiplyScalar(scaleFactor);
//         (shape as any).radius *= scaleFactor;
//       } else {
//         shape.forEach((point: any) => point.multiplyScalar(scaleFactor));
//       }
//     });

//     extrusionsRef.current.forEach((ext) => {
//       ext.points.forEach((point) => point.multiplyScalar(scaleFactor));
//       ext.depth *= scaleFactor;
//     });

//     activePointsRef.current.forEach((point) =>
//       point.multiplyScalar(scaleFactor)
//     );
//     measurePointsRef.current.forEach((point) =>
//       point.multiplyScalar(scaleFactor)
//     );
//     if (rectangleStartRef.current) {
//       rectangleStartRef.current.multiplyScalar(scaleFactor);
//     }
//     if (circleCenterRef.current) {
//       circleCenterRef.current.multiplyScalar(scaleFactor);
//     }
//     if (moveStartRef.current) {
//       moveStartRef.current.multiplyScalar(scaleFactor);
//     }

//     setUnit(newUnit);
//     renderShapes();
//     renderExtruded();
//     updateActiveLine();
//     updateMoveHandles();
//     updateMeasureLine();
//   };

//   const snapPointToGrid = (point: THREE.Vector3): THREE.Vector3 => {
//     if (!snapToGrid) return point;
//     const snapSize = gridSnapSize * unitConversions[unit];
//     return new THREE.Vector3(
//       Math.round(point.x / snapSize) * snapSize,
//       Math.round(point.y / snapSize) * snapSize,
//       Math.round(point.z / snapSize) * snapSize
//     );
//   };

//   const createMovePreview = (delta: THREE.Vector3) => {
//     if (!sceneRef.current) return;
//     clearMovePreview();

//     let geometry: THREE.BufferGeometry;
//     let material: THREE.Material;
//     let isShape = selectedShapeIndexRef.current !== null;

//     if (isShape) {
//       const shape = shapesRef.current[selectedShapeIndexRef.current!];
//       if ((shape as any).isCircle) {
//         const radius = (shape as any).radius * unitConversions[unit];
//         geometry = new THREE.CircleGeometry(radius, 64);
//         geometry.rotateX(Math.PI / 2);
//         geometry.translate(
//           (shape as any).center.x + delta.x,
//           (shape as any).center.y + delta.y,
//           (shape as any).center.z + delta.z
//         );
//         material = new THREE.MeshBasicMaterial({
//           color: 0x0000ff,
//           opacity: 0.5,
//           transparent: true,
//           side: THREE.DoubleSide,
//         });
//       } else {
//         const pts2D = shape.map(
//           (p: any) => new THREE.Vector2(p.x + delta.x, p.z + delta.z)
//         );
//         const shape2D = new THREE.Shape(pts2D);
//         geometry = new THREE.ShapeGeometry(shape2D);
//         geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
//         geometry.translate(0, shape[0].y + delta.y, 0);
//         material = new THREE.MeshBasicMaterial({
//           color: 0x0000ff,
//           opacity: 0.5,
//           transparent: true,
//           side: THREE.DoubleSide,
//         });
//       }
//     } else {
//       const extrusion =
//         extrusionsRef.current[selectedExtrusionIndexRef.current!];
//       const shape2D = new THREE.Shape(
//         extrusion.points.map(
//           (p) => new THREE.Vector2(p.x + delta.x, p.z + delta.z)
//         )
//       );
//       const extrudeSettings = {
//         depth: extrusion.depth * unitConversions[unit],
//         bevelEnabled: false,
//       };
//       geometry = new THREE.ExtrudeGeometry(shape2D, extrudeSettings);
//       geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
//       geometry.translate(
//         0,
//         extrusion.depth * unitConversions[unit] + delta.y,
//         0
//       );
//       material = new THREE.MeshBasicMaterial({
//         color: 0x0000ff,
//         opacity: 0.5,
//         transparent: true,
//         side: THREE.DoubleSide,
//       });
//     }

//     movePreviewRef.current = new THREE.Mesh(geometry, material);
//     sceneRef.current.add(movePreviewRef.current);
//   };

//   const handleMouseDown = (event: MouseEvent) => {
//     if (!cameraRef.current || !sceneRef.current || mode !== "move") return;
//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, cameraRef.current);
//     raycaster.params.Line = { threshold: 0.1 * unitConversions[unit] };
//     raycaster.params.Mesh = { threshold: 0.1 * unitConversions[unit] };

//     // Check for handle intersection first
//     const handleIntersects = raycaster.intersectObjects(
//       moveHandlesRef.current,
//       true
//     );
//     if (handleIntersects.length > 0) {
//       const handle = handleIntersects[0].object;
//       setMoveAxis((handle.userData as any).axis);
//       const point = handleIntersects[0].point;
//       moveStartRef.current = point.clone();
//       setIsDragging(true);
//       setShowMoveInputs(true);
//       if (moveXInputRef.current) moveXInputRef.current.value = "0";
//       if (moveZInputRef.current) moveZInputRef.current.value = "0";
//       if (moveYInputRef.current) moveYInputRef.current.value = "0";
//       return;
//     }

//     // Check for object intersection
//     const pickables = [
//       ...shapeObjectsRef.current.filter((obj) => (obj as THREE.Mesh).isMesh),
//       ...extrudedObjectsRef.current.filter((obj) => (obj as THREE.Mesh).isMesh),
//     ];
//     pickables.forEach((o) => o.updateMatrixWorld());
//     const intersects = raycaster.intersectObjects(pickables, true);

//     if (intersects.length > 0) {
//       const obj = intersects[0].object;
//       const userData = obj.userData as any;
//       pushUndo();
//       if (userData.isShape) {
//         selectedShapeIndexRef.current = userData.shapeIndex;
//         selectedExtrusionIndexRef.current = null;
//       } else if (userData.isExtruded) {
//         selectedExtrusionIndexRef.current = userData.shapeIndex;
//         selectedShapeIndexRef.current = null;
//       }
//       const plane = new THREE.Plane(
//         viewMode === "2d"
//           ? new THREE.Vector3(0, 1, 0)
//           : cameraRef.current.getWorldDirection(new THREE.Vector3()).negate(),
//         0
//       );
//       const point = new THREE.Vector3();
//       if (raycaster.ray.intersectPlane(plane, point)) {
//         moveStartRef.current = snapPointToGrid(point.clone());
//       }
//       setIsDragging(true);
//       setShowMoveInputs(true);
//       if (moveXInputRef.current) moveXInputRef.current.value = "0";
//       if (moveZInputRef.current) moveZInputRef.current.value = "0";
//       if (moveYInputRef.current) moveYInputRef.current.value = "0";
//       renderShapes();
//       renderExtruded();
//       updateMoveHandles();
//     }
//   };

//   const handleMouseMove = (event: MouseEvent) => {
//     if (!cameraRef.current || !sceneRef.current) return;
//     if (mode === "move" && isDragging && moveStartRef.current) {
//       const mouse = new THREE.Vector2();
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, cameraRef.current);

//       const plane = new THREE.Plane(
//         viewMode === "2d"
//           ? new THREE.Vector3(0, 1, 0)
//           : cameraRef.current.getWorldDirection(new THREE.Vector3()).negate(),
//         0
//       );
//       const point = new THREE.Vector3();
//       if (raycaster.ray.intersectPlane(plane, point)) {
//         const snappedPoint = snapPointToGrid(point.clone());
//         let delta = snappedPoint.clone().sub(moveStartRef.current);

//         if (moveAxis === "x") {
//           delta.set(delta.x, 0, 0);
//         } else if (moveAxis === "z") {
//           delta.set(0, 0, delta.z);
//         } else if (moveAxis === "y") {
//           delta.set(0, delta.y, 0);
//         } else if (event.shiftKey) {
//           delta.set(delta.x, 0, 0);
//           setMoveAxis("x");
//         } else if (event.altKey) {
//           delta.set(0, 0, delta.z);
//           setMoveAxis("z");
//         } else if (event.ctrlKey && viewMode === "3d") {
//           delta.set(0, delta.y, 0);
//           setMoveAxis("y");
//         } else if (viewMode === "3d") {
//           // Allow free movement in 3D for both shapes and extrusions
//         } else {
//           delta.y = 0; // Restrict Y movement in 2D view
//         }

//         if (selectedShapeIndexRef.current !== null) {
//           moveShape(selectedShapeIndexRef.current, delta);
//         } else if (selectedExtrusionIndexRef.current !== null) {
//           moveExtrusion(selectedExtrusionIndexRef.current, delta);
//         }
//         moveStartRef.current = snappedPoint.clone();
//         createMovePreview(delta);

//         // Update input fields
//         if (moveXInputRef.current)
//           moveXInputRef.current.value = (
//             delta.x / unitConversions[unit]
//           ).toFixed(2);
//         if (moveZInputRef.current)
//           moveZInputRef.current.value = (
//             delta.z / unitConversions[unit]
//           ).toFixed(2);
//         if (moveYInputRef.current)
//           moveYInputRef.current.value = (
//             delta.y / unitConversions[unit]
//           ).toFixed(2);
//       }
//       return;
//     }
//     if (mode !== "sketch" && mode !== "orthogonal" && mode !== "measure") {
//       setShowLengthInput(false);
//       return;
//     }
//     if (mode !== "measure") setShowLengthInput(true);

//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, cameraRef.current);

//     const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
//     let point: THREE.Vector3 | null = null;
//     if (mode === "measure") {
//       const intersects = raycaster.intersectObjects(
//         extrudedObjectsRef.current.filter((obj) => (obj as THREE.Mesh).isMesh),
//         true
//       );
//       if (intersects.length > 0) {
//         point = intersects[0].point.clone();
//       } else {
//         const tempPoint = new THREE.Vector3();
//         if (raycaster.ray.intersectPlane(plane, tempPoint)) {
//           point = tempPoint.clone();
//         }
//       }
//     } else {
//       const tempPoint = new THREE.Vector3();
//       if (raycaster.ray.intersectPlane(plane, tempPoint)) {
//         point = tempPoint.clone();
//       }
//     }

//     if (point) {
//       tempPointRef.current = point.clone();
//       let lastPoint: THREE.Vector3 | null = null;
//       if (mode === "measure" && measurePointsRef.current.length > 0) {
//         lastPoint =
//           measurePointsRef.current[measurePointsRef.current.length - 1];
//       } else if (mode !== "measure" && activePointsRef.current.length > 0) {
//         lastPoint = activePointsRef.current[activePointsRef.current.length - 1];
//       }

//       if (lastPoint) {
//         if (mode === "orthogonal") {
//           const dx = Math.abs(tempPointRef.current.x - lastPoint.x);
//           const dz = Math.abs(tempPointRef.current.z - lastPoint.z);
//           if (activePointsRef.current.length >= 2) {
//             const secondLastPoint =
//               activePointsRef.current[activePointsRef.current.length - 2];
//             const wasLastHorizontal =
//               Math.abs(lastPoint.x - secondLastPoint.x) >
//               Math.abs(lastPoint.z - secondLastPoint.z);
//             if (wasLastHorizontal) {
//               tempPointRef.current.x = lastPoint.x;
//             } else {
//               tempPointRef.current.z = lastPoint.z;
//             }
//           } else {
//             if (dx > dz) {
//               tempPointRef.current.z = lastPoint.z;
//             } else {
//               tempPointRef.current.x = lastPoint.x;
//             }
//           }
//         }

//         const length =
//           lastPoint.distanceTo(tempPointRef.current) / unitConversions[unit];
//         if (
//           mode !== "measure" &&
//           lengthInputRef.current &&
//           document.activeElement !== lengthInputRef.current
//         ) {
//           lengthInputRef.current.value = length.toFixed(2);
//         }

//         if (previewLineRef.current)
//           sceneRef.current!.remove(previewLineRef.current);
//         const previewPoints = [lastPoint, tempPointRef.current];
//         const previewGeom = new THREE.BufferGeometry().setFromPoints(
//           previewPoints
//         );
//         const previewMat = new THREE.LineBasicMaterial({
//           color: mode === "measure" ? 0x0000ff : 0x0000ff,
//           linewidth: 2,
//         });
//         previewLineRef.current = new THREE.Line(previewGeom, previewMat);
//         sceneRef.current!.add(previewLineRef.current);
//       }
//     }
//   };

//   const handleMouseUp = () => {
//     if (mode === "move" && isDragging) {
//       setIsDragging(false);
//       setMoveAxis(null);
//       moveStartRef.current = null;
//       clearMovePreview();
//       renderShapes();
//       renderExtruded();
//       updateMoveHandles();
//     }
//   };

//   const handleClick = (event: MouseEvent) => {
//     if (!cameraRef.current || !sceneRef.current) return;
//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, cameraRef.current);
//     raycaster.params.Line = { threshold: 0.1 * unitConversions[unit] };
//     raycaster.params.Mesh = { threshold: 0.1 * unitConversions[unit] };

//     const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
//     let point: THREE.Vector3 | null = null;
//     if (mode === "measure") {
//       const intersects = raycaster.intersectObjects(
//         extrudedObjectsRef.current.filter((obj) => (obj as THREE.Mesh).isMesh),
//         true
//       );
//       if (intersects.length > 0) {
//         point = intersects[0].point.clone();
//       } else {
//         const tempPoint = new THREE.Vector3();
//         if (raycaster.ray.intersectPlane(plane, tempPoint)) {
//           point = tempPoint.clone();
//         }
//       }
//     } else {
//       const tempPoint = new THREE.Vector3();
//       if (raycaster.ray.intersectPlane(plane, tempPoint)) {
//         point = tempPoint.clone();
//       }
//     }

//     if (point) {
//       let scaledPoint = snapPointToGrid(point.clone());
//       if (mode === "sketch" || mode === "orthogonal") {
//         pushUndo();
//         if (activePointsRef.current.length === 0) {
//           activePointsRef.current.push(
//             new THREE.Vector3(scaledPoint.x, scaledPoint.y || 0, scaledPoint.z)
//           );
//           updateActiveLine();
//         } else {
//           let newPoint = scaledPoint.clone();
//           const lastPoint =
//             activePointsRef.current[activePointsRef.current.length - 1];

//           if (mode === "orthogonal") {
//             const dx = Math.abs(newPoint.x - lastPoint.x);
//             const dz = Math.abs(newPoint.z - lastPoint.z);
//             if (activePointsRef.current.length >= 1) {
//               if (activePointsRef.current.length >= 2) {
//                 const secondLastPoint =
//                   activePointsRef.current[activePointsRef.current.length - 2];
//                 const wasLastHorizontal =
//                   Math.abs(lastPoint.x - secondLastPoint.x) >
//                   Math.abs(lastPoint.z - secondLastPoint.z);
//                 if (wasLastHorizontal) {
//                   newPoint.x = lastPoint.x;
//                 } else {
//                   newPoint.z = lastPoint.z;
//                 }
//               } else {
//                 if (dx > dz) {
//                   newPoint.z = lastPoint.z;
//                 } else {
//                   newPoint.x = lastPoint.x;
//                 }
//               }
//             }
//           }

//           const inputValue = lengthInputRef.current?.value;
//           const newLength = inputValue
//             ? parseFloat(inputValue)
//             : lastPoint.distanceTo(newPoint);
//           if (!isNaN(newLength)) {
//             const dir = newPoint.clone().sub(lastPoint).normalize();
//             newPoint = lastPoint
//               .clone()
//               .add(dir.multiplyScalar(newLength * unitConversions[unit]));
//           }

//           activePointsRef.current.push(
//             new THREE.Vector3(newPoint.x, newPoint.y || 0, newPoint.z)
//           );
//           updateActiveLine();
//           clearPreview();
//           setShowLengthInput(activePointsRef.current.length > 0);
//         }
//       } else if (mode === "rectangle") {
//         if (!rectangleStartRef.current) {
//           rectangleStartRef.current = new THREE.Vector3(
//             scaledPoint.x,
//             scaledPoint.y || 0,
//             scaledPoint.z
//           );
//           activePointsRef.current.length = 0;
//           activePointsRef.current.push(rectangleStartRef.current);
//           updateActiveLine();
//         } else {
//           pushUndo();
//           const end = new THREE.Vector3(
//             scaledPoint.x,
//             scaledPoint.y || 0,
//             scaledPoint.z
//           );
//           shapesRef.current.push(
//             createRectangle(rectangleStartRef.current, end)
//           );
//           rectangleStartRef.current = null;
//           activePointsRef.current.length = 0;
//           updateActiveLine();
//           renderShapes();
//           setMode("select");
//         }
//       } else if (mode === "circle") {
//         if (!circleCenterRef.current) {
//           circleCenterRef.current = new THREE.Vector3(
//             scaledPoint.x,
//             scaledPoint.y || 0,
//             scaledPoint.z
//           );
//           setShowCircleInput(true);
//           setCircleError("");
//           if (circleInputRef.current) {
//             circleInputRef.current.value = "5";
//             circleInputRef.current.focus();
//           }
//         }
//       } else if (mode === "measure") {
//         pushUndo();
//         if (measurePointsRef.current.length < 2) {
//           measurePointsRef.current.push(scaledPoint);
//           updateMeasureLine();
//           if (measurePointsRef.current.length === 2) {
//             setMode("select");
//           }
//         }
//       } else if (mode === "select") {
//         const pickables = [
//           ...shapeObjectsRef.current.filter(
//             (obj) => (obj as THREE.Mesh).isMesh
//           ),
//           ...extrudedObjectsRef.current.filter(
//             (obj) => (obj as THREE.Mesh).isMesh
//           ),
//         ];
//         pickables.forEach((o) => o.updateMatrixWorld());
//         const intersects = raycaster.intersectObjects(pickables, true);

//         if (intersects.length > 0) {
//           intersects.sort((a, b) => a.distance - b.distance);
//           const obj = intersects[0].object;
//           const userData = obj.userData as any;

//           if (userData.isShape) {
//             if (userData.shapeIndex === selectedShapeIndexRef.current) {
//               selectedShapeIndexRef.current = null;
//             } else {
//               selectedShapeIndexRef.current = userData.shapeIndex;
//               selectedExtrusionIndexRef.current = null;
//             }
//           } else if (userData.isExtruded) {
//             if (userData.shapeIndex === selectedExtrusionIndexRef.current) {
//               selectedExtrusionIndexRef.current = null;
//             } else {
//               selectedExtrusionIndexRef.current = userData.shapeIndex;
//               selectedShapeIndexRef.current = null;
//             }
//           }
//         } else {
//           selectedShapeIndexRef.current = null;
//           selectedExtrusionIndexRef.current = null;
//         }
//         renderShapes();
//         renderExtruded();
//         updateMoveHandles();
//       }
//     }
//   };

//   const handleLengthInputChange = () => {
//     if (
//       !tempPointRef.current ||
//       activePointsRef.current.length === 0 ||
//       !lengthInputRef.current
//     )
//       return;
//     const newLength = parseFloat(lengthInputRef.current.value);
//     if (isNaN(newLength)) return;

//     const lastPoint =
//       activePointsRef.current[activePointsRef.current.length - 1];
//     const dir = tempPointRef.current.clone().sub(lastPoint).normalize();
//     tempPointRef.current = lastPoint
//       .clone()
//       .add(dir.multiplyScalar(newLength * unitConversions[unit]));

//     if (previewLineRef.current && sceneRef.current) {
//       sceneRef.current.remove(previewLineRef.current);
//     }
//     const previewPoints = [lastPoint, tempPointRef.current];
//     const previewGeom = new THREE.BufferGeometry().setFromPoints(previewPoints);
//     const previewMat = new THREE.LineBasicMaterial({
//       color: 0x0000ff,
//       linewidth: 2,
//     });
//     previewLineRef.current = new THREE.Line(previewGeom, previewMat);
//     if (sceneRef.current) sceneRef.current.add(previewLineRef.current);
//   };

//   const handleLengthInputKeyDown = (event: KeyboardEvent) => {
//     if (event.key === "Enter") {
//       if (activePointsRef.current.length > 0 && tempPointRef.current) {
//         pushUndo();
//         activePointsRef.current.push(tempPointRef.current.clone());
//         updateActiveLine();
//         clearPreview();
//         setShowLengthInput(activePointsRef.current.length > 0);
//       }
//     }
//   };

//   const handleMoveInputChange = () => {
//     if (
//       !moveXInputRef.current ||
//       !moveZInputRef.current ||
//       !moveYInputRef.current
//     )
//       return;
//     const x = parseFloat(moveXInputRef.current.value) || 0;
//     const z = parseFloat(moveZInputRef.current.value) || 0;
//     const y = parseFloat(moveYInputRef.current.value) || 0;

//     if (isNaN(x) || isNaN(z) || (viewMode === "3d" && isNaN(y))) {
//       setMoveError("Please enter valid numbers");
//       return;
//     }
//     setMoveError("");

//     const delta = new THREE.Vector3(
//       x * unitConversions[unit],
//       y * unitConversions[unit],
//       z * unitConversions[unit]
//     );
//     createMovePreview(delta);
//   };

//   const handleMoveInputKeyDown = (event: KeyboardEvent) => {
//     if (event.key === "Enter") {
//       if (
//         !moveXInputRef.current ||
//         !moveZInputRef.current ||
//         !moveYInputRef.current
//       )
//         return;
//       const x = parseFloat(moveXInputRef.current.value) || 0;
//       const z = parseFloat(moveZInputRef.current.value) || 0;
//       const y = parseFloat(moveYInputRef.current.value) || 0;

//       if (isNaN(x) || isNaN(z) || (viewMode === "3d" && isNaN(y))) {
//         setMoveError("Please enter valid numbers");
//         return;
//       }
//       setMoveError("");

//       pushUndo();
//       const delta = new THREE.Vector3(
//         x * unitConversions[unit],
//         y * unitConversions[unit],
//         z * unitConversions[unit]
//       );
//       if (selectedShapeIndexRef.current !== null) {
//         moveShape(selectedShapeIndexRef.current, delta);
//       } else if (selectedExtrusionIndexRef.current !== null) {
//         moveExtrusion(selectedExtrusionIndexRef.current, delta);
//       }
//       clearMovePreview();
//       updateMoveHandles();
//       setShowMoveInputs(false);
//     }
//   };

//   const handleExtrudeInputChange = () => {
//     if (extrudeInputRef.current) {
//       const value = extrudeInputRef.current.value;
//       const depth = parseFloat(value);
//       if (isNaN(depth) || depth <= 0) {
//         setExtrudeError("Please enter a positive number");
//       } else {
//         setExtrudeError("");
//       }
//     }
//   };

//   const handleExtrudeInputKeyDown = (event: KeyboardEvent) => {
//     if (event.key === "Enter" && extrudeInputRef.current) {
//       const depth = parseFloat(extrudeInputRef.current.value);
//       if (!isNaN(depth) && depth > 0) {
//         pushUndo();
//         extrudeShape(depth);
//         setShowExtrudeInput(false);
//         setExtrudeError("");
//         setMode("select");
//       } else {
//         setExtrudeError("Please enter a positive number");
//       }
//     }
//   };

//   const handleCircleInputChange = () => {
//     if (circleInputRef.current) {
//       const value = circleInputRef.current.value;
//       const radius = parseFloat(value);
//       if (isNaN(radius) || radius <= 0) {
//         setCircleError("Please enter a positive number");
//       } else {
//         setCircleError("");
//       }
//     }
//   };

//   const handleCircleInputKeyDown = (event: KeyboardEvent) => {
//     if (
//       event.key === "Enter" &&
//       circleInputRef.current &&
//       circleCenterRef.current
//     ) {
//       const radius = parseFloat(circleInputRef.current.value);
//       if (!isNaN(radius) && radius > 0) {
//         pushUndo();
//         shapesRef.current.push(createCircle(circleCenterRef.current, radius));
//         renderShapes();
//         setShowCircleInput(false);
//         setCircleError("");
//         setMode("select");
//         circleCenterRef.current = null;
//       } else {
//         setCircleError("Please enter a positive number");
//       }
//     }
//   };

//   const handleUnitChange = (newUnit: string) => {
//     if (unitConversions[newUnit]) {
//       pushUndo();
//       updateSceneForUnit(newUnit);
//       setShowExtrudeInput(false);
//       setShowCircleInput(false);
//       setShowMoveInputs(false);
//       setExtrudeError("");
//       setCircleError("");
//       setMoveError("");
//       setIsUnitDropdownOpen(false);
//     }
//   };

//   const toggleUnitDropdown = () => {
//     setIsUnitDropdownOpen((prev) => !prev);
//   };

//   const handleKeyDown = (event: KeyboardEvent) => {
//     const key = event.key.toLowerCase();
//     if (key === "l") {
//       setMode("sketch");
//       resetDrawingState();
//     }
//     if (key === "o") {
//       setMode("orthogonal");
//       resetDrawingState();
//     }
//     if (key === "r") {
//       setMode("rectangle");
//       resetDrawingState();
//     }
//     if (key === "c") {
//       setMode("circle");
//       resetDrawingState();
//     }
//     if (key === "i") {
//       setMode("measure");
//       resetDrawingState();
//     }
//     if (key === "m") {
//       setMode("move");
//       resetDrawingState();
//       setShowMoveInputs(false);
//       setMoveError("");
//     }
//     if (event.key === "Enter") {
//       if (
//         (mode === "sketch" || mode === "orthogonal") &&
//         activePointsRef.current.length >= 3
//       ) {
//         pushUndo();
//         shapesRef.current.push([...activePointsRef.current]);
//         activePointsRef.current.length = 0;
//         if (activeLineRef.current && sceneRef.current) {
//           sceneRef.current.remove(activeLineRef.current);
//         }
//         updateActiveLine();
//         clearActiveMarkers();
//         clearPreview();
//         setShowLengthInput(false);
//         renderShapes();
//         setMode("select");
//       }
//     }
//     if (event.key === "Escape") {
//       setMode("select");
//       resetDrawingState();
//       setIsUnitDropdownOpen(false);
//       setIsDragging(false);
//       setMoveAxis(null);
//       moveStartRef.current = null;
//       setShowMoveInputs(false);
//       setMoveError("");
//       clearMovePreview();
//     }
//     if (key === "e") {
//       if (selectedShapeIndexRef.current !== null) {
//         setMode("extrude");
//         setShowExtrudeInput(true);
//         setShowCircleInput(false);
//         setShowMoveInputs(false);
//         setExtrudeError("");
//         setCircleError("");
//         setMoveError("");
//         if (extrudeInputRef.current) {
//           extrudeInputRef.current.value = "10";
//           extrudeInputRef.current.focus();
//         }
//       }
//     }
//     if (event.ctrlKey && key === "z") {
//       if (undoStackRef.current.length > 0) {
//         const current = cloneState();
//         redoStackRef.current.push(current);
//         const prev = undoStackRef.current.pop();
//         if (prev) restoreState(prev);
//         clearMeasure();
//         setShowExtrudeInput(false);
//         setShowCircleInput(false);
//         setShowMoveInputs(false);
//         setExtrudeError("");
//         setCircleError("");
//         setMoveError("");
//         setIsDragging(false);
//         setMoveAxis(null);
//         moveStartRef.current = null;
//         clearMovePreview();
//       }
//     }
//     if (event.ctrlKey && key === "y") {
//       if (redoStackRef.current.length > 0) {
//         const current = cloneState();
//         undoStackRef.current.push(current);
//         const next = redoStackRef.current.pop();
//         if (next) restoreState(next);
//         clearMeasure();
//         setShowExtrudeInput(false);
//         setShowCircleInput(false);
//         setShowMoveInputs(false);
//         setExtrudeError("");
//         setCircleError("");
//         setMoveError("");
//         setIsDragging(false);
//         setMoveAxis(null);
//         moveStartRef.current = null;
//         clearMovePreview();
//       }
//     }
//     if (key === "u") {
//       const newUnit = prompt("Enter unit (m, cm, mm, inch):", unit);
//       if (newUnit && unitConversions[newUnit]) {
//         pushUndo();
//         updateSceneForUnit(newUnit);
//         setShowExtrudeInput(false);
//         setShowCircleInput(false);
//         setShowMoveInputs(false);
//         setExtrudeError("");
//         setCircleError("");
//         setMoveError("");
//         setIsDragging(false);
//         setMoveAxis(null);
//         moveStartRef.current = null;
//         clearMovePreview();
//       }
//     }
//     if (key === "p") {
//       setProjectionMode("perspective");
//     }
//     if (key === "t") {
//       setProjectionMode("orthographic");
//     }
//     if (key === "g") {
//       toggleGrid();
//     }
//     if (key === "d") {
//       setViewMode("3d");
//     }
//     if (key === "delete") {
//       deleteSelected();
//     }
//   };

//   const resetDrawingState = () => {
//     rectangleStartRef.current = null;
//     circleCenterRef.current = null;
//     moveStartRef.current = null;
//     activePointsRef.current.length = 0;
//     updateActiveLine();
//     clearPreview();
//     clearMeasure();
//     clearMovePreview();
//     setShowLengthInput(false);
//     setShowExtrudeInput(false);
//     setShowCircleInput(false);
//     setShowMoveInputs(false);
//     setExtrudeError("");
//     setCircleError("");
//     setMoveError("");
//     setIsUnitDropdownOpen(false);
//     setIsDragging(false);
//     setMoveAxis(null);
//   };

//   useEffect(() => {
//     window.addEventListener("mousedown", handleMouseDown);
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     window.addEventListener("click", handleClick);
//     window.addEventListener("keydown", handleKeyDown);

//     if (lengthInputRef.current) {
//       lengthInputRef.current.addEventListener("input", handleLengthInputChange);
//       lengthInputRef.current.addEventListener(
//         "keydown",
//         handleLengthInputKeyDown
//       );
//     }
//     if (extrudeInputRef.current) {
//       extrudeInputRef.current.addEventListener(
//         "input",
//         handleExtrudeInputChange
//       );
//       extrudeInputRef.current.addEventListener(
//         "keydown",
//         handleExtrudeInputKeyDown
//       );
//     }
//     if (circleInputRef.current) {
//       circleInputRef.current.addEventListener("input", handleCircleInputChange);
//       circleInputRef.current.addEventListener(
//         "keydown",
//         handleCircleInputKeyDown
//       );
//     }
//     if (moveXInputRef.current) {
//       moveXInputRef.current.addEventListener("input", handleMoveInputChange);
//       moveXInputRef.current.addEventListener("keydown", handleMoveInputKeyDown);
//     }
//     if (moveZInputRef.current) {
//       moveZInputRef.current.addEventListener("input", handleMoveInputChange);
//       moveZInputRef.current.addEventListener("keydown", handleMoveInputKeyDown);
//     }
//     if (moveYInputRef.current) {
//       moveYInputRef.current.addEventListener("input", handleMoveInputChange);
//       moveYInputRef.current.addEventListener("keydown", handleMoveInputKeyDown);
//     }

//     return () => {
//       window.removeEventListener("mousedown", handleMouseDown);
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//       window.removeEventListener("click", handleClick);
//       window.removeEventListener("keydown", handleKeyDown);
//       if (lengthInputRef.current) {
//         lengthInputRef.current.removeEventListener(
//           "input",
//           handleLengthInputChange
//         );
//         lengthInputRef.current.removeEventListener(
//           "keydown",
//           handleLengthInputKeyDown
//         );
//       }
//       if (extrudeInputRef.current) {
//         extrudeInputRef.current.removeEventListener(
//           "input",
//           handleExtrudeInputChange
//         );
//         extrudeInputRef.current.removeEventListener(
//           "keydown",
//           handleExtrudeInputKeyDown
//         );
//       }
//       if (circleInputRef.current) {
//         circleInputRef.current.removeEventListener(
//           "input",
//           handleCircleInputChange
//         );
//         circleInputRef.current.removeEventListener(
//           "keydown",
//           handleCircleInputKeyDown
//         );
//       }
//       if (moveXInputRef.current) {
//         moveXInputRef.current.removeEventListener(
//           "input",
//           handleMoveInputChange
//         );
//         moveXInputRef.current.removeEventListener(
//           "keydown",
//           handleMoveInputKeyDown
//         );
//       }
//       if (moveZInputRef.current) {
//         moveZInputRef.current.removeEventListener(
//           "input",
//           handleMoveInputChange
//         );
//         moveZInputRef.current.removeEventListener(
//           "keydown",
//           handleMoveInputKeyDown
//         );
//       }
//       if (moveYInputRef.current) {
//         moveYInputRef.current.removeEventListener(
//           "input",
//           handleMoveInputChange
//         );
//         moveYInputRef.current.removeEventListener(
//           "keydown",
//           handleMoveInputKeyDown
//         );
//       }
//     };
//   }, [mode, unit, loadedFont, isDragging]);

//   const Button = ({ children, isActive, ...props }: any) => {
//     return (
//       <button
//         onClick={props.onClick}
//         className={`flex flex-row gap-2 rounded-md p-2 border items-center transition-colors justify-center border-neutral-500 font-semibold ${
//           props.className
//         } ${
//           isActive
//             ? "bg-lime-600 text-white hover:bg-lime-700"
//             : "bg-white text-black hover:bg-gray-200"
//         }`}
//       >
//         {children}
//       </button>
//     );
//   };

//   const modes = [
//     { mode: "select", name: "select", icon: <PiCursor size={20} /> },
//     { mode: "move", name: "move", icon: <PiArrowsOutCardinal size={20} /> },
//     { mode: "sketch", name: "sketch", icon: <PiPolygon size={20} /> },
//     {
//       mode: "orthogonal",
//       name: "orthogonal",
//       icon: <PiLineSegments size={20} />,
//     },
//     { mode: "circle", name: "circle", icon: <PiCircle size={20} /> },
//     { mode: "measure", name: "measure", icon: <PiRuler size={20} /> },
//     { mode: "extrude", name: "extrude", icon: <PiArrowFatLineUp size={20} /> },
//   ];

//   const features = [
//     {
//       mode: "2d",
//       name: "2D",
//       icon: <div>2D</div>,
//       action: () => setViewMode("2d"),
//     },
//     {
//       mode: "3d",
//       name: "3D",
//       icon: <div>3D</div>,
//       action: () => setViewMode("3d"),
//     },
//     {
//       mode: "perspective",
//       name: "Perspective",
//       icon: <div>P</div>,
//       action: () => setProjectionMode("perspective"),
//     },
//     {
//       mode: "orthographic",
//       name: "Orthographic",
//       icon: <div>O</div>,
//       action: () => setProjectionMode("orthographic"),
//     },
//     {
//       mode: "grid",
//       name: showGrid ? "Hide Grid" : "Show Grid",
//       icon: <PiGridNine size={20} />,
//       action: toggleGrid,
//     },
//     // {
//     //   mode: "snap",
//     //   name: snapToGrid ? "Disable Snap" : "Enable Snap",
//     //   icon: <div>S</div>,
//     //   action: toggleSnapToGrid,
//     // },
//   ];

//   return (
//     <div className="relative text-sm w-screen h-screen overflow-hidden">
//       <div className="flex flex-row fixed bottom-4 left-1/2 -translate-x-1/2 gap-2 rounded-full z-10">
//         {modes.map((modeItem) => (
//           <Button
//             key={modeItem.mode}
//             onClick={(event: any) => {
//               event.stopPropagation();
//               setMode(modeItem.mode);
//               if (
//                 modeItem.mode === "extrude" &&
//                 selectedShapeIndexRef.current !== null
//               ) {
//                 setShowExtrudeInput(true);
//                 setShowCircleInput(false);
//                 setShowMoveInputs(false);
//                 setExtrudeError("");
//                 setCircleError("");
//                 setMoveError("");
//                 if (extrudeInputRef.current) {
//                   extrudeInputRef.current.value = "10";
//                   extrudeInputRef.current.focus();
//                 }
//               } else if (modeItem.mode === "circle") {
//                 setShowExtrudeInput(false);
//                 setShowCircleInput(false);
//                 setShowMoveInputs(false);
//                 setExtrudeError("");
//                 setCircleError("");
//                 setMoveError("");
//                 circleCenterRef.current = null;
//               } else if (modeItem.mode === "move") {
//                 setShowExtrudeInput(false);
//                 setShowCircleInput(false);
//                 setShowMoveInputs(false);
//                 setExtrudeError("");
//                 setCircleError("");
//                 setMoveError("");
//               } else {
//                 setShowExtrudeInput(false);
//                 setShowCircleInput(false);
//                 setShowMoveInputs(false);
//                 setExtrudeError("");
//                 setCircleError("");
//                 setMoveError("");
//               }
//             }}
//             isActive={mode === modeItem.mode}
//           >
//             {modeItem.icon}
//           </Button>
//         ))}
//       </div>
//       <div className="flex flex-col fixed top-1/2 -translate-y-1/2 left-4 gap-2 rounded-full z-10">
//         {features.map((feature) => (
//           <Button
//             key={feature.mode}
//             onClick={(event: any) => {
//               event.stopPropagation();
//               feature.action();
//             }}
//             isActive={
//               feature.mode === viewMode ||
//               feature.mode === projectionMode ||
//               (feature.mode === "grid" && showGrid) ||
//               (feature.mode === "snap" && snapToGrid)
//             }
//           >
//             {feature.icon}
//           </Button>
//         ))}
//       </div>
//       <div ref={mountRef} className="w-full h-full" />
//       <div className="fixed bottom-4 right-4 z-10 flex items-center gap-2">
//         <div className="relative">
//           <Button className="!font-normal" onClick={toggleUnitDropdown}>
//             Unit: {unit}
//             <PiCaretDown />
//           </Button>
//           {isUnitDropdownOpen && (
//             <div className="absolute bottom-12 right-0 bg-white border border-neutral-500 rounded-md shadow-lg z-20">
//               {Object.keys(unitConversions).map((unitOption) => (
//                 <button
//                   key={unitOption}
//                   onClick={() => handleUnitChange(unitOption)}
//                   className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-200"
//                 >
//                   {unitOption}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="fixed top-4 left-4 w-[35px] z-10">
//         <img src="/logo.png" alt="Renqar logo" />
//       </div>
//       <div
//         style={{ display: showLengthInput ? "block" : "none" }}
//         className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-xl border border-neutral-400 p-1 px-3 bg-white z-10"
//       >
//         Length:{" "}
//         <input
//           ref={lengthInputRef}
//           type="number"
//           className="border-neutral-400 focus:outline-none px-2 py-1 border rounded-md"
//           step="0.01"
//           defaultValue="10"
//           min="0.01"
//           style={{ width: "70px" }}
//         />{" "}
//         {unit}
//       </div>
//       <div
//         style={{ display: showExtrudeInput ? "block" : "none" }}
//         className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-xl border border-neutral-400 p-1 px-3 bg-white z-10"
//       >
//         Extrude Depth:{" "}
//         <input
//           ref={extrudeInputRef}
//           type="number"
//           className={`border-neutral-400 focus:outline-none px-2 py-1 border rounded-md ${
//             extrudeError ? "border-red-500" : ""
//           }`}
//           step="0.01"
//           defaultValue="10"
//           min="0.01"
//           style={{ width: "70px" }}
//         />{" "}
//         {unit}
//         {extrudeError && (
//           <div className="text-red-500 text-xs mt-1">{extrudeError}</div>
//         )}
//       </div>
//       <div
//         style={{ display: showCircleInput ? "block" : "none" }}
//         className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-xl border border-neutral-400 p-1 px-3 bg-white z-10"
//       >
//         Circle Radius:{" "}
//         <input
//           ref={circleInputRef}
//           type="number"
//           className={`border-neutral-400 focus:outline-none px-2 py-1 border rounded-md ${
//             circleError ? "border-red-500" : ""
//           }`}
//           step="0.01"
//           defaultValue="5"
//           min="0.01"
//           style={{ width: "70px" }}
//         />{" "}
//         {unit}
//         {circleError && (
//           <div className="text-red-500 text-xs mt-1">{circleError}</div>
//         )}
//       </div>
//       <div
//         style={{ display: showMoveInputs ? "block" : "none" }}
//         className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-xl border border-neutral-400 p-1 px-3 bg-white z-10"
//       >
//         Move Offset: X{" "}
//         <input
//           ref={moveXInputRef}
//           type="number"
//           className={`border-neutral-400 focus:outline-none px-2 py-1 border rounded-md ${
//             moveError ? "border-red-500" : ""
//           }`}
//           step="0.01"
//           defaultValue="0"
//           style={{ width: "70px" }}
//         />{" "}
//         Z{" "}
//         <input
//           ref={moveZInputRef}
//           type="number"
//           className={`border-neutral-400 focus:outline-none px-2 py-1 border rounded-md ${
//             moveError ? "border-red-500" : ""
//           }`}
//           step="0.01"
//           defaultValue="0"
//           style={{ width: "70px" }}
//         />{" "}
//         {viewMode === "3d" && (
//           <>
//             Y{" "}
//             <input
//               ref={moveYInputRef}
//               type="number"
//               className={`border-neutral-400 focus:outline-none px-2 py-1 border rounded-md ${
//                 moveError ? "border-red-500" : ""
//               }`}
//               step="0.01"
//               defaultValue="0"
//               style={{ width: "70px" }}
//             />{" "}
//           </>
//         )}
//         {unit}
//         {moveError && (
//           <div className="text-red-500 text-xs mt-1">{moveError}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyThreeScene;
