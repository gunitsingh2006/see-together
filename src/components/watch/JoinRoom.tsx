import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinRoom } from "@/lib/rooms.functions";

export function JoinRoom() {
  const navigate = useNavigate();
  const join = useServerFn(joinRoom);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
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
      await navigate({ to: "/room/$roomCode", params: { roomCode: room.roomCode } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join that room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ENTER CODE"
        maxLength={6}
        aria-label="Room code"
        className="h-12 text-center text-lg font-mono tracking-[0.4em] uppercase"
      />
      <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
        Join room
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}