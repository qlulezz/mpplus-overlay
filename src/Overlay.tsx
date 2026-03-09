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
  const [ip] = useQueryState("ip", parseAsString);
  const [scale] = useQueryState("scale", parseAsFloat.withDefault(1));
  const [maxcount] = useQueryState("maxcount", parseAsInteger.withDefault(5));
  const [duration] = useQueryState("duration", parseAsInteger.withDefault(200));
  const [podium] = useQueryState("podium", parseAsBoolean.withDefault(true));
  const [flash] = useQueryState("flash", parseAsBoolean.withDefault(true));
  const [debug] = useQueryState("debug", parseAsBoolean.withDefault(false));

  // Get connected players from the multiplayer room
  const { connectedPlayers } = useMultiplayer(debug, ip ?? undefined);

  useEffect(() => {
    if (playersRef.current) {
      autoAnimate(playersRef.current, {
        duration: duration,
        easing: "ease-in-out",
      });
    }
  }, [duration]);

  // Change styles of the overlay if position is given
  const positionStyle = position
    ? (overlayPositions[position.toLowerCase()] ?? "")
    : "";

  // Sort players by highest accuracy
  // Put newly joined players and deleted scores at the bottom
  const players = connectedPlayers.sort((a, b) => {
    if (a.score.Deleted === b.score.Deleted) {
      if (a.score.Score === 0 && b.score.Score === 0)
        return b.score.Accuracy - a.score.Accuracy;
      if (a.score.Score === 0) return 1;
      if (b.score.Score === 0) return -1;
      return b.score.Accuracy - a.score.Accuracy;
    }

    return a.score.Deleted ? 1 : -1;
  });

  // Reverse direction if at the bottom of the screen
  const renderedPlayers = players.map((p, i) => {
    const count = connectedPlayers.length;
    const rank = i + 1;
    const id = p.player.LUID;

    // For a count of 3 or less, only show the top players
    if (maxcount <= 3 && rank < maxcount + 1)
      return (
        <Player key={id} rank={rank} player={p} podium={podium} flash={flash} />
      );
    if (maxcount <= 3) return;

    // Render players
    // default: up to 4
    if (i < maxcount - 1)
      return (
        <Player key={id} rank={rank} player={p} podium={podium} flash={flash} />
      );

    // Render seprator if over maxcount players
    // default: 5th player
    if (count > maxcount && rank === maxcount) return <Separator key={0} />;

    // Render last player (or 5th player)
    if (count > maxcount - 1 && rank === count)
      return <Player key={id} rank={rank} player={p} flash={flash} />;
  });

  // Reverse order if the overlay is positioned at the bottom
  if (position === "bottom-left" || position === "bottom-right")
    renderedPlayers.reverse();

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.players} ${positionStyle}`}
        ref={playersRef}
        style={{ fontSize: `${scale * 100}%` }}
      >
        {renderedPlayers}
      </div>
    </div>
  );
}
