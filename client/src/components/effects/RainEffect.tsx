import { useEffect, useRef } from 'react';
import RaindropFX from 'raindrop-fx';

export default function RainEffect({ backgroundImage }: { backgroundImage: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raindropFx: any;
    let animFrame: number;

    const initRain = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        animFrame = requestAnimationFrame(initRain);
        return;
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      try {
        raindropFx = new RaindropFX({
          canvas: canvas,
          background: backgroundImage,
          spawnInterval: [50, 150],
          spawnSize: [80, 200],
          trailDropSize: [15, 30], 
        });
        raindropFx.start();
      } catch (e) {
        console.warn('WebGL не поддерживается:', e);
      }
    };

    animFrame = requestAnimationFrame(initRain);

    const onResize = () => {
      if (!canvasRef.current) return;
      const newRect = canvasRef.current.getBoundingClientRect();
      if (raindropFx) raindropFx.resize(newRect.width, newRect.height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', onResize);
      if (raindropFx && raindropFx.stop) raindropFx.stop();
    };
  }, [backgroundImage]);

  return <canvas ref={canvasRef} className="rain-canvas" />;
}