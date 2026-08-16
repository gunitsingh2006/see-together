import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogIn } from "lucide-react";
import { joinRoom } from "@/lib/rooms.functions";
import { btnSecondary } from "./styles";
export function JoinRoom() {
  const navigate = useNavigate();
  const join = useServerFn(joinRoom);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(event) {
    event.preventDefault();
    const roomCode = code.trim().toUpperCase();
    if (roomCode.length !== 6) {
      setError("A room code is exactly 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const room = await join({ data: { roomCode } });
      await navigate({
        to: "/room/$roomCode",
        params: { roomCode: room.roomCode },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join that room.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ENTER CODE"
        maxLength={6}
        aria-label="Room code"
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-center font-mono text-lg uppercase tracking-[0.4em] outline-none placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary"
      />
      <button type="submit" className={btnSecondary} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Join room
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
