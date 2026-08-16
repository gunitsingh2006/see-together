import { supabase } from "@/integrations/supabase/client";

/**
 * Signaling transport.
 *
 * Only tiny JSON messages (SDP offers/answers + ICE candidates) and presence
 * ("who is in the room") travel through here. The actual screen + audio never
 * touches the server — that flows peer-to-peer over WebRTC.
 */

export type SignalBody =
  | { type: "desc"; description: RTCSessionDescriptionInit }
  | { type: "ice"; candidate: RTCIceCandidateInit };

export type SignalMessage = SignalBody & { from: string };

export const SIGNAL_EVENT = "signal";

export function createSignalingChannel(roomCode: string, clientId: string) {
  return supabase.channel(`room:${roomCode}`, {
    config: {
      presence: { key: clientId },
      broadcast: { self: false },
    },
  });
}