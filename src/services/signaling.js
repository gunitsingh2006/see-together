import { supabase } from "@/integrations/supabase/client";
export const SIGNAL_EVENT = "signal";
export function createSignalingChannel(roomCode, clientId) {
	return supabase.channel(`room:${roomCode}`, { config: {
		presence: { key: clientId },
		broadcast: { self: false }
	} });
}
