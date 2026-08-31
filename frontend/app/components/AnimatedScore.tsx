"use client";

import { useEffect, useState, useRef, CSSProperties } from "react";

interface AnimatedScoreProps {
  value: number;
  className?: string;
  style?: CSSProperties;
  duration?: number;
}

export default function AnimatedScore({
  value,
  className = "",
  style,
  duration = 0.8,
}: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const targetValue = value;
    prevValueRef.current = value;

    if (startValue === targetValue) {
      setDisplayValue(targetValue);
      return;
    }

    const startTime = performance.now();
    const durationMs = duration * 1000;
    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startValue + (targetValue - startValue) * easeProgress);

      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span className={className} style={style}>
      {displayValue}
    </span>
  );
}
