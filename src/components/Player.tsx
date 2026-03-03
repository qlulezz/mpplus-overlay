import type { PlayerType } from "../utils/types";
import styles from "./Player.module.css";

interface PlayerProps {
  rank: number;
  player: PlayerType;
}

const rankStyles = [styles.first, styles.second, styles.third];

export default function Player({ rank, player }: PlayerProps) {
  const userId = player.player.UserID;

  // Multiplayer+ stores Oculus and Steam IDs similar to ScoreSaber
  // Use Oculus icon by default, switch to Steam avatar if detected
  let avatarUrl = "https://cdn.scoresaber.com/avatars/oculus.png";
  if (userId.startsWith("76561") && userId.length === 17)
    avatarUrl = `https://cdn.scoresaber.com/avatars/${userId}.jpg`;

  // Format score to use commas or dots
  const score = player.score.Score.toLocaleString();

  // Limit acc to 2 decimals
  const acc = (player.score.Accuracy * 100).toFixed(2) + "%";

  // Add 'x' for misses, otherwise show 'FC'
  const miss = player.score.MissCount ? player.score.MissCount + "x" : "FC";

  const rankStyle = rank <= 3 ? rankStyles[rank - 1] : "";

  return (
    <div className={`${styles.player} ${rankStyle}`}>
      <p className={styles.rank}>#{rank}</p>
      <img src={avatarUrl} alt="" className={styles.avatar} />
      <p className={styles.name}>{player.player.UserName}</p>
      <p className={styles.score}>{score}</p>
      <p className={styles.miss}>{miss}</p>
      <p className={styles.acc}>{acc}</p>
    </div>
  );
}
