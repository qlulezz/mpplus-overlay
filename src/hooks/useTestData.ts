/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import type { PlayerType } from "../utils/types";

// This function generates players with random scores.
// Useful for testing without having to join a multiplayer room.

export default function useTestData(playerCount = 7, refreshInterval = 2) {
  const [connectedPlayers, setConnectedPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    const players: PlayerType[] = [];
    for (let i = 0; i < playerCount; i++) {
      const LUID = Math.ceil(Math.random() * 100_000);
      const UserID =
        Math.random() > 0.5 ? "76561198256479099" : "1525854644189520";
      players.push({
        player: {
          LUID,
          UserID,
          UserName: UserID,
          Spectating: false,
        },
        score: {
          LUID,
          Score: 0,
          Accuracy: 0,
          Combo: 0,
          MissCount: 0,
          Failed: false,
          Deleted: false,
          Spectating: false,
        },
      });
    }
    setConnectedPlayers(players);

    const interval = setInterval(() => {
      setConnectedPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          score: {
            ...p.score,
            Score: Math.ceil(Math.random() * 1_000_000),
            Accuracy: Math.random(),
            Combo: Math.ceil(Math.random() * 100),
            MissCount: Math.ceil(Math.random() * 3000),
          },
        })),
      );
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [playerCount, refreshInterval]);

  return [connectedPlayers, setConnectedPlayers] as [
    PlayerType[],
    React.Dispatch<React.SetStateAction<PlayerType[]>>,
  ];
}
