import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Copy, LogOut, Users, Wifi } from "lucide-react";
import { ShareButton } from "@/components/watch/ShareButton";
import { btnGhost, btnPrimary } from "@/components/watch/styles";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import { useWatchParty } from "@/hooks/useWatchParty";

export const Route = createFileRoute("/room/$roomCode")({
  head: ({ params }) => {
    const title = `Room ${params.roomCode} — Duo Screen`;
    const description = `Watch together in private room ${params.roomCode}. Share a tab peer-to-peer with one other person.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RoomPage,
});

function RoomPage() {
  const { roomCode } = Route.useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    status,
    peerCount,
    peerConnectionState,
    remoteStream,
    isSharing,
    error,
    startSharing,
    stopSharing,
  } = useWatchParty(roomCode.toUpperCase());

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomCode.toUpperCase());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const statusLabel =
    status === "full"
      ? "Room is full"
      : status === "connecting"
        ? "Connecting…"
        : status === "waiting"
          ? "Waiting for your friend"
          : peerConnectionState === "connected"
            ? "Peer-to-peer connected"
            : "Both here — ready to share";

  if (status === "full") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">This room is full</h1>
        <p className="text-muted-foreground">A room holds only two people. Ask for a fresh code.</p>
        <Link to="/" className={`${btnPrimary} w-auto`}>
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Room code</p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
              {roomCode.toUpperCase()}
            </h1>
            <button
              type="button"
              className={btnGhost}
              aria-label="Copy room code"
              onClick={copyCode}
            >
              {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            <Users className="size-4 text-muted-foreground" />
            {peerCount}/2
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            <Wifi
              className={`size-4 ${peerConnectionState === "connected" ? "text-primary" : "text-muted-foreground"}`}
            />
            {statusLabel}
          </span>
          <button type="button" className={btnGhost} onClick={() => navigate({ to: "/" })}>
            <LogOut className="size-4" />
            Leave
          </button>
        </div>
      </header>

      <VideoPlayer
        stream={remoteStream}
        placeholder={
          peerCount < 2
            ? "Share the room code above. The screen appears here once your friend joins and shares."
            : "Connected. Either of you can hit “Share tab” to start."
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ShareButton
          isSharing={isSharing}
          disabled={peerCount < 2}
          onStart={() => void startSharing()}
          onStop={stopSharing}
        />
        {isSharing && (
          <p className="text-sm text-muted-foreground">
            You are sharing. Pick “Chrome Tab” + “Share tab audio” for sound.
          </p>
        )}
        {peerCount < 2 && !isSharing && (
          <p className="text-sm text-muted-foreground">Sharing unlocks when the second person joins.</p>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
        Video and audio travel directly between the two browsers over WebRTC (STUN:
        stun.l.google.com). The server only passes tiny offer/answer/ICE messages. On strict or
        corporate networks a TURN server is required to relay media — add its credentials to the{" "}
        <code className="mx-1 rounded bg-muted px-1 py-0.5">iceServers</code> list for production.
      </p>
    </main>
  );
}