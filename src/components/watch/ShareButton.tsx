import { MonitorUp, MonitorOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  isSharing: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function ShareButton({ isSharing, disabled, onStart, onStop }: ShareButtonProps) {
  if (isSharing) {
    return (
      <Button variant="destructive" size="lg" onClick={onStop}>
        <MonitorOff />
        Stop sharing
      </Button>
    );
  }

  return (
    <Button size="lg" onClick={onStart} disabled={disabled}>
      <MonitorUp />
      Share tab
    </Button>
  );
}