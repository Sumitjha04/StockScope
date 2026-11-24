"use client";

import { useEffect, useRef } from "react";
import { useBenchmarkStore } from "../store/useBenchmarkStore";

export function useFpsCounter() {
  const setScrollFps = useBenchmarkStore((state) => state.setScrollFps);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const loop = (currentTime: number) => {
      frameCount.current++;
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 500) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        setScrollFps(Math.min(120, fps));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [setScrollFps]);
}
