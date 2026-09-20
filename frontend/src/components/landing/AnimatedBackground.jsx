import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const particles = [];
    const numParticles = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden landing-gradient-bg">
      <div className="noise-overlay absolute inset-0 z-10 pointer-events-none opacity-40"></div>
      
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"
        style={{ animation: 'drift 20s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none"
        style={{ animation: 'drift-reverse 25s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute top-[30%] left-[30%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"
        style={{ animation: 'drift 30s infinite alternate ease-in-out' }}
      />
      <div
        className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] rounded-full bg-purple-600/8 blur-[120px] pointer-events-none"
        style={{ animation: 'drift-reverse 22s infinite alternate ease-in-out' }}
      />

      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="absolute inset-0 pointer-events-none"
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 50px) scale(1.1); }
        }
        @keyframes drift-reverse {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, -50px) scale(1.1); }
        }
      `}} />
    </div>
  );
}
