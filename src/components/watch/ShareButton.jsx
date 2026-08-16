import { MonitorUp, MonitorOff } from "lucide-react";
import { btnDanger, btnPrimary } from "./styles";
export function ShareButton({ isSharing, disabled, onStart, onStop }) {
	if (isSharing) {
		return <button type="button" className={`${btnDanger} w-auto`} onClick={onStop}>
        <MonitorOff className="size-4" />
        Stop sharing
      </button>;
	}
	return <button type="button" className={`${btnPrimary} w-auto`} onClick={onStart} disabled={disabled}>
      <MonitorUp className="size-4" />
      Share tab
    </button>;
}
