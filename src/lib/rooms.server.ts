import { supabase } from "@/integrations/supabase/client";

/**
 * Room "backend" logic. Kept out of the *.functions.ts file so that the
 * server-function module stays a thin wrapper (required by the bundler).
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing 0/O/1/I

export function generateRoomCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export type RoomRecord = {
  roomCode: string;
  createdAt: string;
};

/** Create a room, retrying until we land on a code that is not taken. */
export async function createRoomRecord(): Promise<RoomRecord> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const roomCode = generateRoomCode();
    const { data, error } = await supabase
      .from("rooms")
      .insert({ room_code: roomCode, user_count: 0 })
      .select("room_code, created_at")
      .single();

    if (!error && data) {
      return { roomCode: data.room_code, createdAt: data.created_at };
    }
    // 23505 = unique violation -> code collision, try another one.
    if (error && error.code !== "23505") {
      throw new Error(`Could not create room: ${error.message}`);
    }
  }
  throw new Error("Could not create a unique room code. Please try again.");
}

/** Look a room up by code. Returns null when it does not exist. */
export async function findRoom(roomCode: string): Promise<RoomRecord | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("room_code, created_at")
    .eq("room_code", roomCode.toUpperCase())
    .maybeSingle();

  if (error) throw new Error(`Could not look up room: ${error.message}`);
  if (!data) return null;
  return { roomCode: data.room_code, createdAt: data.created_at };
}