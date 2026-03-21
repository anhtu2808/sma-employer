import { useState, useEffect, useRef } from "react";

const useAnimatedScore = (targetScore, duration = 1000) => {
  const [displayScore, setDisplayScore] = useState(targetScore);
  const prevScoreRef = useRef(targetScore);

  useEffect(() => {
    const startScore = prevScoreRef.current;
    const diff = targetScore - startScore;

    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startScore + diff * eased;

      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevScoreRef.current = targetScore;
      }
    };

    requestAnimationFrame(animate);

    return () => {
      prevScoreRef.current = targetScore;
    };
  }, [targetScore, duration]);

  return Math.round(displayScore);
};

export default useAnimatedScore;
