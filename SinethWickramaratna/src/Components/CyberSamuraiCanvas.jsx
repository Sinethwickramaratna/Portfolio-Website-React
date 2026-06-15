import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function CyberSamuraiCanvas({ revealState, setRevealState, onScanComplete }) {
  const mountRef = useRef(null);
  const [theme, setTheme] = useState('dark');
  const frameIdRef = useRef(null);
  
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Get dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Samurai Model Hierarchy Setup
    const samuraiGroup = new THREE.Group();
    scene.add(samuraiGroup);

    // Helmet Head Group (tracks cursor)
    const headGroup = new THREE.Group();
    samuraiGroup.add(headGroup);

    // Materials
    const isDark = theme === 'dark';
    const metalColor = isDark ? 0x1a1a1a : 0xdddddd;
    const trimColor = isDark ? 0xb91717 : 0xdbc40e;
    const glowColor = isDark ? 0xff3b3b : 0xb91717;

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: metalColor,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdbc40e,
      roughness: 0.15,
      metalness: 0.95
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.9
    });

    const laserMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
      transparent: true,
      opacity: 0.8,
      visible: false
    });

    // Sub-modules of Helmet (will move on reveal)
    const helmetVisorGroup = new THREE.Group();
    const helmetVisorPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.4, 16, 1, true, 0, Math.PI),
      glowMaterial
    );
    helmetVisorPlate.rotation.x = Math.PI / 2;
    helmetVisorPlate.rotation.z = Math.PI;
    helmetVisorGroup.add(helmetVisorPlate);
    headGroup.add(helmetVisorGroup);

    // Left/Right Helmet Cheek Shells
    const leftCheekGroup = new THREE.Group();
    const leftCheek = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.9, 0.8),
      carbonMaterial
    );
    leftCheek.position.set(-0.9, -0.2, 0.2);
    leftCheek.rotation.y = 0.3;
    leftCheekGroup.add(leftCheek);
    headGroup.add(leftCheekGroup);

    const rightCheekGroup = new THREE.Group();
    const rightCheek = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.9, 0.8),
      carbonMaterial
    );
    rightCheek.position.set(0.9, -0.2, 0.2);
    rightCheek.rotation.y = -0.3;
    rightCheekGroup.add(rightCheek);
    headGroup.add(rightCheekGroup);

    // Helmet Skull Top dome
    const skullDome = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      carbonMaterial
    );
    skullDome.position.y = 0.2;
    headGroup.add(skullDome);

    // Golden Horns (Kabuto Crest)
    const crestGroup = new THREE.Group();
    crestGroup.position.set(0, 0.9, 0.6);
    
    const hornL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.1, 0.8, 8),
      goldMaterial
    );
    hornL.rotation.z = 0.8;
    hornL.rotation.y = 0.4;
    hornL.position.set(-0.35, 0.25, 0);
    crestGroup.add(hornL);

    const hornR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.1, 0.8, 8),
      goldMaterial
    );
    hornR.rotation.z = -0.8;
    hornR.rotation.y = -0.4;
    hornR.position.set(0.35, 0.25, 0);
    crestGroup.add(hornR);

    const crestCenter = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.15),
      goldMaterial
    );
    crestGroup.add(crestCenter);
    headGroup.add(crestGroup);

    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 0.6, 16),
      carbonMaterial
    );
    neck.position.set(0, -0.8, 0);
    samuraiGroup.add(neck);

    // Shoulders / Chest armor
    const shouldersGroup = new THREE.Group();
    shouldersGroup.position.set(0, -1.3, 0);
    
    const chestPlate = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.6, 1.2),
      carbonMaterial
    );
    shouldersGroup.add(chestPlate);

    const chestCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshBasicMaterial({ color: trimColor })
    );
    chestCore.position.set(0, 0.1, 0.6);
    shouldersGroup.add(chestCore);

    // Left/Right floating shoulder guards (Sode armor)
    const leftSode = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.0, 1.0),
      carbonMaterial
    );
    leftSode.position.set(-1.4, -0.1, 0);
    shouldersGroup.add(leftSode);

    const rightSode = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.0, 1.0),
      carbonMaterial
    );
    rightSode.position.set(1.4, -0.1, 0);
    shouldersGroup.add(rightSode);
    samuraiGroup.add(shouldersGroup);

    // Vertical Laser Sweep Plane (for Scanning state)
    const laserSweep = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.05, 1.5),
      laserMaterial
    );
    laserSweep.position.set(0, 1.2, 0.6);
    headGroup.add(laserSweep);

    // 4. Face Reveal Map Plane
    let faceTexture = null;
    const loader = new THREE.TextureLoader();
    
    // Fallback pixel texture if image not found or loading
    const canvasF = document.createElement('canvas');
    canvasF.width = 64;
    canvasF.height = 64;
    const ctxF = canvasF.getContext('2d');
    ctxF.fillStyle = '#b91717';
    ctxF.fillRect(0, 0, 64, 64);
    ctxF.strokeStyle = '#ffffff';
    ctxF.lineWidth = 4;
    ctxF.strokeRect(10, 10, 44, 44);
    
    const placeholderTexture = new THREE.CanvasTexture(canvasF);
    
    const faceMaterial = new THREE.MeshBasicMaterial({
      map: placeholderTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    const faceGeometry = new THREE.PlaneGeometry(1.3, 1.5);
    const facePlane = new THREE.Mesh(faceGeometry, faceMaterial);
    facePlane.position.set(0, -0.1, 0.1);
    headGroup.add(facePlane);

    // Try loading actual profile image
    loader.load(
      '/profile.png',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        faceMaterial.map = texture;
        faceMaterial.needsUpdate = true;
        faceTexture = texture;
      },
      undefined,
      (err) => {
        // Fallback to local asset if not found in root
        loader.load(
          './src/assets/Images/profile.png',
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            faceMaterial.map = texture;
            faceMaterial.needsUpdate = true;
            faceTexture = texture;
          }
        );
      }
    );

    // 5. Ambient Lights
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, isDark ? 0.35 : 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(trimColor, isDark ? 1.5 : 0.8);
    directionalLight2.position.set(-5, 3, 2);
    scene.add(directionalLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.1 : 0.4);
    scene.add(ambientLight);

    // 6. Floating Kanji Textures
    const kanjiChars = ['侍', '武', '刀', '心'];
    const kanjiMeshes = [];
    
    kanjiChars.forEach((char, index) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, 128, 128);
      ctx.font = 'bold 80px "Asimovian", "Antonio", sans-serif';
      ctx.fillStyle = isDark ? '#b91717' : '#dbc40e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 64, 64);
      
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: isDark ? 0.08 : 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const geom = new THREE.PlaneGeometry(0.8, 0.8);
      const mesh = new THREE.Mesh(geom, mat);
      
      // Random coordinates around samurai
      mesh.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4 - 0.5,
        (Math.random() - 0.5) * 2 - 1.5
      );
      
      scene.add(mesh);
      kanjiMeshes.push({
        mesh,
        speed: 0.005 + Math.random() * 0.005,
        wobbleSpeed: 0.5 + Math.random() * 1.0,
        wobbleAmount: 0.1 + Math.random() * 0.2,
        baseX: mesh.position.x
      });
    });

    // 7. Animation Loop Parameters
    let laserDirection = -1;
    let scanCount = 0;
    let transitionProgress = 0;
    
    let bushidoActive = false;
    let bushidoTimer = 0;
    
    const handleBushidoActivated = () => {
      bushidoActive = true;
      bushidoTimer = 3.5;
    };
    window.addEventListener('BUSHIDO_ACTIVATED', handleBushidoActivated);
    
    const clock = new THREE.Clock();

    // Loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      // Mouse Head-Tracking Interpolation
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      // Restrict rotation to subtle angles
      headGroup.rotation.y = mouse.current.x * 0.35;
      headGroup.rotation.x = -mouse.current.y * 0.2;

      // 1. Idle Breathing and Armor Shifting Loops
      const breathing = Math.sin(elapsedTime * 1.4) * 0.02;
      samuraiGroup.position.y = breathing; // Float group
      
      // Expand Chest
      chestPlate.scale.set(1 + breathing * 0.5, 1 + breathing * 0.4, 1 + breathing * 0.5);
      
      // Pulse Core
      const corePulse = 0.7 + Math.sin(elapsedTime * 3) * 0.3;
      chestCore.material.color.setHex(trimColor);
      
      // Shoulder plates float out
      leftSode.position.x = -1.45 - Math.sin(elapsedTime * 1.0) * 0.03;
      rightSode.position.x = 1.45 + Math.sin(elapsedTime * 1.0) * 0.03;

      // Bushido protocol surge animation
      if (bushidoActive) {
        bushidoTimer -= deltaTime;
        if (bushidoTimer <= 0) {
          bushidoActive = false;
        }
        glowMaterial.color.setHex(0xdbc40e); // surge gold
        directionalLight2.intensity = 4.0; // max flare
        samuraiGroup.position.y += Math.sin(elapsedTime * 20.0) * 0.04; // vibration
      } else {
        glowMaterial.color.setHex(glowColor);
        directionalLight2.intensity = isDark ? 1.5 : 0.8;
      }

      // 2. Animate floating Kanji particles
      kanjiMeshes.forEach((k) => {
        k.mesh.position.y += k.speed;
        k.mesh.position.x = k.baseX + Math.sin(elapsedTime * k.wobbleSpeed) * k.wobbleAmount;
        k.mesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;
        
        // Loop back to bottom
        if (k.mesh.position.y > 2.5) {
          k.mesh.position.y = -2.5;
        }
      });

      // 3. Face Reveal 6-Stage Animation Controller state engine
      if (revealState === 'scanning') {
        laserMaterial.visible = true;
        // Sweep laser beam up/down
        laserSweep.position.y += laserDirection * deltaTime * 2.5;
        if (laserSweep.position.y > 1.2) {
          laserDirection = -1;
          scanCount++;
        } else if (laserSweep.position.y < -0.8) {
          laserDirection = 1;
        }
        
        // Loop twice, then progress to next state
        if (scanCount >= 2) {
          laserMaterial.visible = false;
          scanCount = 0;
          setRevealState('pulse');
        }
      } else if (revealState === 'pulse') {
        // Sudden pulse of emissive glowing red/gold
        transitionProgress += deltaTime * 2.5;
        const pulseVal = Math.sin(transitionProgress * Math.PI);
        glowMaterial.color.setHex(pulseVal > 0.5 ? 0xffffff : glowColor);
        
        if (transitionProgress >= 1.0) {
          transitionProgress = 0;
          setRevealState('separating');
        }
      } else if (revealState === 'separating') {
        // Displace cheek pieces and visor
        transitionProgress += deltaTime * 1.2;
        const offset = Math.min(transitionProgress, 1.0);
        
        leftCheekGroup.position.x = -offset * 0.65;
        leftCheekGroup.position.z = -offset * 0.2;
        leftCheekGroup.rotation.y = 0.3 - offset * 0.15;

        rightCheekGroup.position.x = offset * 0.65;
        rightCheekGroup.position.z = -offset * 0.2;
        rightCheekGroup.rotation.y = -0.3 + offset * 0.15;
        
        // Slide visor plate down
        helmetVisorGroup.position.y = -offset * 0.55;
        
        if (transitionProgress >= 1.0) {
          transitionProgress = 0;
          setRevealState('glitching');
        }
      } else if (revealState === 'glitching') {
        // Flickering holographic face fade-in
        transitionProgress += deltaTime * 1.8;
        
        if (transitionProgress < 1.0) {
          // Flickering math
          const flicker = Math.random() > 0.35 ? 1 : 0;
          faceMaterial.opacity = flicker * transitionProgress * 0.85;
          faceMaterial.color.setHex(Math.random() > 0.5 ? 0xffffff : 0xb91717);
        } else {
          faceMaterial.opacity = 0.9;
          faceMaterial.color.setHex(0xb91717);
          transitionProgress = 0;
          setRevealState('revealed');
          if (onScanComplete) onScanComplete();
        }
      } else if (revealState === 'revealed') {
        // Holographic face fully active
        faceMaterial.opacity = 0.8 + Math.sin(elapsedTime * 8) * 0.05;
        faceMaterial.color.setHex(0xb91717);
        
        // Keep armor pieces fully separated
        leftCheekGroup.position.x = -0.65;
        leftCheekGroup.position.z = -0.2;
        rightCheekGroup.position.x = 0.65;
        rightCheekGroup.position.z = -0.2;
        helmetVisorGroup.position.y = -0.55;
      } else {
        // Idle / Closed state
        faceMaterial.opacity = 0;
        leftCheekGroup.position.set(0, 0, 0);
        leftCheekGroup.rotation.y = 0;
        rightCheekGroup.position.set(0, 0, 0);
        rightCheekGroup.rotation.y = 0;
        helmetVisorGroup.position.y = 0;
        glowMaterial.color.setHex(glowColor);
      }

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      width = container.clientWidth || 600;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('BUSHIDO_ACTIVATED', handleBushidoActivated);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, revealState]);

  return (
    <div 
      className="cyber-samurai-canvas-container" 
      ref={mountRef} 
      style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}
    />
  );
}

export default CyberSamuraiCanvas;
