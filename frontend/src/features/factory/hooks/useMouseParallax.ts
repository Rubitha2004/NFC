import { useEffect, useRef, useState, useCallback } from 'react';

interface ParallaxTilt {
  x: number; // degrees rotateX (-max to +max)
  y: number; // degrees rotateY
}

/**
 * Tracks global mouse position and returns a subtle perspective tilt.
 * Used by the Pseudo-3D view to create a "camera look-around" effect.
 */
export function useMouseParallax(maxTiltDeg = 2.5): ParallaxTilt {
  const [tilt, setTilt] = useState<ParallaxTilt>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientY - cy) / cy) * -maxTiltDeg,
        y: ((e.clientX - cx) / cx) * (maxTiltDeg * 0.6),
      });
    });
  }, [maxTiltDeg]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return tilt;
}
