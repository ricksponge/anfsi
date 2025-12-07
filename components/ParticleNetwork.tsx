
import React, { useEffect, useRef } from 'react';

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Optimization: Limit max particles based on screen width
      const particleCount = Math.min(window.innerWidth / 20, 80); 
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Slower velocity for smoothness
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      
      // Clear with solid color (faster than clearRect with transparency)
      ctx.fillStyle = '#020b1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pre-calculate squared radii to avoid Math.sqrt in loop
      const interactionRadiusSq = 200 * 200;
      const connectionRadiusSq = 120 * 120;

      ctx.fillStyle = '#0066ff';
      ctx.lineWidth = 0.5;

      const pLength = particles.length;

      for (let i = 0; i < pLength; i++) {
        const p = particles[i];

        // Update Position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse Interaction (Squared distance check)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < interactionRadiusSq) {
            const force = (interactionRadiusSq - distSq) / interactionRadiusSq;
            p.x -= dx * force * 0.02;
            p.y -= dy * force * 0.02;
        }

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw Connections
        // Optimization: Single pass, compare indices to avoid double checking
        for (let j = i + 1; j < pLength; j++) {
          const p2 = particles[j];
          const cDx = p.x - p2.x;
          const cDy = p.y - p2.y;
          const cDistSq = cDx * cDx + cDy * cDy;

          if (cDistSq < connectionRadiusSq) {
            // Optimization: Calculate opacity linearly from squared distance
            // 1 - (dist^2 / maxDist^2) is a good enough approximation for linear fade
            const opacity = 1 - (cDistSq / connectionRadiusSq);
            
            if (opacity > 0.05) { // Skip drawing nearly invisible lines
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none"
    />
  );
};

export default ParticleNetwork;
