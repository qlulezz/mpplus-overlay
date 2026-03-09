import { useEffect, useRef, useState } from "react";
import type { PlayerType } from "../utils/types";
import styles from "./Player.module.css";
import Avatar from "./Avatar";

interface PlayerProps {
  rank: number;
  player: PlayerType;
  podium?: boolean;
  flash?: boolean;
}

const rankStyles = [styles.first, styles.second, styles.third];

export default function Player({ rank, player, podium, flash }: PlayerProps) {
  const s = player.score;
  // Store misses
  const [flashing, setFlashing] = useState(false);
  const prevMissCount = useRef(s.MissCount);

  // If the miss count increased, (re)start the flash animation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s.MissCount > prevMissCount.current) setFlashing(true);
    prevMissCount.current = s.MissCount;
  }, [s.MissCount]);

  // Format score to use commas or dots
  const score = s.Score.toLocaleString();

  // Double acc for NF scores and limit to 2 decimals
  const acc = ((s.Failed ? s.Accuracy * 2 : s.Accuracy) * 100).toFixed(2);

  // Add 'x' for misses, otherwise show 'FC'
  const miss = s.MissCount ? s.MissCount + "x" : "FC";

  // Apply styles to the first three players, but only if the score is not 0
  const rankStyle =
    podium && rank <= 3 && s.Score !== 0 ? rankStyles[rank - 1] : "";

  // Set the rank to 0 when the score is 0
  const userRank = s.Score !== 0 ? rank : 0;

  return (
    <div className={`${styles.player} ${rankStyle}`}>
      <div
        className={`${styles.flash} ${flash && flashing ? styles.flashing : ""}`}
        onAnimationEnd={() => setFlashing(false)}
      />
      <p className={styles.rank}>#{userRank}</p>
      <Avatar id={player.player.UserID} />
      <p className={styles.name} style={s.Deleted ? { color: "red" } : {}}>
        {player.player.UserName}
      </p>
      <p className={styles.score}>{score}</p>
      <p className={styles.miss}>{miss}</p>
      <p className={styles.acc}>{acc}%</p>
    </div>
  );
}
