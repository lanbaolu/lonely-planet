import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface StarfieldHandle {
  accelerate: () => void;
  reset: () => void;
  meteorShower: () => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftSpeed: number;
  driftDirection: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface StarfieldProps {
  accelerated?: boolean;
}

const Starfield = forwardRef<StarfieldHandle, StarfieldProps>(function Starfield(
  { accelerated = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const animationRef = useRef<number>(0);
  const speedMultiplierRef = useRef(1);
  const targetSpeedRef = useRef(1);
  const timeRef = useRef(0);
  const meteorTimerRef = useRef(0);
  const meteorShowerEndRef = useRef(0);

  useImperativeHandle(ref, () => ({
    accelerate: () => {
      targetSpeedRef.current = 8;
      setTimeout(() => {
        targetSpeedRef.current = 1;
      }, 5000);
    },
    reset: () => {
      targetSpeedRef.current = 1;
    },
    meteorShower: () => {
      meteorShowerEndRef.current = Date.now() + 6000;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initMeteors();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.5 + Math.random() * 1.5,
          brightness: 0.3 + Math.random() * 0.7,
          twinkleSpeed: 0.001 + Math.random() * 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
          driftSpeed: 0.05 + Math.random() * 0.1,
          driftDirection: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    const initMeteors = () => {
      const meteors: Meteor[] = [];
      for (let i = 0; i < 30; i++) {
        meteors.push({
          x: 0,
          y: 0,
          length: 0,
          speed: 0,
          angle: 0,
          opacity: 0,
          active: false,
        });
      }
      meteorsRef.current = meteors;
    };

    const spawnMeteor = () => {
      const meteors = meteorsRef.current;
      for (const m of meteors) {
        if (!m.active) {
          m.x = Math.random() * canvas.width * 1.2 - canvas.width * 0.1;
          m.y = Math.random() * canvas.height * 0.5;
          m.length = 80 + Math.random() * 120;
          m.speed = 6 + Math.random() * 8;
          m.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
          m.opacity = 0.6 + Math.random() * 0.4;
          m.active = true;
          break;
        }
      }
    };

    const drawMeteor = (m: Meteor) => {
      const tailX = m.x - Math.cos(m.angle) * m.length;
      const tailY = m.y - Math.sin(m.angle) * m.length;

      const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(200, 220, 255, ${m.opacity})`);
      gradient.addColorStop(0.3, `rgba(150, 180, 255, ${m.opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(100, 140, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 240, 255, ${m.opacity})`;
      ctx.fill();
    };

    const animate = () => {
      timeRef.current += 1;
      meteorTimerRef.current += 1;

      speedMultiplierRef.current += (targetSpeedRef.current - speedMultiplierRef.current) * 0.03;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speed = speedMultiplierRef.current;

      for (const star of starsRef.current) {
        star.x += Math.cos(star.driftDirection) * star.driftSpeed * speed;
        star.y += Math.sin(star.driftDirection) * star.driftSpeed * speed;

        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;

        const twinkle = 0.5 + 0.5 * Math.sin(timeRef.current * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.brightness * (0.6 + twinkle * 0.4);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 237, 243, ${alpha})`;
        ctx.fill();
      }

      const isShowering = Date.now() < meteorShowerEndRef.current;
      const meteorInterval = isShowering
        ? 8 + Math.random() * 20
        : 300 + Math.random() * 400;
      if (meteorTimerRef.current > meteorInterval) {
        spawnMeteor();
        if (isShowering && Math.random() < 0.5) spawnMeteor();
        meteorTimerRef.current = 0;
      }

      for (const m of meteorsRef.current) {
        if (!m.active) continue;

        m.x += Math.cos(m.angle) * m.speed * speed;
        m.y += Math.sin(m.angle) * m.speed * speed;
        m.opacity -= 0.003;

        if (m.opacity <= 0 || m.x > canvas.width + 100 || m.y > canvas.height + 100) {
          m.active = false;
          continue;
        }

        drawMeteor(m);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    targetSpeedRef.current = accelerated ? 8 : 1;
  }, [accelerated]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
});

export default Starfield;
