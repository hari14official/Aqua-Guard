import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TankLiveState } from '../../types/tank';
import { Waves, Rotate3d } from 'lucide-react';

interface TankGauge3DProps {
  liveState: TankLiveState;
}

export const TankGauge3D: React.FC<TankGauge3DProps> = ({ liveState }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const percent = Math.min(100, Math.max(0, liveState.levelPercent));
  const isPumping = liveState.pump;
  const isDirty = liveState.turbidityStatus === 'DIRTY';
  const isCloudy = liveState.turbidityStatus === 'CLOUDY';

  const animFrameRef = useRef<number | null>(null);
  const targetLevelRef = useRef<number>(percent / 100);
  const currentLevelRef = useRef<number>(percent / 100);
  const isPumpingRef = useRef<boolean>(isPumping);
  const isDirtyRef = useRef<boolean>(isDirty);
  const isCloudyRef = useRef<boolean>(isCloudy);

  targetLevelRef.current = percent / 100;
  isPumpingRef.current = isPumping;
  isDirtyRef.current = isDirty;
  isCloudyRef.current = isCloudy;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 360;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.8);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 1.8);
    dirLight2.position.set(-3, -2, 2.5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.0, 5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Tank Container Group
    const tankGroup = new THREE.Group();
    scene.add(tankGroup);

    // Proportions for clean transparent cylindrical tank
    const tankRadius = 1.15;
    const cylinderHeight = 2.4;
    const domeHeight = 0.42;
    const lidRadius = 0.52;
    const lidHeight = 0.16;
    const tankBaseY = -cylinderHeight / 2;

    // Transparent Polymer / Glass Material (No horizontal rib lines)
    const transparentTankMat = new THREE.MeshPhysicalMaterial({
      color: 0xcfd8dc,
      transparent: true,
      opacity: 0.32,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.92,
      ior: 1.46,
      side: THREE.DoubleSide
    });

    const solidLidMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.75
    });

    // A. Main Cylindrical Transparent Wall (Clean, smooth, NO horizontal lines)
    const cylGeo = new THREE.CylinderGeometry(tankRadius, tankRadius, cylinderHeight, 64, 1, true);
    const cylMesh = new THREE.Mesh(cylGeo, transparentTankMat);
    tankGroup.add(cylMesh);

    // B. Conical Sloped Top Dome
    const domeGeo = new THREE.CylinderGeometry(lidRadius * 1.1, tankRadius, domeHeight, 64, 1, true);
    const domeMesh = new THREE.Mesh(domeGeo, transparentTankMat);
    domeMesh.position.y = cylinderHeight / 2 + domeHeight / 2;
    tankGroup.add(domeMesh);

    // C. Top Inspection Lid Neck & Cap
    const neckGeo = new THREE.CylinderGeometry(lidRadius, lidRadius, lidHeight, 48);
    const neckMesh = new THREE.Mesh(neckGeo, solidLidMat);
    neckMesh.position.y = cylinderHeight / 2 + domeHeight + lidHeight / 2;
    tankGroup.add(neckMesh);

    const lidCapGeo = new THREE.CylinderGeometry(lidRadius * 1.08, lidRadius * 1.08, 0.06, 48);
    const lidCapMesh = new THREE.Mesh(lidCapGeo, solidLidMat);
    lidCapMesh.position.y = cylinderHeight / 2 + domeHeight + lidHeight + 0.03;
    tankGroup.add(lidCapMesh);

    // D. Flat Tank Bottom Base
    const bottomGeo = new THREE.CylinderGeometry(tankRadius * 1.03, tankRadius * 1.03, 0.08, 48);
    const bottomMesh = new THREE.Mesh(bottomGeo, solidLidMat);
    bottomMesh.position.y = -cylinderHeight / 2 - 0.04;
    tankGroup.add(bottomMesh);

    // Bottom Outlet Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.3, 16);
    const pipeMesh = new THREE.Mesh(pipeGeo, solidLidMat);
    pipeMesh.position.set(0, -cylinderHeight / 2 - 0.19, 0);
    tankGroup.add(pipeMesh);

    // 5. Water Volume - STRICTLY INSIDE THE TANK (waterRadius = 0.98, smaller than tankRadius 1.15)
    // This guarantees water never pokes or shows outside the tank!
    const waterRadius = tankRadius * 0.90;
    const maxWaterHeight = cylinderHeight * 0.96;

    // Water Column Cylinder
    const waterGeo = new THREE.CylinderGeometry(waterRadius, waterRadius, 1, 48, 1, false);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.84,
      roughness: 0.1,
      metalness: 0.08,
      transmission: 0.65,
      ior: 1.333
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = tankBaseY + 0.5;
    tankGroup.add(waterMesh);

    // Top Wave Surface Mesh - Using CIRCLE Geometry (Strictly round, NO rectangular corners outside!)
    const surfaceSegments = 32;
    const surfaceGeo = new THREE.CircleGeometry(waterRadius, surfaceSegments);
    surfaceGeo.rotateX(-Math.PI / 2);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.92,
      roughness: 0.08,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    tankGroup.add(surfaceMesh);

    // Cache original surface vertices for floating wave physics
    const originalPositions = surfaceGeo.attributes.position.array.slice();

    // 6. Floating Rising Air Bubbles inside the water column
    const bubbleCount = 22;
    const bubbles: { mesh: THREE.Mesh; speed: number; seed: number }[] = [];
    const bubbleGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });

    for (let i = 0; i < bubbleCount; i++) {
      const bMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (waterRadius * 0.75);
      bMesh.position.set(Math.cos(angle) * r, tankBaseY + Math.random() * cylinderHeight, Math.sin(angle) * r);
      tankGroup.add(bMesh);
      bubbles.push({
        mesh: bMesh,
        speed: 0.012 + Math.random() * 0.02,
        seed: Math.random() * 100
      });
    }

    // 7. Water Inflow Jet Spray Particles
    const sprayCount = 14;
    const sprayParticles: { mesh: THREE.Mesh; speed: number }[] = [];
    const sprayGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const sprayMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.85 });

    for (let i = 0; i < sprayCount; i++) {
      const sMesh = new THREE.Mesh(sprayGeo, sprayMat);
      sMesh.position.set((Math.random() - 0.5) * 0.08, cylinderHeight / 2 + domeHeight, (Math.random() - 0.5) * 0.08);
      sMesh.visible = false;
      tankGroup.add(sMesh);
      sprayParticles.push({ mesh: sMesh, speed: 0.04 + Math.random() * 0.03 });
    }

    // 8. Probe sensor LEDs inside the tank
    const probeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 12);
    probeGeo.rotateZ(Math.PI / 2);
    const lowProbeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.7 });
    const lowProbeMesh = new THREE.Mesh(probeGeo, lowProbeMat);
    const lowY = tankBaseY + maxWaterHeight * 0.2;
    lowProbeMesh.position.set(tankRadius * 0.98, lowY, 0);
    tankGroup.add(lowProbeMesh);

    const fullProbeMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9, emissiveIntensity: 0.7 });
    const fullProbeMesh = new THREE.Mesh(probeGeo, fullProbeMat);
    const fullY = tankBaseY + maxWaterHeight * 0.9;
    fullProbeMesh.position.set(tankRadius * 0.98, fullY, 0);
    tankGroup.add(fullProbeMesh);

    // 9. Interactive Drag Orbit Handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      tankGroup.rotation.y += deltaX * 0.01;
      tankGroup.rotation.x = Math.max(-0.4, Math.min(0.4, tankGroup.rotation.x + deltaY * 0.005));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      tankGroup.rotation.y += deltaX * 0.01;
      tankGroup.rotation.x = Math.max(-0.4, Math.min(0.4, tankGroup.rotation.x + deltaY * 0.005));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 10. Real-Time Water Floating Movement Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Level Interpolation
      currentLevelRef.current += (targetLevelRef.current - currentLevelRef.current) * 0.05;
      const level = Math.max(0.03, currentLevelRef.current);
      const currentHeight = level * maxWaterHeight;

      // Floating water heave movement (subtle vertical bobbing)
      const floatHeave = Math.sin(elapsedTime * 2.2) * 0.014;

      // Update water column
      waterMesh.scale.set(1, currentHeight, 1);
      waterMesh.position.y = tankBaseY + currentHeight / 2 + floatHeave;

      // Update top surface position
      const surfaceY = tankBaseY + currentHeight + floatHeave;
      surfaceMesh.position.y = surfaceY;

      // Dynamic water color based on turbidity
      if (isDirtyRef.current) {
        waterMat.color.setHex(0xd97706);
        surfaceMat.color.setHex(0xf59e0b);
      } else if (isCloudyRef.current) {
        waterMat.color.setHex(0x0f766e);
        surfaceMat.color.setHex(0x14b8a6);
      } else {
        waterMat.color.setHex(0x0284c7);
        surfaceMat.color.setHex(0x38bdf8);
      }

      // Real-time animated sinusoidal floating wave surface
      const posAttribute = surfaceGeo.attributes.position;
      const vertexPositions = posAttribute.array;
      const waveAmplitude = isPumpingRef.current ? 0.045 : 0.020;
      const waveSpeed = isPumpingRef.current ? 3.8 : 2.2;

      for (let i = 0; i < posAttribute.count; i++) {
        const u = originalPositions[i * 3];
        const w = originalPositions[i * 3 + 2];
        const distFromCenter = Math.sqrt(u * u + w * w);

        if (distFromCenter <= waterRadius) {
          const wave =
            Math.sin(u * 5.0 + elapsedTime * waveSpeed) * Math.cos(w * 5.0 + elapsedTime * waveSpeed) * waveAmplitude +
            Math.sin(distFromCenter * 7 - elapsedTime * (waveSpeed * 1.3)) * (waveAmplitude * 0.5);
          vertexPositions[i * 3 + 1] = wave;
        }
      }
      posAttribute.needsUpdate = true;
      surfaceGeo.computeVertexNormals();

      // Rising bubble physics
      bubbles.forEach((b) => {
        if (level > 0.06) {
          b.mesh.visible = true;
          b.mesh.position.y += b.speed * (isPumpingRef.current ? 2.5 : 1.0);
          b.mesh.position.x += Math.sin(elapsedTime * 2.5 + b.seed) * 0.0025;

          if (b.mesh.position.y >= surfaceY) {
            b.mesh.position.y = tankBaseY + 0.05;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * (waterRadius * 0.7);
            b.mesh.position.x = Math.cos(angle) * r;
            b.mesh.position.z = Math.sin(angle) * r;
          }
        } else {
          b.mesh.visible = false;
        }
      });

      // Spray stream when pump is active
      sprayParticles.forEach((sp) => {
        if (isPumpingRef.current) {
          sp.mesh.visible = true;
          sp.mesh.position.y -= sp.speed;
          if (sp.mesh.position.y <= surfaceY) {
            sp.mesh.position.y = cylinderHeight / 2 + domeHeight * 0.8;
            sp.mesh.position.x = (Math.random() - 0.5) * 0.08;
            sp.mesh.position.z = (Math.random() - 0.5) * 0.08;
          }
        } else {
          sp.mesh.visible = false;
        }
      });

      if (!isDragging) {
        tankGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      cylGeo.dispose();
      waterGeo.dispose();
      surfaceGeo.dispose();
      domeGeo.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-80 sm:h-96 flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/40 via-navy-950/70 to-slate-900/50 border border-slate-800/80">
      
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Control Badge */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-[10px] text-cyan-400 font-semibold shadow-xs">
        <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Transparent 3D Tank • Water in Floating Motion</span>
      </div>

      {isPumping && (
        <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] text-emerald-300 font-bold animate-pulse">
          <Waves className="w-3.5 h-3.5" />
          <span>Active Inflow In Motion</span>
        </div>
      )}

      {/* Drag instruction helper */}
      <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] text-slate-500 font-mono">
        Drag to rotate 360°
      </div>

    </div>
  );
};
