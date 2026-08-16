import { MonitorUp, MonitorOff } from "lucide-react";
import { btnDanger, btnPrimary } from "./styles";

type ShareButtonProps = {
  isSharing: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function ShareButton({ isSharing, disabled, onStart, onStop }: ShareButtonProps) {
  if (isSharing) {
    return (
      <button type="button" className={`${btnDanger} w-auto`} onClick={onStop}>
        <MonitorOff className="size-4" />
        Stop sharing
      </button>
    );
  }

  return (
    <button type="button" className={`${btnPrimary} w-auto`} onClick={onStart} disabled={disabled}>
      <MonitorUp className="size-4" />
      Share tab
    </button>
  );
}