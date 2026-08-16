import { createFileRoute } from "@tanstack/react-router";
import { Popcorn } from "lucide-react";
import { CreateRoom } from "@/components/watch/CreateRoom";
import { JoinRoom } from "@/components/watch/JoinRoom";
const title = "Duo Screen — Watch together, just the two of you";
const description =
  "Create a private 2-person room, share a browser tab with screen audio, and watch in sync. Peer-to-peer over WebRTC — no uploads, no accounts.";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      {
        name: "description",
        content: description,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
    ],
  }),
  component: Index,
});
function Index() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-10 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-card stage-glow">
          <Popcorn className="size-7 text-primary" />
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Duo Screen</h1>
        <p className="mt-3 text-muted-foreground">
          A private room for two. Share a tab, watch it together — the video goes straight from your
          browser to theirs.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
        <CreateRoom />

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or join
          <span className="h-px flex-1 bg-border" />
        </div>

        <JoinRoom />
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Screen sharing needs Chrome, Edge, or another Chromium browser over HTTPS.
      </p>
    </main>
  );
}
