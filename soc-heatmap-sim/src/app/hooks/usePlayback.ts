import { useState } from 'react';

export function usePlayback() {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  return {
    currentTimestamp,
    isPlaying,
    speedMultiplier,
    setCurrentTimestamp,
    setIsPlaying,
    setSpeedMultiplier
  };
}
