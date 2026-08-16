import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Clapperboard } from "lucide-react";
import { createRoom } from "@/lib/rooms.functions";
import { btnPrimary } from "./styles";
export function CreateRoom() {
	const navigate = useNavigate();
	const create = useServerFn(createRoom);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	async function handleCreate() {
		setLoading(true);
		setError(null);
		try {
			const room = await create();
			await navigate({
				to: "/room/$roomCode",
				params: { roomCode: room.roomCode }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create the room.");
		} finally {
			setLoading(false);
		}
	}
	return <div className="space-y-3">
      <button type="button" className={btnPrimary} onClick={handleCreate} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Clapperboard className="size-4" />}
        Create a room
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>;
}
