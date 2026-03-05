import { useEffect, useRef } from "react";
import Player from "./components/Player";
import useMultiplayer from "./hooks/useMultiplayer";
import styles from "./Overlay.module.css";
import {
  useQueryState,
  parseAsString,
  parseAsFloat,
  parseAsInteger,
  parseAsBoolean,
} from "nuqs";
import autoAnimate from "@formkit/auto-animate";
import Separator from "./components/Separator";

const overlayPositions: Record<string, string> = {
  "top-left": styles.top_left,
  "top-right": styles.top_right,
  "bottom-left": styles.bottom_left,
  "bottom-right": styles.bottom_right,
};

export default function Overlay() {
  const playersRef = useRef<HTMLDivElement | null>(null);
  // Get parameters from url
  const [position] = useQueryState("position", parseAsString);
  const [scale] = useQueryState("scale", parseAsFloat);
  const [duration] = useQueryState("duration", parseAsInteger);
  const [debug] = useQueryState("debug", parseAsBoolean);
  const [podium] = useQueryState("podium", parseAsBoolean.withDefault(true));

  // Get connected players from the multiplayer room
  const { connectedPlayers } = useMultiplayer(!!debug);

  useEffect(() => {
    if (playersRef.current) {
      autoAnimate(playersRef.current, {
        duration: duration ?? 200,
        easing: "ease-in-out",
      });
    }
  }, [duration]);

  // Change styles of the overlay if position is given
  const positionStyle = position
    ? (overlayPositions[position.toLowerCase()] ?? "")
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
    if (i < 4)
      return <Player key={id} rank={rank} player={p} podium={podium} />;

    // Render seprator if over 5 players
    if (count > 5 && rank === 5) return <Separator key={0} />;

    // Render last player (or 5th player)
    if (count > 4 && rank === count)
      return <Player key={id} rank={rank} player={p} />;
  });

  // Reverse order if the overlay is positioned at the bottom
  if (position === "bottom-left" || position === "bottom-right")
    renderedPlayers.reverse();

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.players} ${positionStyle}`}
        ref={playersRef}
        style={scale ? { zoom: scale } : {}}
      >
        {renderedPlayers}
      </div>
    </div>
  );
}
