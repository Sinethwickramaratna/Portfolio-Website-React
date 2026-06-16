import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './Katana3DCanvas.css';

function Katana3DCanvas({ onClose }) {
  const mountRef = useRef(null);
  const [theme, setTheme] = useState('dark');
  const frameIdRef = useRef(null);
  const [bladeTemp, setBladeTemp] = useState(350);
  const [slashSpeed, setSlashSpeed] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  
  // Track mouse coordinates
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Sync theme
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    };
    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to -1 to 1
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main Three.js Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const isDark = theme === 'dark';
    const themeGlowColor = isDark ? 0xff3b3b : 0xdbc40e;
    const themeAmbientColor = isDark ? 0xb91717 : 0xf4e490;

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDark ? 1.0 : 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(themeAmbientColor, isDark ? 0.8 : 0.6);
    dirLight2.position.set(-5, 2, 2);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.25 : 0.5);
    scene.add(ambientLight);

    // Dynamic point light for fire flicker
    const fireLight = new THREE.PointLight(themeGlowColor, 2.0, 8);
    fireLight.position.set(0, -1, 1);
    scene.add(fireLight);

    // 4. Materials Setup
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.1,
      flatShading: false
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdbc40e,
      metalness: 0.9,
      roughness: 0.15
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.3
    });

    const tsukaRedMaterial = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      metalness: 0.1,
      roughness: 0.8
    });

    const hamonMaterial = new THREE.MeshBasicMaterial({
      color: themeGlowColor,
      transparent: true,
      opacity: 0.8
    });

    // 5. Build 3D Katana Sword Model
    const swordGroup = new THREE.Group();
    scene.add(swordGroup);

    // Sword components group (to offset pivot to guard/hilt junction)
    const swordComponents = new THREE.Group();
    swordComponents.position.set(0, 0, 0); // Guard is at 0, 0, 0
    swordGroup.add(swordComponents);

    // Guard (Tsuba)
    const tsubaGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.025, 8); // Octagonal guard
    const tsubaMesh = new THREE.Mesh(tsubaGeom, carbonMaterial);
    tsubaMesh.rotation.y = Math.PI / 8; // align octagonal edges
    swordComponents.add(tsubaMesh);

    // Tsuba Gold Trim
    const tsubaTrimGeom = new THREE.CylinderGeometry(0.132, 0.132, 0.006, 8, 1, true);
    const tsubaTrim = new THREE.Mesh(tsubaTrimGeom, goldMaterial);
    tsubaTrim.rotation.y = Math.PI / 8;
    swordComponents.add(tsubaTrim);

    // Habaki (Collar wrapping base of blade)
    const habakiGeom = new THREE.BoxGeometry(0.026, 0.12, 0.082);
    const habakiMesh = new THREE.Mesh(habakiGeom, goldMaterial);
    habakiMesh.position.set(0, 0.06, 0);
    swordComponents.add(habakiMesh);

    // Hilt (Tsuka)
    const tsukaGeom = new THREE.CylinderGeometry(0.024, 0.024, 0.62, 16);
    const tsukaMesh = new THREE.Mesh(tsukaGeom, tsukaRedMaterial);
    tsukaMesh.position.set(0, -0.32, 0);
    swordComponents.add(tsukaMesh);

    // Tsuka-ito (Hilt Diamond Wraps)
    const wrapGroup = new THREE.Group();
    tsukaMesh.add(wrapGroup);
    for (let j = 0; j < 8; j++) {
      const wrapGeom = new THREE.BoxGeometry(0.046, 0.025, 0.046);
      const wrapMesh = new THREE.Mesh(wrapGeom, carbonMaterial);
      wrapMesh.position.set(0, -0.22 + j * 0.065, 0);
      wrapMesh.rotation.y = Math.PI / 4;
      wrapGroup.add(wrapMesh);
      
      const wrapMesh2 = wrapMesh.clone();
      wrapMesh2.rotation.y = -Math.PI / 4;
      wrapGroup.add(wrapMesh2);
    }

    // Pommel (Kashira)
    const kashiraGeom = new THREE.CylinderGeometry(0.026, 0.022, 0.04, 16);
    const kashiraMesh = new THREE.Mesh(kashiraGeom, goldMaterial);
    kashiraMesh.position.set(0, -0.32, 0);
    tsukaMesh.add(kashiraMesh);

    // Curved Blade (Shinogi-zukuri)
    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(0, 0.12, 0); // sit above habaki
    swordComponents.add(bladeGroup);

    const segments = 16;
    const segmentHeight = 0.12;
    const curveRadius = 18; // large radius for realistic subtle curve
    const anglePerSegment = segmentHeight / curveRadius;

    let currentY = 0;
    let currentZ = 0;
    let currentAngle = 0;
    
    // Store blade tip coordinates for particles and trails
    const tipCoordinate = { y: 0, z: 0, angle: 0 };

    for (let i = 0; i < segments; i++) {
      const scale = 1 - (i / segments) * 0.35;
      
      // Main Blade Steel Mesh
      const segGeom = new THREE.BoxGeometry(0.016 * scale, segmentHeight, 0.075 * scale);
      const segMesh = new THREE.Mesh(segGeom, steelMaterial);
      
      segMesh.position.set(0, currentY + segmentHeight / 2 * Math.cos(currentAngle), currentZ + segmentHeight / 2 * Math.sin(currentAngle));
      segMesh.rotation.x = -currentAngle;
      
      // Glowing neon edge (Hamon)
      const edgeGeom = new THREE.BoxGeometry(0.003 * scale, segmentHeight, 0.012 * scale);
      const edgeMesh = new THREE.Mesh(edgeGeom, hamonMaterial);
      edgeMesh.position.set(0, 0, 0.038 * scale);
      segMesh.add(edgeMesh);
      
      bladeGroup.add(segMesh);
      
      // Update coordinates
      currentY += segmentHeight * Math.cos(currentAngle);
      currentZ += segmentHeight * Math.sin(currentAngle);
      currentAngle += anglePerSegment;

      if (i === segments - 1) {
        tipCoordinate.y = currentY;
        tipCoordinate.z = currentZ;
        tipCoordinate.angle = currentAngle;
      }
    }

    // Kissaki (Blade Tip)
    const tipGeom = new THREE.ConeGeometry(0.025, 0.12, 4);
    tipGeom.scale(0.3, 1, 1.5);
    const tipMesh = new THREE.Mesh(tipGeom, steelMaterial);
    tipMesh.position.set(0, tipCoordinate.y + 0.04, tipCoordinate.z + 0.005);
    tipMesh.rotation.x = -tipCoordinate.angle - Math.PI / 5;
    bladeGroup.add(tipMesh);

    // Glowing tip edge
    const tipGlowGeom = new THREE.ConeGeometry(0.008, 0.12, 4);
    tipGlowGeom.scale(0.1, 1, 1.6);
    const tipGlow = new THREE.Mesh(tipGlowGeom, hamonMaterial);
    tipGlow.position.set(0, tipCoordinate.y + 0.042, tipCoordinate.z + 0.012);
    tipGlow.rotation.x = -tipCoordinate.angle - Math.PI / 5;
    bladeGroup.add(tipGlow);

    // Floating Scabbard (Saya)
    const sayaGroup = new THREE.Group();
    scene.add(sayaGroup);

    let sY = 0;
    let sZ = 0;
    let sAngle = 0;
    
    for (let i = 0; i < segments + 2; i++) {
      const scale = 1 - (i / (segments + 2)) * 0.28;
      const sGeom = new THREE.BoxGeometry(0.032 * scale, segmentHeight, 0.098 * scale);
      const sMesh = new THREE.Mesh(sGeom, carbonMaterial);
      sMesh.position.set(0, sY + segmentHeight / 2 * Math.cos(sAngle), sZ + segmentHeight / 2 * Math.sin(sAngle));
      sMesh.rotation.x = -sAngle;
      
      if (i === 1 || i === 6 || i === 12) {
        const bandGeom = new THREE.BoxGeometry(0.035 * scale, 0.02, 0.103 * scale);
        const bandMesh = new THREE.Mesh(bandGeom, goldMaterial);
        sMesh.add(bandMesh);
      }
      sayaGroup.add(sMesh);
      
      sY += segmentHeight * Math.cos(sAngle);
      sZ += segmentHeight * Math.sin(sAngle);
      sAngle += anglePerSegment;
    }
    // Reposition saya next to sword
    sayaGroup.position.set(0.6, -1.0, -0.4);
    sayaGroup.rotation.z = -0.15;
    sayaGroup.rotation.y = -0.2;

    // 6. 3D Fire Particles (Embers) System
    const particleCount = isDark ? 250 : 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleData = [];

    const fireColors = isDark 
      ? [0xff3b3b, 0xf97316, 0xdbc40e, 0xef4444] // Red, orange, gold
      : [0xdbc40e, 0xf4e490, 0xeab308, 0xfde047]; // Gold, ivory, yellow

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 5;
      const py = Math.random() * 8 - 4;
      const pz = (Math.random() - 0.5) * 4 - 0.5;
      
      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;
      
      const color = new THREE.Color(fireColors[Math.floor(Math.random() * fireColors.length)]);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
      
      particleData.push({
        x: px,
        y: py,
        z: pz,
        speedY: 0.8 + Math.random() * 1.6,
        speedX: (Math.random() - 0.5) * 0.4,
        speedZ: (Math.random() - 0.5) * 0.4,
        swaySpeed: 0.6 + Math.random() * 1.5,
        swayAmount: 0.05 + Math.random() * 0.18,
        seed: Math.random() * 100
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle texture
    const canvasP = document.createElement('canvas');
    canvasP.width = 16;
    canvasP.height = 16;
    const ctxP = canvasP.getContext('2d');
    const pGrad = ctxP.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.25, isDark ? 'rgba(255, 90, 0, 0.9)' : 'rgba(244, 220, 30, 0.9)');
    pGrad.addColorStop(0.6, isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(219, 196, 14, 0.3)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctxP.fillStyle = pGrad;
    ctxP.fillRect(0, 0, 16, 16);
    
    const particleTexture = new THREE.CanvasTexture(canvasP);
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const emberParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(emberParticles);

    // 7. Slash Spark Explosion System
    const sparkCount = 80;
    const sparkGeometry = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    const sparkData = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 999;
      sparkPositions[i * 3 + 1] = 999;
      sparkPositions[i * 3 + 2] = 999;
      
      const sColor = new THREE.Color(isDark ? 0xff6611 : 0xffcc33);
      sparkColors[i * 3] = sColor.r;
      sparkColors[i * 3 + 1] = sColor.g;
      sparkColors[i * 3 + 2] = sColor.b;
      
      sparkData.push({
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.4
      });
    }

    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeometry.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const slashSparks = new THREE.Points(sparkGeometry, sparkMaterial);
    scene.add(slashSparks);

    const triggerSlashSparks = (x, y, z) => {
      const positions = sparkGeometry.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = 2.5 + Math.random() * 5.0;

        sparkData[i].vx = Math.sin(phi) * Math.cos(theta) * speed;
        sparkData[i].vy = Math.sin(phi) * Math.sin(theta) * speed;
        sparkData[i].vz = Math.cos(phi) * speed;
        sparkData[i].life = sparkData[i].maxLife;
      }
      sparkGeometry.attributes.position.needsUpdate = true;
    };

    // 8. Animation States & Parameters
    let slashTime = 0;
    let isSlashing = false;
    const clock = new THREE.Clock();

    // Trigger slash action
    const triggerSlash = () => {
      if (isSlashing) return;
      isSlashing = true;
      slashTime = 0;
      setComboCount(prev => prev + 1);
      setBladeTemp(prev => Math.min(prev + 120, 1500));
    };

    const handleCanvasClick = () => {
      triggerSlash();
    };

    // Attach click to container
    container.addEventListener('click', handleCanvasClick);

    // Listen for custom trigger button slashes
    const handleCustomSlash = () => {
      triggerSlash();
    };
    window.addEventListener('TRIGGER_3D_SLASH', handleCustomSlash);

    // 9. Animation Frame Loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      // Slow cooldown for blade temperature
      setBladeTemp(prev => Math.max(prev - deltaTime * 160, 300));

      // Dynamic light flicker
      fireLight.intensity = (isDark ? 1.5 : 0.8) + Math.sin(elapsedTime * 18) * 0.3 + (isSlashing ? 2.5 : 0);
      
      // Update mouse follow targets
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      // 3D Sword animation state controller
      if (isSlashing) {
        slashTime += deltaTime;
        const t = slashTime / 0.45; // total duration: 450ms
        
        if (t >= 1.0) {
          isSlashing = false;
          slashTime = 0;
          swordComponents.position.set(0, 0, 0);
          swordComponents.rotation.set(0, 0, 0);
        } else {
          if (t < 0.25) {
            // Windup: swing backwards
            const subT = t / 0.25;
            swordComponents.rotation.z = subT * (-Math.PI / 4.5);
            swordComponents.rotation.y = subT * (Math.PI / 5);
            swordComponents.position.x = -subT * 0.5;
            swordComponents.position.y = subT * 0.4;
            setSlashSpeed(Math.round(subT * 85));
          } else if (t < 0.55) {
            // Strike: swipe forward rapidly
            const subT = (t - 0.25) / 0.30;
            swordComponents.rotation.z = -Math.PI / 4.5 + subT * (1.1 * Math.PI);
            swordComponents.rotation.y = Math.PI / 5 - subT * (Math.PI / 2.5);
            swordComponents.position.x = -0.5 + subT * 1.6;
            swordComponents.position.y = 0.4 - subT * 1.3;
            swordComponents.position.z = subT * 0.5;
            setSlashSpeed(Math.round(85 + subT * 215));

            // Trigger sparks at peak (start of strike)
            if (slashTime - deltaTime < 0.12 && slashTime >= 0.11) {
              const tipPosWorld = new THREE.Vector3(0, 2.2, 0);
              tipPosWorld.applyMatrix4(swordComponents.matrixWorld);
              triggerSlashSparks(tipPosWorld.x, tipPosWorld.y, tipPosWorld.z);
              
              // Audio feedback hook
              window.dispatchEvent(new CustomEvent('BUSHIDO_ACTIVATED'));
            }
          } else {
            // Recovery: return to rest
            const subT = (t - 0.55) / 0.45;
            const targetPos = new THREE.Vector3(0, 0, 0);
            swordComponents.position.lerp(targetPos, 0.15);
            
            // Lerp rotations
            swordComponents.rotation.x *= 0.85;
            swordComponents.rotation.y *= 0.85;
            swordComponents.rotation.z *= 0.85;
            setSlashSpeed(Math.round((1 - subT) * 120));
          }
        }
      } else {
        // Idle breathing floats and mouse reaction
        const breathing = Math.sin(elapsedTime * 1.3) * 0.04;
        swordComponents.position.y = breathing;
        
        // Follow cursor tilting
        swordComponents.rotation.y = elapsedTime * 0.1 + mouse.current.x * 0.65;
        swordComponents.rotation.x = mouse.current.y * 0.45;
        swordComponents.rotation.z = Math.sin(elapsedTime * 0.4) * 0.03;
        setSlashSpeed(0);
      }

      // Rotate Scabbard slowly as background element
      sayaGroup.rotation.y = -0.2 + Math.sin(elapsedTime * 0.5) * 0.05 + mouse.current.x * 0.2;
      sayaGroup.rotation.x = Math.cos(elapsedTime * 0.5) * 0.02 + mouse.current.y * 0.1;

      // Update Fire Embers positions (drift up and reset)
      const pPositions = emberParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const d = particleData[i];
        
        // Sway drift
        pPositions[i * 3] += (d.speedX + Math.sin(elapsedTime * d.swaySpeed + d.seed) * d.swayAmount) * deltaTime;
        pPositions[i * 3 + 1] += d.speedY * deltaTime;
        pPositions[i * 3 + 2] += d.speedZ * deltaTime;

        // Reset if particles exit viewport height
        if (pPositions[i * 3 + 1] > 4.5) {
          pPositions[i * 3] = (Math.random() - 0.5) * 5;
          pPositions[i * 3 + 1] = -4.5;
          pPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
        }
      }
      emberParticles.geometry.attributes.position.needsUpdate = true;

      // Update Slash Spark physics
      const sPositions = slashSparks.geometry.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        if (sparkData[i].life > 0) {
          sparkData[i].life -= deltaTime;
          sPositions[i * 3] += sparkData[i].vx * deltaTime;
          sPositions[i * 3 + 1] += sparkData[i].vy * deltaTime;
          sPositions[i * 3 + 2] += sparkData[i].vz * deltaTime;
          
          // Apply gravity decay
          sparkData[i].vy -= 6.5 * deltaTime;
        } else {
          // Offscreen hide
          sPositions[i * 3] = 999;
          sPositions[i * 3 + 1] = 999;
          sPositions[i * 3 + 2] = 999;
        }
      }
      slashSparks.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    // Resize listener
    const handleResize = () => {
      width = container.clientWidth || 600;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      container.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('TRIGGER_3D_SLASH', handleCustomSlash);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  // Handle click check to stop close bubbling
  const stopCloseBubbling = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="katana-3d-centerpiece-container fade-in-up" onClick={stopCloseBubbling}>
      {/* 3D WebGL Canvas Mount point */}
      <div className="katana-canvas-mount" ref={mountRef} />

      {/* Cyber HUD Telemetry Panels */}
      <div className="katana-hud-dashboard">
        {/* Panel 1: Core status */}
        <div className="katana-hud-card katana-hud-core shogun-card">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// ENERGY_BLADE_CORES //</div>
          <div className="hud-card-stat monospace-val">TEMP: {Math.round(bladeTemp)}°C</div>
          <div className="hud-card-status text-gradient">
            CORE: {bladeTemp > 1000 ? 'THERMAL OVERLOAD' : 'NOMINAL'}
          </div>
        </div>

        {/* Panel 2: Combat Telemetry */}
        <div className="katana-hud-card katana-hud-combat shogun-card">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// COMBAT_TELEMETRY //</div>
          <div className="hud-card-stat monospace-val">SLASH SPEED: {slashSpeed} m/s</div>
          <div className="hud-card-status text-gold">COMBOS: {comboCount} HITS</div>
        </div>

        {/* Action Controls */}
        <div className="katana-hud-actions">
          <button 
            className="btn-premium btn-primary-glow slash-trigger-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('TRIGGER_3D_SLASH'))}
          >
            [ EXECUTE SLASH ]
          </button>
          
          <button 
            className="btn-premium btn-outline sheathe-btn" 
            onClick={onClose}
          >
            [ SHEATHE BLADE ]
          </button>
        </div>
      </div>

      {/* Helper text overlay */}
      <div className="katana-instruction-overlay monospace-val">
        &gt; CLICK CANVAS AREA TO TRIGGER KATANA STRIKE & SPARKS
      </div>
    </div>
  );
}

export default Katana3DCanvas;
