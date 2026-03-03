import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Handshake, PlayerType, Packet } from "../utils/types";

// BeatSaberPlus WebSocket URL for Room Info and Scores
const webSocketUrl = "ws://127.0.0.1:2948/socket";

// Mapping for Easy-to-Read WebSocket connection state
const connectionStatus = {
  [ReadyState.CONNECTING]: "Connecting ...",
  [ReadyState.OPEN]: "Connected",
  [ReadyState.CLOSING]: "Closing ...",
  [ReadyState.CLOSED]: "Disconnected",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

export default function useMultiplayer() {
  const [connectionState, setConnectionState] = useState(
    connectionStatus[ReadyState.CLOSED],
  );
  const [handshake, setHandshake] = useState<Handshake | null>(null);
  const [connectedPlayers, setConnectedPlayers] = useState<PlayerType[]>([]);

  // Connect to BeatSaberPlus to receive messages
  // If it fails, try again after 5 seconds
  const { lastJsonMessage, readyState } = useWebSocket(webSocketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 100,
    reconnectInterval: 5000,
  });

  useEffect(() => {
    setConnectionState(connectionStatus[readyState]);
    console.info("BeatSaberPlus WebSocket:", connectionStatus[readyState]);
  }, [readyState]);

  useEffect(() => {
    function checkPacket() {
      if (!lastJsonMessage) return;
      const packet = lastJsonMessage as Packet;

      // First message is the handshake
      // It includes info about the current player
      if (packet._type === "handshake") {
        console.info("BeatSaberPlus Handshake:", packet);
        setHandshake(packet);
        return;
      }

      const ev = packet._event;

      // Ignore RoomState events
      if (ev === "RoomState") return;

      // Reset the players when joining or leaving a room
      if (ev === "RoomJoined" || ev === "RoomLeaved") {
        setConnectedPlayers([]);
        return;
      }

      // If a player leaves, remove them from the list
      if (ev === "PlayerLeaved") {
        setConnectedPlayers((prev) =>
          prev.filter((p) => p.player.LUID !== packet.PlayerLeaved.LUID),
        );
        return;
      }

      // If a player joins add them to the list of connected players
      if (ev === "PlayerJoined") {
        const userId = packet.PlayerJoined.UserID;

        setConnectedPlayers((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.player.UserID === userId,
          );

          const newPlayer: PlayerType = {
            player: packet.PlayerJoined,
            score: {
              Score: 0,
              Accuracy: 0,
              Combo: 0,
              MissCount: 0,
              Failed: false,
              Deleted: false,
            },
          };

          if (existingIndex !== -1) {
            // Replace the existing player
            const updated = [...prev];
            updated[existingIndex] = newPlayer;
            return updated;
          }

          // Add new player
          return [...prev, newPlayer];
        });
        return;
      }

      // Player updates usually only changes the Spectating flag
      if (ev === "PlayerUpdated") {
        setConnectedPlayers((prev) =>
          prev.map((p) => {
            if (p.player.LUID === packet.PlayerUpdated.LUID) {
              return {
                ...p,
                player: {
                  ...p.player,
                  Spectating: packet.PlayerUpdated.Spectating,
                },
              };
            }
            return p;
          }),
        );
        return;
      }

      // We only care about Score events now
      if (ev !== "Score") return;
      setConnectedPlayers((prev) =>
        prev.map((p) => {
          if (p.player.LUID === packet.Score.LUID) {
            return {
              ...p,
              score: packet.Score,
            };
          }
          return p;
        }),
      );
    }
    checkPacket();
  }, [lastJsonMessage]);

  return { connectionState, readyState, handshake, connectedPlayers };
}
