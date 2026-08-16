import { useEffect, useRef, useState } from "react";
import { MonitorPlay, Volume2, VolumeX, Maximize } from "lucide-react";
const iconBtn =
  "inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:opacity-90";
export function VideoPlayer({ stream, placeholder }) {
  const videoRef = useRef(null);
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
          <button
            type="button"
            className={iconBtn}
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            className={iconBtn}
            aria-label="Fullscreen"
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            <Maximize className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
