// BSPlus Types

export type Packet = Handshake | RoomEvent | PlayerEvent | ScoreEvent;

export type PlayerType = {
  player: PlayerBase;
  score: Score;
};

export interface Handshake {
  GameVersion: string;
  LocalUserID: string;
  LocalUserName: string;
  ProtocolVersion: number;
  _type: "handshake";
}

// Room Events
export type RoomEvent = RoomJoinedEvent | RoomLeavedEvent | RoomStateEvent;

export interface RoomJoinedEvent {
  _type: "event";
  _event: "RoomJoined";
}

export interface RoomLeavedEvent {
  _type: "event";
  _event: "RoomLeaved";
}

export interface RoomStateEvent {
  _type: "event";
  _event: "RoomState";
  RoomState: "None" | "SelectingSong" | "WarmingUp" | "Playing" | "Results";
}

// Player Events
export type PlayerEvent =
  | PlayerJoinedEvent
  | PlayerLeavedEvent
  | PlayerUpdatedEvent;

export interface PlayerJoinedEvent {
  _type: "event";
  _event: "PlayerJoined";
  PlayerJoined: PlayerBase;
}

export interface PlayerBase {
  LUID: number;
  UserID: string;
  UserName: string;
  Spectating: boolean;
}

export interface PlayerLeavedEvent {
  _type: "event";
  _event: "PlayerLeaved";
  PlayerLeaved: PlayerLeaved;
}

export interface PlayerLeaved {
  LUID: number;
}

export interface PlayerUpdatedEvent {
  _type: "event";
  _event: "PlayerUpdated";
  PlayerUpdated: PlayerUpdated;
}

export interface PlayerUpdated {
  LUID: number;
  Spectating: boolean;
}

// Score Events
export interface ScoreEvent {
  _type: "event";
  _event: "Score";
  Score: Score;
}

export interface Score {
  LUID?: number;
  Score: number;
  Accuracy: number;
  Combo: number;
  MissCount: number;
  Failed?: boolean;
  Deleted?: boolean;
  Spectating?: boolean;
}
