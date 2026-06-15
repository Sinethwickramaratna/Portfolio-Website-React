import { useEffect, useRef, useState } from 'react';
import './AtmosphericBackground.css';

function AtmosphericBackground({ type = 'hero' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Track active theme
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

  // Intersection Observer to Lazy-Load video loops
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect(); // Only load once
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autoplay disable on Mobile/Tablet Check
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  // Render Canvas Fallback Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Settings per Type
    const isDark = theme === 'dark';
    const primaryColor = isDark ? 'rgba(185, 23, 23,' : 'rgba(219, 196, 14,';
    
    // Init entities
    const particles = [];
    const particlesCount = isMobile ? 15 : 40;

    // Embers, gold dust, or DNA dots
    // Embers, gold dust, or DNA dots
    class Particle {
      constructor(isGold = false, isEmber = false) {
        this.isGold = isGold;
        this.isEmber = isEmber;
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 1.2 + 0.3);
        this.alpha = Math.random() * 0.5 + 0.1;
        this.decay = Math.random() * 0.002 + 0.001;
        this.swaySpeed = Math.random() * 0.02 + 0.01;

        if (this.isEmber) {
          const rand = Math.random();
          if (rand < 0.25) {
            this.color = 'rgba(239, 68, 68,'; // Red #ef4444
          } else if (rand < 0.65) {
            this.color = 'rgba(249, 115, 22,'; // Orange #f97316
          } else if (rand < 0.85) {
            this.color = 'rgba(234, 179, 8,'; // Gold #eab308
          } else {
            this.color = 'rgba(253, 224, 71,'; // Yellow #fde047
          }
        }
      }

      update() {
        this.x += this.vx + Math.sin(frameCount * this.swaySpeed) * 0.25;
        this.y += this.vy;
        
        if (type === 'hero') {
          this.vx += 0.0015; // wind drift
        }

        if (this.isEmber) {
          this.alpha -= this.decay;
        }

        if (this.y < -20 || this.x < -20 || this.x > width + 20 || (this.isEmber && this.alpha <= 0)) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (this.isEmber) {
          ctx.shadowBlur = this.size * 3.5;
          const fillColor = `${this.color}${this.alpha})`;
          ctx.shadowColor = fillColor;
          ctx.fillStyle = fillColor;
        } else if (this.isGold) {
          ctx.fillStyle = `rgba(219, 196, 14, ${this.alpha})`;
        } else {
          ctx.fillStyle = `${primaryColor} ${this.alpha})`;
        }
        ctx.fill();
        ctx.restore();
      }
    }

    const sakuraPetals = [];
    const sakuraCount = isMobile ? 8 : 20;

    class SakuraPetal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 6 + 4;
        this.vx = Math.random() * 0.8 - 0.2; // drift slightly right
        this.vy = Math.random() * 0.8 + 0.6; // fall down
        this.alpha = Math.random() * 0.4 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx + Math.sin(frameCount * this.swaySpeed) * 0.5;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/2, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size/2, this.size/2, -this.size/2, 0, 0);
        
        ctx.fillStyle = `rgba(244, 63, 94, ${this.alpha})`; // Rose pink #f43f5e
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particlesCount; i++) {
      particles.push(new Particle(type === 'honor', type === 'hero' || type === 'terminal'));
    }

    // Initialize sakura petals for hero section
    if (type === 'hero') {
      for (let i = 0; i < sakuraCount; i++) {
        sakuraPetals.push(new SakuraPetal());
      }
    }

    // Code lines (for Combat abilities matrix fallback)
    const codeColumns = Math.floor(width / 20);
    const codeDrops = Array(codeColumns).fill(1);
    const codeChars = "0101侍武刀心SYSINITCOMBATLOAD".split("");

    // Neural connections nodes
    const nodes = [];
    for (let i = 0; i < (isMobile ? 10 : 25); i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    // Spreading Ink blobs (Scrolls)
    const inkBlobs = [];
    for (let i = 0; i < 4; i++) {
      inkBlobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 60 + 40,
        targetRadius: Math.random() * 180 + 100,
        speed: 0.15 + Math.random() * 0.1,
        opacity: Math.random() * 0.08 + 0.02
      });
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // --- SECTION VISUAL PROCEDURAL GENERATION ---
      
      if (type === 'hero') {
        // Draw temple hill outline silhouette
        ctx.fillStyle = isDark ? 'rgba(11, 11, 11, 0.4)' : 'rgba(244, 244, 244, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.quadraticCurveTo(width * 0.3, height - 120, width * 0.65, height - 60);
        ctx.quadraticCurveTo(width * 0.85, height - 40, width, height);
        ctx.fill();

        // Draw temple pagoda silhouette
        ctx.fillStyle = isDark ? 'rgba(8, 8, 8, 0.8)' : 'rgba(235, 235, 235, 0.6)';
        const tx = width * 0.65;
        const ty = height - 70;
        ctx.fillRect(tx - 35, ty - 60, 70, 60);
        // Roofs
        ctx.beginPath();
        ctx.moveTo(tx - 50, ty - 60);
        ctx.lineTo(tx + 50, ty - 60);
        ctx.lineTo(tx + 30, ty - 75);
        ctx.lineTo(tx - 30, ty - 75);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(tx - 25, ty - 120, 50, 55);
        ctx.beginPath();
        ctx.moveTo(tx - 40, ty - 120);
        ctx.lineTo(tx + 40, ty - 120);
        ctx.lineTo(tx + 20, ty - 135);
        ctx.lineTo(tx - 20, ty - 135);
        ctx.closePath();
        ctx.fill();

        // Spire
        ctx.fillRect(tx - 2, ty - 180, 4, 50);

        // Falling Embers
        particles.forEach((p) => {
          p.update();
          p.draw();
        });

        // Drifting Sakura Petals
        sakuraPetals.forEach((p) => {
          p.update();
          p.draw();
        });

        // Soft Rain
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(185, 23, 23, 0.04)';
        ctx.lineWidth = 1.0;
        for (let i = 0; i < (isMobile ? 15 : 40); i++) {
          const rx = (Math.sin(i) * 20000 + frameCount * 2) % width;
          const ry = (Math.cos(i) * 20000 + frameCount * 6) % height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 15);
          ctx.stroke();
        }
      }

      else if (type === 'telemetry') {
        // Pulse Neural Network Grid
        ctx.strokeStyle = isDark ? 'rgba(157, 157, 157, 0.015)' : 'rgba(22, 22, 22, 0.015)';
        ctx.lineWidth = 0.5;
        const step = 80;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw node net
        nodes.forEach((node) => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(185, 23, 23, 0.15)' : 'rgba(219, 196, 14, 0.2)';
          ctx.fill();
        });

        // Connections
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 180) {
              ctx.strokeStyle = isDark ? `rgba(185, 23, 23, ${(1 - d/180) * 0.06})` : `rgba(219, 196, 14, ${(1 - d/180) * 0.08})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      }

      else if (type === 'profile') {
        // Digital DNA sine waves
        ctx.strokeStyle = isDark ? 'rgba(185, 23, 23, 0.04)' : 'rgba(219, 196, 14, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const amplitude = 50;
        const frequency = 0.005;
        const speed = frameCount * 0.015;
        
        for (let x = 0; x < width; x += 10) {
          const y1 = height * 0.5 + Math.sin(x * frequency + speed) * amplitude;
          const y2 = height * 0.5 - Math.sin(x * frequency + speed) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y1);
          } else {
            ctx.lineTo(x, y1);
          }
          
          // Verticals representing nucleotides
          if (x % 40 === 0) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y1);
          }
        }
        ctx.stroke();
      }

      else if (type === 'combat') {
        // Crimson Matrix Code streams
        ctx.fillStyle = isDark ? 'rgba(22, 22, 22, 0.05)' : 'rgba(248, 245, 239, 0.05)';
        ctx.font = '14px monospace';
        ctx.fillStyle = isDark ? 'rgba(185, 23, 23, 0.15)' : 'rgba(185, 23, 23, 0.12)';
        
        for (let i = 0; i < codeDrops.length; i++) {
          if (i % 3 !== 0) continue; // Sparse layout
          const char = codeChars[Math.floor(Math.random() * codeChars.length)];
          ctx.fillText(char, i * 20, codeDrops[i] * 20);

          if (codeDrops[i] * 20 > height && Math.random() > 0.975) {
            codeDrops[i] = 0;
          }
          codeDrops[i]++;
        }
      }

      else if (type === 'archive') {
        // Tactical map grids
        ctx.strokeStyle = isDark ? 'rgba(157, 157, 157, 0.02)' : 'rgba(22, 22, 22, 0.03)';
        ctx.lineWidth = 1;
        
        // Concentric scanning circles
        const cx = width * 0.5;
        const cy = height * 0.5;
        const rMax = (frameCount * 0.5) % 250;
        
        ctx.beginPath();
        ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, rMax + 100, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - 300, cy);
        ctx.lineTo(cx + 300, cy);
        ctx.moveTo(cx, cy - 300);
        ctx.lineTo(cx, cy + 300);
        ctx.stroke();
      }

      else if (type === 'honor') {
        // Drifting Gold particles
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }

      else if (type === 'scrolls') {
        // Spreading Japanese ink
        inkBlobs.forEach((blob) => {
          blob.radius += (blob.targetRadius - blob.radius) * blob.speed * 0.02;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(8, 8, 8, ${blob.opacity})` : `rgba(0, 0, 0, ${blob.opacity * 0.5})`;
          ctx.fill();
        });
      }

      else if (type === 'terminal') {
        // Pulsing energy reactor core rings
        const cx = width * 0.5;
        const cy = height * 0.5;
        const pulse = 1 + Math.sin(frameCount * 0.03) * 0.15;
        
        ctx.strokeStyle = isDark ? 'rgba(185, 23, 23, 0.05)' : 'rgba(185, 23, 23, 0.04)';
        ctx.lineWidth = 1.5;
        
        for (let i = 1; i <= 4; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, i * 65 * pulse, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radar line sweep
        const angle = frameCount * 0.01;
        ctx.strokeStyle = isDark ? 'rgba(185, 23, 23, 0.08)' : 'rgba(185, 23, 23, 0.05)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 350, cy + Math.sin(angle) * 350);
        ctx.stroke();
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [theme, type]);

  // Handle Video autoplay on desktop
  useEffect(() => {
    if (!videoRef.current || !shouldLoadVideo || isMobile) return;
    
    videoRef.current.load();
    const playPromise = videoRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsVideoLoaded(true);
      }).catch((e) => {
        // Autoplay blocked or failed, canvas fallback will run
        setIsVideoLoaded(false);
      });
    }
  }, [shouldLoadVideo]);

  return (
    <div className={`shogun-atmospheric-bg bg-${type}`} ref={containerRef}>
      {/* Canvas Layer (renders on top of video, always active) */}
      <canvas className="canvas-atmosphere" ref={canvasRef} />
      
      {/* Video Loop Layer (lazy loaded on Desktop only) */}
      {shouldLoadVideo && !isMobile && (
        <video
          className={`video-atmosphere ${isVideoLoaded ? 'loaded' : 'loading'}`}
          ref={videoRef}
          loop
          muted
          playsInline
          style={{ display: isVideoLoaded ? 'block' : 'none' }}
        >
          {theme === 'dark' ? (
            <source src={`/videos/${type}.webm`} type="video/webm" />
          ) : (
            <source src={`/videos/${type}-light.webm`} type="video/webm" />
          )}
        </video>
      )}
    </div>
  );
}

export default AtmosphericBackground;
