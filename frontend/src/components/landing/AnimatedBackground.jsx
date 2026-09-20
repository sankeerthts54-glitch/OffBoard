import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ~80 slow-drifting star particles
    const count = Math.min(Math.floor(window.innerWidth / 16), 80);
    const particles = Array.from({ length: count }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a:  Math.random() * 0.35 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)            p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0)            p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${p.a})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Deep layered background — fixed so it doesn't scroll */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Deep midnight gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 15% 15%, rgba(99,102,241,0.12) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 20%, rgba(139,92,246,0.10) 0%, transparent 55%),
              radial-gradient(ellipse at 50% 85%, rgba(59,130,246,0.07) 0%, transparent 60%),
              radial-gradient(ellipse at 25% 65%, rgba(168,85,247,0.06) 0%, transparent 45%),
              linear-gradient(180deg, #060612 0%, #0a0a1a 40%, #0d0d20 70%, #080810 100%)
            `,
          }}
        />

        {/* Drifting glow orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbDrift1 22s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500, height: 500,
            bottom: '-10%', right: '-8%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbDrift2 28s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400, height: 400,
            top: '35%', left: '35%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbDrift1 35s ease-in-out infinite alternate-reverse',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 350, height: 350,
            top: '-5%', right: '10%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'orbDrift2 18s ease-in-out infinite alternate',
          }}
        />

        {/* Particle canvas */}
        {!prefersReduced && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          />
        )}

        {/* Subtle noise grain */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
          }}
        />
      </div>

      {/* Keyframes injected inline so they're always available */}
      <style>{`
        @keyframes orbDrift1 {
          0%   { transform: translate(0px,  0px)  scale(1.0); }
          33%  { transform: translate(60px, -40px) scale(1.08); }
          66%  { transform: translate(-30px, 50px) scale(0.94); }
          100% { transform: translate(40px,  30px) scale(1.04); }
        }
        @keyframes orbDrift2 {
          0%   { transform: translate(0px,   0px)  scale(1.0); }
          33%  { transform: translate(-50px, 35px)  scale(0.96); }
          66%  { transform: translate(40px, -55px)  scale(1.06); }
          100% { transform: translate(-30px, 20px)  scale(0.98); }
        }
      `}</style>
    </>
  );
}
