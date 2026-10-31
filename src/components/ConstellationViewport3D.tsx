import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ConstellationNodeItem,
  EpistemicCategory,
  IconocraticRegime,
  ProceduralArchetype,
  getDeterministicPositionFromId,
} from '../data/iconocracyData';
import {
  Compass,
  Eye,
  Grid,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';

export type AcervoViewMode = 'constelacao' | 'palco' | 'grade';

interface ConstellationViewport3DProps {
  nodes: ConstellationNodeItem[];
  selectedNode: ConstellationNodeItem | null;
  onSelectNode: (node: ConstellationNodeItem) => void;
  viewMode: AcervoViewMode;
  onChangeViewMode: (mode: AcervoViewMode) => void;
  activeCategory: EpistemicCategory | 'todos';
  onChangeCategory: (cat: EpistemicCategory | 'todos') => void;
  activeRegime: IconocraticRegime | 'todos';
  onChangeRegime: (reg: IconocraticRegime | 'todos') => void;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  montageIds: string[];
  onToggleMontageItem: (id: string) => void;
}

// Pre-allocated math helpers at module scope (Zero GC inside render loop)
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _mouseNdc = new THREE.Vector2();

function createProceduralCardTexture(
  node: ConstellationNodeItem,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Warm archival paper inside dark Mnemosyne plate border
  ctx.fillStyle = '#181614';
  ctx.fillRect(0, 0, 512, 640);

  ctx.strokeStyle = '#9A8A2A';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, 484, 612);

  ctx.fillStyle = '#F5F1E8';
  ctx.fillRect(26, 26, 460, 588);

  // Inner engraving frame
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, 436, 564);

  // Regime color band at top
  const regimeColors: Record<IconocraticRegime, string> = {
    FUNDACIONAL: '#B5651D',
    NORMATIVO: '#9A8A2A',
    MILITAR: '#444466',
    'CONTRA-ALEGORIA': '#2A7A2A',
    TRANSVERSAL: '#57534E',
  };
  ctx.fillStyle = regimeColors[node.regime] || '#57534E';
  ctx.fillRect(38, 38, 436, 42);

  ctx.fillStyle = '#FBF9F5';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    `${node.categoryLabel.toUpperCase()} · ${node.regime}`,
    256,
    65
  );

  // Centerpiece procedural copperplate motif
  ctx.save();
  ctx.translate(256, 255);
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 3;

  // Concentric calibration rings
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, 94, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (node.archetype === 'scales_justitia') {
    // Pillar + Beam + Scales
    ctx.beginPath();
    ctx.moveTo(0, -82);
    ctx.lineTo(0, 82);
    ctx.moveTo(-72, -38);
    ctx.lineTo(72, -38);
    ctx.stroke();

    ctx.strokeStyle = '#9A3412';
    ctx.beginPath();
    ctx.arc(-72, 24, 24, 0, Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(72, 24, 24, 0, Math.PI, false);
    ctx.stroke();
  } else if (node.archetype === 'coin_marianne') {
    // Profile medallion + rays
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 58, Math.sin(a) * 58);
      ctx.lineTo(Math.cos(a) * 86, Math.sin(a) * 86);
      ctx.stroke();
    }
    ctx.strokeStyle = '#9A3412';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
  } else if (node.archetype === 'monument_niederwald') {
    // Stepped plinth + obelisk/statue silhouette
    ctx.strokeRect(-55, 35, 110, 45);
    ctx.strokeRect(-38, -5, 76, 40);
    ctx.strokeStyle = '#9A3412';
    ctx.strokeRect(-18, -75, 36, 70);
  } else if (node.archetype === 'pediment_forensic') {
    // Classical tympanum + 4 columns
    ctx.beginPath();
    ctx.moveTo(-88, -22);
    ctx.lineTo(0, -78);
    ctx.lineTo(88, -22);
    ctx.closePath();
    ctx.stroke();
    for (const cx of [-64, -22, 22, 64]) {
      ctx.strokeRect(cx - 8, -22, 16, 92);
    }
  } else {
    // Mnemosyne paired plates
    ctx.strokeRect(-76, -56, 64, 92);
    ctx.strokeRect(12, -56, 64, 92);
    ctx.strokeStyle = '#9A3412';
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.lineTo(12, -10);
    ctx.stroke();
  }
  ctx.restore();

  // Title text at bottom of plate
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 28px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';

  const words = node.title.split(' ');
  let line = '';
  const lines: string[] = [];
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (test.length > 24 && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  lines.slice(0, 3).forEach((ln, idx) => {
    ctx.fillText(ln, 256, 435 + idx * 34);
  });

  // Footer ID / Chapter
  ctx.fillStyle = '#57534E';
  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillText(
    `${node.chapterRef || 'CORPUS'} · ${node.country || 'TRANSNACIONAL'}`,
    256,
    572
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Builds a composite 5-10 part procedural 3D model (THREE.Group) for the Stage (Palco)
 * and Constellation nodes, adhering strictly to Three.js PBR craft guidelines.
 */
function buildCompositeProceduralArtifact(
  archetype: ProceduralArchetype,
  isSoftwareGl: boolean
): THREE.Group {
  const group = new THREE.Group();

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xb8860b,
    metalness: 0.88,
    roughness: 0.22,
  });
  const agedStoneMat = new THREE.MeshStandardMaterial({
    color: 0xe7e2d8,
    metalness: 0.08,
    roughness: 0.72,
  });
  const darkSlateMat = new THREE.MeshStandardMaterial({
    color: 0x22201e,
    metalness: 0.35,
    roughness: 0.45,
  });
  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    metalness: 0.2,
    roughness: 0.52,
  });
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbf9f5,
    metalness: 0.05,
    roughness: 0.12,
    transmission: isSoftwareGl ? 0 : 0.82,
    transparent: true,
    opacity: isSoftwareGl ? 0.55 : 1,
    ior: 1.52,
    thickness: 0.8,
  });

  // Part 1: Grounded stepped archival plinth (pivoted at bottom-center Y=0)
  const basePlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.45, 0.36, 32),
    darkSlateMat
  );
  basePlinth.position.y = 0.18;
  basePlinth.castShadow = true;
  basePlinth.receiveShadow = true;
  group.add(basePlinth);

  const upperPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 2.0, 0.28, 32),
    agedStoneMat
  );
  upperPlinth.position.y = 0.5;
  upperPlinth.castShadow = true;
  upperPlinth.receiveShadow = true;
  group.add(upperPlinth);

  const brassTrimRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.88, 0.045, 16, 48),
    bronzeMat
  );
  brassTrimRing.rotation.x = Math.PI / 2;
  brassTrimRing.position.y = 0.36;
  group.add(brassTrimRing);

  if (archetype === 'scales_justitia') {
    // Fluted central column + sword blade + balance beam + 2 suspended pans + blindfold ribbon
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.3, 3.2, 24),
      agedStoneMat
    );
    pillar.position.y = 2.24;
    pillar.castShadow = true;
    group.add(pillar);

    const swordBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 3.6, 0.04),
      bronzeMat
    );
    swordBlade.position.set(0, 2.45, 0.26);
    swordBlade.castShadow = true;
    group.add(swordBlade);

    const crossBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.1, 16),
      bronzeMat
    );
    crossBeam.rotation.z = Math.PI / 2;
    crossBeam.position.y = 3.55;
    crossBeam.castShadow = true;
    group.add(crossBeam);

    for (const side of [-1, 1]) {
      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 1.25, 8),
        bronzeMat
      );
      chain.position.set(side * 1.35, 2.9, 0);
      group.add(chain);

      const pan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.32, 0.14, 24),
        bronzeMat
      );
      pan.position.set(side * 1.35, 2.25, 0);
      pan.castShadow = true;
      group.add(pan);
    }

    const blindfoldRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.07, 16, 32),
      terracottaMat
    );
    blindfoldRing.position.y = 3.85;
    group.add(blindfoldRing);
  } else if (archetype === 'coin_marianne' || archetype === 'stamp_republic') {
    // Upright numismatic medallion on pedestal + milled edge + relief bust + Phrygian cap crest
    const cradle = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.7, 0.6),
      darkSlateMat
    );
    cradle.position.y = 0.95;
    group.add(cradle);

    const coinDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.55, 0.24, 48),
      bronzeMat
    );
    coinDisc.rotation.x = Math.PI / 2;
    coinDisc.position.y = 2.45;
    coinDisc.castShadow = true;
    group.add(coinDisc);

    const outerRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.09, 20, 48),
      bronzeMat
    );
    outerRim.position.y = 2.45;
    group.add(outerRim);

    const reliefBust = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 28, 28),
      agedStoneMat
    );
    reliefBust.scale.set(0.85, 1.15, 0.32);
    reliefBust.position.set(0, 2.45, 0.12);
    group.add(reliefBust);

    const phrygianCrest = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 0.75, 24),
      terracottaMat
    );
    phrygianCrest.rotation.z = -0.35;
    phrygianCrest.position.set(-0.08, 3.15, 0.16);
    group.add(phrygianCrest);
  } else if (archetype === 'monument_niederwald') {
    // Colossal architectural socle + armored torso + imperial crown + raised sword
    const socle = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.5, 1.6),
      agedStoneMat
    );
    socle.position.y = 1.39;
    socle.castShadow = true;
    group.add(socle);

    const armoredFigure = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.62, 1.85, 16),
      bronzeMat
    );
    armoredFigure.position.y = 3.05;
    armoredFigure.castShadow = true;
    group.add(armoredFigure);

    const shield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.45, 0.12, 6),
      darkSlateMat
    );
    shield.rotation.x = Math.PI / 2;
    shield.position.set(-0.52, 2.65, 0.42);
    group.add(shield);

    const crown = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.08, 12, 24),
      bronzeMat
    );
    crown.rotation.x = Math.PI / 2;
    crown.position.set(0.38, 4.15, 0);
    group.add(crown);
  } else if (archetype === 'pediment_forensic') {
    // 4 fluted columns + architrave + triangular classical pediment
    const colPositions = [-1.15, -0.38, 0.38, 1.15];
    for (const cx of colPositions) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.19, 2.3, 20),
        agedStoneMat
      );
      col.position.set(cx, 1.79, 0);
      col.castShadow = true;
      group.add(col);
    }

    const architrave = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.28, 0.9),
      agedStoneMat
    );
    architrave.position.y = 3.08;
    architrave.castShadow = true;
    group.add(architrave);

    const pedimentPrism = new THREE.Mesh(
      new THREE.ConeGeometry(1.85, 0.95, 4),
      terracottaMat
    );
    pedimentPrism.rotation.y = Math.PI / 4;
    pedimentPrism.scale.set(1.15, 1, 0.45);
    pedimentPrism.position.y = 3.7;
    pedimentPrism.castShadow = true;
    group.add(pedimentPrism);
  } else {
    // Two bodies / Mnemosyne crystal & bronze reliquary frame
    const leftStele = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 2.6, 0.16),
      darkSlateMat
    );
    leftStele.position.set(-0.72, 2.05, 0);
    leftStele.rotation.y = 0.18;
    leftStele.castShadow = true;
    group.add(leftStele);

    const rightStele = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 2.6, 0.16),
      agedStoneMat
    );
    rightStele.position.set(0.72, 2.05, 0);
    rightStele.rotation.y = -0.18;
    rightStele.castShadow = true;
    group.add(rightStele);

    const bridgeTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.06, 16, 40),
      bronzeMat
    );
    bridgeTorus.position.set(0, 2.2, 0.22);
    group.add(bridgeTorus);

    const coreOrb = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 2),
      crystalMat
    );
    coreOrb.position.set(0, 2.2, 0.22);
    group.add(coreOrb);
  }

  return group;
}

export const ConstellationViewport3D: React.FC<ConstellationViewport3DProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  viewMode,
  onChangeViewMode,
  activeCategory,
  onChangeCategory,
  activeRegime,
  onChangeRegime,
  searchQuery,
  onChangeSearch,
  montageIds,
  onToggleMontageItem,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredNodeTitle, setHoveredNodeTitle] = useState<string | null>(null);

  // Refs to synchronize React state with the isolated Three.js scene without re-creating WebGLRenderer
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const selectedNodeRef = useRef(selectedNode);
  selectedNodeRef.current = selectedNode;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;

  // Store Three.js scene handles for imperative updates
  const sceneHandlesRef = useRef<{
    constellationGroup: THREE.Group;
    stageGroup: THREE.Group;
    nodeMeshesMap: Map<string, THREE.Group>;
    controls: OrbitControls;
    camera: THREE.PerspectiveCamera;
    isSoftwareGl: boolean;
    rebuildStageArtifact: (node: ConstellationNodeItem) => void;
    focusOnNode: (node: ConstellationNodeItem | null, mode: AcervoViewMode) => void;
  } | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Detect software WebGL per Three.js skill directive
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0b0a);
    scene.fog = new THREE.FogExp2(0x0c0b0a, 0.018);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    camera.position.set(0, 4.5, 25);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio PBR Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // 3. Balanced 3-Point Studio Lighting + Warm/Cool Contrast
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x292524, 0.65);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 1.85);
    keyLight.position.set(12, 18, 14);
    keyLight.castShadow = !isSoftwareGl;
    const d = 18;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // 4. Background Mnemosyne calibration starfield (InstancedMesh > 20 items)
    const starCount = 140;
    const starGeo = new THREE.OctahedronGeometry(0.055, 0);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0x78716c,
      transparent: true,
      opacity: 0.45,
    });
    const starsInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < starCount; i++) {
      const r = 24 + (i % 17) * 1.4;
      const theta = i * 2.39996;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / starCount);
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.7,
        r * Math.sin(phi) * Math.sin(theta)
      );
      const s = 0.6 + (i % 5) * 0.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      starsInstanced.setMatrixAt(i, dummy.matrix);
    }
    starsInstanced.instanceMatrix.needsUpdate = true;
    starsInstanced.computeBoundingSphere();
    scene.add(starsInstanced);

    // 5. Constellation Group (All nodes + relational lines)
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const nodeMeshesMap = new Map<string, THREE.Group>();
    const clickableMeshes: THREE.Object3D[] = [];
    const posById = new Map<string, THREE.Vector3>();

    const allNodes = nodesRef.current;
    const plateGeo = new THREE.BoxGeometry(2.1, 2.65, 0.1);
    const frameGeo = new THREE.BoxGeometry(2.24, 2.79, 0.07);
    const brassFrameMat = new THREE.MeshStandardMaterial({
      color: 0x85754e,
      metalness: 0.78,
      roughness: 0.28,
    });
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.18,
    });
    const pinGeo = new THREE.SphereGeometry(0.09, 12, 12);

    allNodes.forEach((node, idx) => {
      const [px, py, pz] = getDeterministicPositionFromId(
        node.id,
        idx,
        allNodes.length
      );
      const pos = new THREE.Vector3(px, py, pz);
      posById.set(node.id, pos);

      // Composite 4-part archival plate node (uniform size & frame per constellation-method.md)
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);
      nodeGroup.userData = { nodeId: node.id, baseY: py };

      const outerFrame = new THREE.Mesh(frameGeo, brassFrameMat.clone());
      outerFrame.castShadow = true;
      nodeGroup.add(outerFrame);

      const cardTex = createProceduralCardTexture(node, maxAnisotropy);
      const cardMat = new THREE.MeshStandardMaterial({
        map: cardTex,
        roughness: 0.42,
        metalness: 0.05,
      });
      const plateMesh = new THREE.Mesh(plateGeo, cardMat);
      plateMesh.position.z = 0.025;
      plateMesh.userData = { nodeId: node.id };
      plateMesh.layers.enable(1);
      nodeGroup.add(plateMesh);
      clickableMeshes.push(plateMesh);

      // Top and bottom archival pins (Mnemosyne board pins)
      const topPin = new THREE.Mesh(pinGeo, pinMat);
      topPin.position.set(0, 1.28, 0.09);
      nodeGroup.add(topPin);

      // Gently orient each plate toward the center camera axis
      nodeGroup.lookAt(0, py * 0.35, 32);

      constellationGroup.add(nodeGroup);
      nodeMeshesMap.set(node.id, nodeGroup);
    });

    // Relational constellation threads (Benjamin / Weigel configuration)
    const linePoints: THREE.Vector3[] = [];
    const seenPairs = new Set<string>();
    allNodes.forEach((node) => {
      const fromPos = posById.get(node.id);
      if (!fromPos) return;
      node.connections.forEach((targetId) => {
        const pairKey = [node.id, targetId].sort().join('--');
        if (seenPairs.has(pairKey)) return;
        const toPos = posById.get(targetId);
        if (toPos) {
          seenPairs.add(pairKey);
          linePoints.push(fromPos.clone(), toPos.clone());
        }
      });
    });

    if (linePoints.length > 0) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x9a8a2a,
        transparent: true,
        opacity: 0.32,
      });
      const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
      constellationGroup.add(constellationLines);
    }

    // 6. Stage Group (Modo Palco — 3D Composite Procedural Artifact Showcase)
    const stageGroup = new THREE.Group();
    stageGroup.visible = false;
    scene.add(stageGroup);

    // Contact shadow plane on Stage floor (offset Y to avoid Z-fighting)
    const stageFloor = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 48),
      new THREE.MeshStandardMaterial({
        color: 0x141210,
        roughness: 0.85,
        metalness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    stageFloor.rotation.x = -Math.PI / 2;
    stageFloor.position.y = 0;
    stageFloor.receiveShadow = true;
    stageGroup.add(stageFloor);

    let currentArtifactMesh: THREE.Group | null = null;
    const rebuildStageArtifact = (node: ConstellationNodeItem) => {
      if (currentArtifactMesh) {
        stageGroup.remove(currentArtifactMesh);
      }
      currentArtifactMesh = buildCompositeProceduralArtifact(
        node.archetype,
        isSoftwareGl
      );
      stageGroup.add(currentArtifactMesh);
    };

    if (selectedNodeRef.current) {
      rebuildStageArtifact(selectedNodeRef.current);
    } else if (allNodes[0]) {
      rebuildStageArtifact(allNodes[0]);
    }

    // 7. OrbitControls with smooth exponential damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4;
    controls.maxDistance = 46;
    controls.maxPolarAngle = Math.PI * 0.85;

    let isTransitioningCamera = false;
    controls.addEventListener('start', () => {
      // Cancel scripted camera transition when user manually orbits
      isTransitioningCamera = false;
    });

    const focusOnNode = (
      node: ConstellationNodeItem | null,
      mode: AcervoViewMode
    ) => {
      if (mode === 'palco') {
        constellationGroup.visible = false;
        stageGroup.visible = true;
        if (node) rebuildStageArtifact(node);
        _targetLookAt.set(0, 2.0, 0);
        _targetCameraPos.set(0, 3.1, 7.2);
        isTransitioningCamera = true;
      } else {
        constellationGroup.visible = true;
        stageGroup.visible = false;
        if (node) {
          const targetGroup = nodeMeshesMap.get(node.id);
          if (targetGroup) {
            _targetLookAt.copy(targetGroup.position);
            // Position camera in front of the selected plate
            const offset = targetGroup.position
              .clone()
              .normalize()
              .multiplyScalar(5.2);
            _targetCameraPos.copy(targetGroup.position).add(offset);
            _targetCameraPos.z = Math.max(_targetCameraPos.z, targetGroup.position.z + 5.8);
            isTransitioningCamera = true;
          }
        } else {
          _targetLookAt.set(0, 0, 0);
          _targetCameraPos.set(0, 3.5, 25);
          isTransitioningCamera = true;
        }
      }
    };

    sceneHandlesRef.current = {
      constellationGroup,
      stageGroup,
      nodeMeshesMap,
      controls,
      camera,
      isSoftwareGl,
      rebuildStageArtifact,
      focusOnNode,
    };

    // Raycasting on layer 1 (throttled pointermove + click)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    let lastRaycastTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 45) return;
      lastRaycastTime = now;

      if (viewModeRef.current !== 'constelacao') {
        setHoveredNodeTitle(null);
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      _mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouseNdc, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.nodeId;
        const found = nodesRef.current.find((n) => n.id === hitId);
        renderer.domElement.style.cursor = 'pointer';
        setHoveredNodeTitle(found ? `${found.title} (${found.categoryLabel})` : null);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredNodeTitle(null);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 6 || dy > 6) return; // Dragged orbit, not a click

      if (viewModeRef.current !== 'constelacao') return;

      const rect = renderer.domElement.getBoundingClientRect();
      _mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouseNdc, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.nodeId;
        const found = nodesRef.current.find((n) => n.id === hitId);
        if (found) {
          onSelectNodeRef.current(found);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pre-warm shaders on hardware WebGL
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Paced animation loop (supports both GPU rAF and software WebGL afterDraw)
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isTransitioningCamera) {
        const alpha = 1 - Math.exp(-4.5 * dt);
        camera.position.lerp(_targetCameraPos, alpha);
        controls.target.lerp(_targetLookAt, alpha);
        if (
          camera.position.distanceToSquared(_targetCameraPos) < 0.02 &&
          controls.target.distanceToSquared(_targetLookAt) < 0.02
        ) {
          isTransitioningCamera = false;
        }
      }

      if (stageGroup.visible && currentArtifactMesh) {
        currentArtifactMesh.rotation.y = elapsed * 0.32;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Synchronize filter dimming & camera focus when selection, filters, or viewMode change
  useEffect(() => {
    const handles = sceneHandlesRef.current;
    if (!handles) return;

    const visibleIds = new Set(nodes.map((n) => n.id));
    handles.nodeMeshesMap.forEach((group, id) => {
      const isVisible = visibleIds.has(id);
      const isSelected = selectedNode?.id === id;
      group.visible = isVisible;
      // Uniform neutral scale (per constellation-method.md: size does not represent hierarchy)
      const targetScale = isSelected ? 1.08 : 1.0;
      group.scale.set(targetScale, targetScale, targetScale);
    });

    handles.focusOnNode(selectedNode, viewMode);
  }, [nodes, selectedNode, viewMode]);

  // Keyboard shortcut 'H' for Collapsible Zen Mode Drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setIsDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#0C0B0A] overflow-hidden select-none">
      {/* Isolated WebGL Canvas Mount Container */}
      <div
        ref={canvasMountRef}
        className={`w-full h-full ${viewMode === 'grade' ? 'hidden' : 'block'}`}
      />

      {/* Top-Left Minimal Context Header (Unobstructed Viewport) */}
      {viewMode !== 'grade' && (
        <div className="pointer-events-none absolute top-5 left-6 z-10 max-w-md">
          <div className="inline-block bg-[#141210]/95 border border-[#38332E] px-4 py-3 text-[#FBF9F5]">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#D6CEBE]">
              /acervo · Entrada Relacional (Benjamin · Weigel · Warburg)
            </p>
            <h2 className="font-display text-xl font-semibold text-[#FBF9F5] mt-0.5">
              {viewMode === 'constelacao'
                ? 'Campo da Constelação (Idee als Konfiguration)'
                : `Palco de Inspeção 3D: ${selectedNode?.title || 'Justitia'}`}
            </h2>
            <p className="text-xs text-[#A8A29E] mt-1">
              {hoveredNodeTitle
                ? `Em foco: ${hoveredNodeTitle}`
                : 'Posição determinística por ID · Tamanho e moldura neutros · Clique em uma prancha para abrir a ficha'}
            </p>
          </div>
        </div>
      )}

      {/* MODO 3: GRADE (Catálogo Documentado Acessível sobre o Campo) */}
      {viewMode === 'grade' && (
        <div className="w-full h-full overflow-y-auto bg-[#FBF9F5] text-[#1C1917] px-6 sm:px-12 py-10 pb-36 select-text">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-[#D6CEBE] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#78716C]">
                  Modo de Consulta · Catálogo Documentado ({nodes.length} entradas visíveis)
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-1">
                  Grade do Acervo & Operadores do Glossário
                </h1>
              </div>
              <p className="text-xs font-serif italic text-[#57534E] max-w-md">
                Dica: selecione qualquer palavra ou frase nas definições abaixo para acionar o Tooltip Iconológico com gravura gerada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nodes.map((item) => {
                const isSelected = selectedNode?.id === item.id;
                const inMontage = montageIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className={`border transition-colors p-6 flex flex-col justify-between bg-[#FBF9F5] ${
                      isSelected
                        ? 'border-[#9A3412] bg-[#F5F1E8]'
                        : 'border-[#E5DEC9] hover:border-[#78716C]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#57534E] mb-2">
                        <span>
                          {item.categoryLabel} · {item.regime}
                        </span>
                        {item.chapterRef && <span>{item.chapterRef}</span>}
                      </div>

                      <h3
                        onClick={() => onSelectNode(item)}
                        className="font-display text-2xl font-semibold text-[#1C1917] hover:text-[#9A3412] cursor-pointer leading-snug"
                      >
                        {item.title}
                      </h3>

                      <p className="font-serif text-sm text-[#292524] leading-relaxed mt-3 line-clamp-4">
                        {item.definition}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#78716C] truncate">
                        {item.abntKeys.join(' · ') || 'Corpus Core'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onToggleMontageItem(item.id)}
                          className={`px-2.5 py-1 text-xs font-mono border transition-colors whitespace-nowrap ${
                            inMontage
                              ? 'bg-[#9A3412] text-[#FBF9F5] border-[#9A3412]'
                              : 'border-[#D6CEBE] text-[#1C1917] hover:bg-[#F3EFE6]'
                          }`}
                        >
                          {inMontage ? 'Na Montagem' : '+ Zwischenraum'}
                        </button>
                        <button
                          onClick={() => onSelectNode(item)}
                          className="px-3 py-1 text-xs font-medium bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524] transition-colors whitespace-nowrap"
                        >
                          Abrir Ficha
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Unified Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(960px,95vw)] transition-transform duration-200 ${
          isDockCollapsed ? 'translate-y-[calc(100%-32px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Zen Mode Tab */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsDockCollapsed((p) => !p)}
            className="px-4 py-1 text-xs font-mono bg-[#181614] text-[#D6CEBE] border border-b-0 border-[#38332E] hover:text-white transition-colors whitespace-nowrap"
          >
            {isDockCollapsed
              ? '▴ Mostrar Controles do Acervo (H)'
              : '▾ Ocultar Controles · Modo Zen (H)'}
          </button>
        </div>

        {/* Main Solid Control Surface (No backdrop-blur over WebGL) */}
        <div className="bg-[#181614] border border-[#38332E] px-4 py-3 text-[#FBF9F5] shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Hierarchy required by constellation-method.md: Constelação FIRST, then Palco, then Grade */}
            <div className="flex items-center gap-1 bg-[#0C0B0A] p-1 border border-[#292524]">
              <button
                onClick={() => onChangeViewMode('constelacao')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'constelacao'
                    ? 'bg-[#9A3412] text-white'
                    : 'text-[#D6CEBE] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Constelação
              </button>
              <button
                onClick={() => {
                  if (!selectedNode && nodes[0]) onSelectNode(nodes[0]);
                  onChangeViewMode('palco');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'palco'
                    ? 'bg-[#9A3412] text-white'
                    : 'text-[#D6CEBE] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Palco 3D
              </button>
              <button
                onClick={() => onChangeViewMode('grade')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  viewMode === 'grade'
                    ? 'bg-[#9A3412] text-white'
                    : 'text-[#D6CEBE] hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Grade
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(
                [
                  ['todos', 'Todos'],
                  ['autoral', '🔹 Autorais'],
                  ['alegoria', '🏛️ Alegorias'],
                  ['operacional', '⚙️ Operacionais'],
                  ['warburg', '🔸 Warburg'],
                  ['interlocutor', '👤 Interlocutores'],
                ] as const
              ).map(([catKey, label]) => (
                <button
                  key={catKey}
                  onClick={() => onChangeCategory(catKey)}
                  className={`px-2.5 py-1 text-xs font-mono border transition-colors whitespace-nowrap ${
                    activeCategory === catKey
                      ? 'bg-[#FBF9F5] text-[#1C1917] border-[#FBF9F5]'
                      : 'bg-transparent text-[#A8A29E] border-[#292524] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search & Camera Reset */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] justify-end">
              <div className="relative flex-1 max-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onChangeSearch(e.target.value)}
                  placeholder="Filtrar verbete ou @chave..."
                  className="w-full bg-[#0C0B0A] border border-[#38332E] pl-8 pr-3 py-1 text-xs text-[#FBF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#9A8A2A]"
                />
              </div>

              <button
                onClick={() => {
                  sceneHandlesRef.current?.focusOnNode(null, viewMode);
                }}
                title="Recentralizar câmera na Constelação"
                className="px-2.5 py-1.5 text-xs font-mono bg-[#0C0B0A] border border-[#38332E] text-[#D6CEBE] hover:text-white flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Foco Geral
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
