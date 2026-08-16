import { useEffect, useRef, useState } from "react";
import { MonitorPlay, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

type VideoPlayerProps = {
  stream: MediaStream | null;
  placeholder: string;
};

export function VideoPlayer({ stream, placeholder }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    if (stream) void video.play().catch(() => undefined);
  }, [stream]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-black stage-glow">
      <div className="aspect-video w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-contain"
        />
        {!stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <MonitorPlay className="size-10 opacity-60" />
            <p className="max-w-xs text-center text-sm">{placeholder}</p>
          </div>
        )}
      </div>

      {stream && (
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            aria-label="Fullscreen"
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            <Maximize />
          </Button>
        </div>
      )}
    </div>
  );
}