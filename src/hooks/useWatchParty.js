import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createSignalingChannel, SIGNAL_EVENT } from "@/services/signaling";
/**
* STUN discovers your public IP so two browsers behind home routers can talk
* directly. In production add a TURN server here as well — see the notes in
* the room page footer. STUN alone fails on strict/symmetric NATs and most
* corporate networks.
*/
const ICE_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
export function useWatchParty(roomCode) {
	const [clientId] = useState(() => crypto.randomUUID());
	const [status, setStatus] = useState("connecting");
	const [peerCount, setPeerCount] = useState(1);
	const [peerConnectionState, setPeerConnectionState] = useState("new");
	const [remoteStream, setRemoteStream] = useState(null);
	const [localStream, setLocalStream] = useState(null);
	const [error, setError] = useState(null);
	const channelRef = useRef(null);
	const pcRef = useRef(null);
	const peerIdRef = useRef(null);
	const localStreamRef = useRef(null);
	const makingOfferRef = useRef(false);
	const ignoreOfferRef = useRef(false);
	const politeRef = useRef(false);
	const send = useCallback((message) => {
		channelRef.current?.send({
			type: "broadcast",
			event: SIGNAL_EVENT,
			payload: {
				...message,
				from: clientId
			}
		});
	}, [clientId]);
	/** Create the RTCPeerConnection once we know who the other person is. */
	const ensurePeerConnection = useCallback(() => {
		if (pcRef.current) return pcRef.current;
		const pc = new RTCPeerConnection(ICE_CONFIG);
		pc.onicecandidate = (event) => {
			if (event.candidate) send({
				type: "ice",
				candidate: event.candidate.toJSON()
			});
		};
		pc.ontrack = (event) => {
			const [stream] = event.streams;
			if (!stream) return;
			setRemoteStream(stream);
			// When the sharer stops, the tracks end — clear the video element.
			event.track.onended = () => {
				if (stream.getTracks().every((t) => t.readyState === "ended")) setRemoteStream(null);
			};
			stream.onremovetrack = () => {
				if (stream.getTracks().length === 0) setRemoteStream(null);
			};
		};
		pc.onconnectionstatechange = () => setPeerConnectionState(pc.connectionState);
		// Fires whenever tracks are added/removed: the whole offer/answer dance.
		pc.onnegotiationneeded = async () => {
			try {
				makingOfferRef.current = true;
				await pc.setLocalDescription();
				if (pc.localDescription) send({
					type: "desc",
					description: pc.localDescription.toJSON()
				});
			} catch (err) {
				console.error("negotiation failed", err);
			} finally {
				makingOfferRef.current = false;
			}
		};
		pcRef.current = pc;
		return pc;
	}, [send]);
	const teardownPeer = useCallback(() => {
		pcRef.current?.close();
		pcRef.current = null;
		peerIdRef.current = null;
		setRemoteStream(null);
		setPeerConnectionState("new");
	}, []);
	const stopSharing = useCallback(() => {
		const stream = localStreamRef.current;
		if (!stream) return;
		stream.getTracks().forEach((track) => track.stop());
		const pc = pcRef.current;
		if (pc) {
			pc.getSenders().forEach((sender) => {
				if (sender.track) pc.removeTrack(sender);
			});
		}
		localStreamRef.current = null;
		setLocalStream(null);
	}, []);
	const startSharing = useCallback(async () => {
		setError(null);
		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true
			});
			localStreamRef.current = stream;
			setLocalStream(stream);
			const pc = ensurePeerConnection();
			stream.getTracks().forEach((track) => pc.addTrack(track, stream));
			// Browser "Stop sharing" bar.
			stream.getVideoTracks().forEach((track) => {
				track.onended = () => stopSharing();
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not start screen sharing";
			if (!/permission denied|dismissed|aborted/i.test(message)) setError(message);
		}
	}, [ensurePeerConnection, stopSharing]);
	const handleSignal = useCallback(async (message) => {
		if (message.from === clientId) return;
		const pc = ensurePeerConnection();
		try {
			if (message.type === "desc") {
				const description = message.description;
				const offerCollision = description.type === "offer" && (makingOfferRef.current || pc.signalingState !== "stable");
				ignoreOfferRef.current = !politeRef.current && offerCollision;
				if (ignoreOfferRef.current) return;
				await pc.setRemoteDescription(description);
				if (description.type === "offer") {
					await pc.setLocalDescription();
					if (pc.localDescription) send({
						type: "desc",
						description: pc.localDescription.toJSON()
					});
				}
			} else {
				try {
					await pc.addIceCandidate(message.candidate);
				} catch (err) {
					if (!ignoreOfferRef.current) throw err;
				}
			}
		} catch (err) {
			console.error("signaling error", err);
		}
	}, [
		clientId,
		ensurePeerConnection,
		send
	]);
	useEffect(() => {
		if (!roomCode) return;
		const channel = createSignalingChannel(roomCode, clientId);
		channelRef.current = channel;
		let cancelled = false;
		channel.on("presence", { event: "sync" }, () => {
			if (cancelled) return;
			const ids = Object.keys(channel.presenceState());
			const others = ids.filter((id) => id !== clientId);
			setPeerCount(Math.min(ids.length, 2));
			if (others.length === 0) {
				if (peerIdRef.current) teardownPeer();
				setStatus("waiting");
				return;
			}
			const peerId = others.sort()[0];
			if (peerIdRef.current && peerIdRef.current !== peerId) teardownPeer();
			peerIdRef.current = peerId;
			// "Polite" peer yields on glare — classic perfect-negotiation rule.
			politeRef.current = clientId > peerId;
			setStatus("ready");
			ensurePeerConnection();
		});
		channel.on("broadcast", { event: SIGNAL_EVENT }, ({ payload }) => {
			void handleSignal(payload);
		});
		channel.subscribe(async (state) => {
			if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
				setStatus("error");
				setError("Lost connection to the signaling server.");
				return;
			}
			if (state !== "SUBSCRIBED" || cancelled) return;
			const existing = Object.keys(channel.presenceState()).filter((id) => id !== clientId);
			if (existing.length >= 2) {
				setStatus("full");
				return;
			}
			await channel.track({ joinedAt: Date.now() });
		});
		const handleUnload = () => {
			void channel.untrack();
		};
		window.addEventListener("beforeunload", handleUnload);
		return () => {
			cancelled = true;
			window.removeEventListener("beforeunload", handleUnload);
			localStreamRef.current?.getTracks().forEach((t) => t.stop());
			localStreamRef.current = null;
			pcRef.current?.close();
			pcRef.current = null;
			void channel.untrack();
			void supabase.removeChannel(channel);
			channelRef.current = null;
		};
	}, [
		roomCode,
		clientId,
		ensurePeerConnection,
		handleSignal,
		teardownPeer
	]);
	return {
		clientId,
		status,
		peerCount,
		peerConnectionState,
		remoteStream,
		localStream,
		isSharing: localStream !== null,
		error,
		startSharing,
		stopSharing
	};
}
