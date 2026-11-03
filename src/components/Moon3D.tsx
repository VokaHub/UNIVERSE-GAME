import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Moon3DProps {
  className?: string;
}

/**
 * Genera una textura lunar procedimental fotorrealista en un canvas 2D
 * Sin dependencias externas ni riesgos de fallos de red/404.
 */
function createProceduralMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Fondo base de regolito lunar grisáceo
  ctx.fillStyle = '#83868c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generar variaciones de tonalidad (Mares Lunares oscuros)
  const mariaData = [
    { x: 380, y: 190, rx: 110, ry: 80, color: 'rgba(55, 60, 68, 0.75)' }, // Mar de la Tranquilidad
    { x: 300, y: 160, rx: 90, ry: 75, color: 'rgba(50, 56, 64, 0.72)' },  // Mar de las Lluvias
    { x: 490, y: 220, rx: 80, ry: 70, color: 'rgba(58, 63, 70, 0.70)' },  // Mar de la Serenidad
    { x: 220, y: 260, rx: 120, ry: 90, color: 'rgba(48, 54, 62, 0.68)' }, // Océano de las Tormentas
    { x: 620, y: 280, rx: 70, ry: 60, color: 'rgba(65, 70, 77, 0.65)' },  // Mar de la Fecundidad
    { x: 420, y: 350, rx: 85, ry: 65, color: 'rgba(52, 58, 66, 0.70)' },  // Mar del Néctar
  ];

  mariaData.forEach(({ x, y, rx, ry, color }) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.filter = 'blur(16px)';
    ctx.fill();
    ctx.restore();
  });

  // Generar cráteres grandes y medianos con relieve
  const craters = [
    { x: 320, y: 370, r: 24 }, // Tycho
    { x: 260, y: 170, r: 18 }, // Copérnico
    { x: 190, y: 160, r: 14 }, // Kepler
    { x: 420, y: 140, r: 16 }, // Aristóteles
    { x: 500, y: 470, r: 15 }, // Zona Polo Sur / Amundsen
    { x: 512, y: 495, r: 12 }, // Cráter Shackleton
  ];

  craters.forEach(({ x, y, r }) => {
    // Sombra del borde
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 34, 40, 0.85)';
    ctx.fill();

    // Borde brillante iluminado
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, r * 0.95, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(210, 215, 225, 0.7)';
    ctx.lineWidth = Math.max(2, r * 0.15);
    ctx.stroke();

    // Pico central
    if (r > 15) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 225, 235, 0.8)';
      ctx.fill();
    }
    ctx.restore();
  });

  // Rayos brillantes de eyección de Tycho
  ctx.save();
  ctx.strokeStyle = 'rgba(215, 220, 230, 0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 18; i++) {
    const angle = (i * Math.PI * 2) / 18 + Math.random() * 0.1;
    const len = 90 + Math.random() * 120;
    ctx.beginPath();
    ctx.moveTo(320, 370);
    ctx.lineTo(320 + Math.cos(angle) * len, 370 + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();

  // Ruido fino de regolito (micrometeoritos y textura granular)
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const Moon3D: React.FC<Moon3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Escena Three.js
    const scene = new THREE.Scene();

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // 3. Renderer con codificación de color sRGB
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Grupo Lunar (Esfera + Pin de la Misión)
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    // Esfera lunar
    const moonGeometry = new THREE.SphereGeometry(1.4, 48, 48);
    const moonTexture = createProceduralMoonTexture();
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.92,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonGroup.add(moonMesh);

    // Marcador visual en el Polo Sur Lunar (89.9° S -> polo inferior)
    const markerGroup = new THREE.Group();
    // Posición en la esfera en el polo sur
    markerGroup.position.set(0, -1.39, 0.15);
    moonMesh.add(markerGroup);

    // Aro de pulso del marcador
    const markerRingGeom = new THREE.RingGeometry(0.04, 0.065, 32);
    const markerRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const markerRing = new THREE.Mesh(markerRingGeom, markerRingMat);
    markerRing.rotation.x = Math.PI / 2;
    markerGroup.add(markerRing);

    // Punto central del marcador
    const markerDotGeom = new THREE.SphereGeometry(0.025, 16, 16);
    const markerDotMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const markerDot = new THREE.Mesh(markerDotGeom, markerDotMat);
    markerGroup.add(markerDot);

    // 5. Luces cinemáticas espaciales
    // Luz solar directa (Key Light lateral que produce fase gibosa/creciente cinematográfica)
    const sunLight = new THREE.DirectionalLight(0xfff6ea, 3.2);
    sunLight.position.set(6, 1.8, 4);
    scene.add(sunLight);

    // Luz de relleno azulada profunda del espacio (Hemisphere)
    const spaceFillLight = new THREE.HemisphereLight(0x1a2333, 0x05070a, 0.45);
    scene.add(spaceFillLight);

    // Luz de borde trasera sutil (Rim Light)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // 6. Campo de estrellas procedimental de fondo
    const starCount = 350;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 40;
      starPositions[i + 2] = -6 - Math.random() * 20;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xcfd8dc,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Inclinación orbital inicial realista (~6.7 grados)
    moonGroup.rotation.z = THREE.MathUtils.degToRad(6.7);
    moonGroup.rotation.x = THREE.MathUtils.degToRad(18); // Mostrar ligeramente el polo sur

    // 7. Control de interacción por arrastre (Mouse / Touch)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let autoRotate = true;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      autoRotate = false;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      velocityX = deltaX * 0.005;
      velocityY = deltaY * 0.005;

      moonGroup.rotation.y += velocityX;
      moonGroup.rotation.x += velocityY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => {
        autoRotate = true;
        setIsInteracting(false);
      }, 2500);
    };

    // Zoom con rueda de ratón suave
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.0025, 3.0), 6.5);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 8. Loop de animación continuo
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotación pasiva continua cuando no se arrastra
      if (autoRotate) {
        moonGroup.rotation.y += 0.12 * delta;
      } else {
        // Amortiguación inercial
        velocityX *= 0.93;
        velocityY *= 0.93;
        moonGroup.rotation.y += velocityX;
        moonGroup.rotation.x += velocityY;
      }

      // Animación pulsante suave del marcador del polo sur
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3) * 0.15;
      markerRing.scale.set(scale, scale, 1);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Manejo de redimensionamiento
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Limpieza estricta de memoria WebGL
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);

      moonGeometry.dispose();
      moonMaterial.dispose();
      moonTexture.dispose();
      markerRingGeom.dispose();
      markerRingMat.dispose();
      markerDotGeom.dispose();
      markerDotMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Guía interactiva discreta */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 text-[11px] font-mono text-cyan-300/80 bg-slate-950/60 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm ${
          isInteracting ? 'opacity-30' : 'opacity-85'
        }`}
      >
        <span>Arrastra para girar la Luna · Zoom con rueda</span>
      </div>
    </div>
  );
};
