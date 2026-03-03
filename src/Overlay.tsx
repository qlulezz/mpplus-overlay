import { useEffect, useRef } from "react";
import Player from "./components/Player";
import useMultiplayer from "./hooks/useMultiplayer";
import styles from "./Overlay.module.css";
import { parseAsString, useQueryState } from "nuqs";
import autoAnimate from "@formkit/auto-animate";

const overlayPositions: Record<string, string> = {
  "top-left": styles.top_left,
  "top-right": styles.top_right,
  "bottom-left": styles.bottom_left,
  "bottom-right": styles.bottom_right,
};

export default function Overlay() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  // Get position parameter from url
  const [queryPosition] = useQueryState("position", parseAsString);
  // Get connected players from the multiplayer room
  const { connectedPlayers } = useMultiplayer();

  useEffect(() => {
    if (overlayRef.current) {
      autoAnimate(overlayRef.current, {
        duration: 200,
        easing: "ease-in-out",
      });
    }
  }, []);

  // Change styles of the overlay if position is given
  const positionStyle = queryPosition
    ? (overlayPositions[queryPosition] ?? "")
    : "";

  // Sort players by highest accuracy
  const players = connectedPlayers.sort(
    (a, b) => b.score.Accuracy - a.score.Accuracy,
  );

  // Reverse direction if at the bottom of the screen
  const renderedPlayers = players.map((p, i) => {
    const count = connectedPlayers.length;
    const rank = i + 1;
    const id = p.player.LUID;

    // Render up to 4 players
    if (i <= 3) return <Player key={id} rank={rank} player={p} />;

    // Render divider if over 5 players
    if (count > 5 && rank === 5)
      return (
        <p key={0} className={styles.divider}>
          ...
        </p>
      );

    // Render last player
    if (count > 4 && rank === count)
      return <Player key={id} rank={rank} player={p} />;
  });

  // Reverse order if the overlay is positioned at the bottom
  if (queryPosition === "bottom-left" || queryPosition === "bottom-right")
    renderedPlayers.reverse();

  return (
    <div className={`${styles.overlay} ${positionStyle}`} ref={overlayRef}>
      {renderedPlayers}
    </div>
  );
}

