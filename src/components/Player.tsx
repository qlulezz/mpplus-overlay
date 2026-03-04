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

  // Apply styles to the first three players, but only if the score is not 0
  const rankStyle =
    rank <= 3 && player.score.Score !== 0 ? rankStyles[rank - 1] : "";

  // Set the rank to 0 when the score is 0
  const userRank = player.score.Score !== 0 ? rank : 0;

  return (
    <div className={`${styles.player} ${rankStyle}`}>
      <p className={styles.rank}>#{userRank}</p>
      <img src={avatarUrl} alt="" className={styles.avatar} />
      <p className={styles.name}>{player.player.UserName}</p>
      <p className={styles.score}>{score}</p>
      <p className={styles.miss}>{miss}</p>
      <p className={styles.acc}>{acc}</p>
    </div>
  );
}
