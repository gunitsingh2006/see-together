import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createRoomRecord, findRoom } from "./rooms.server";
/**
* These server functions are the "REST API" of the app:
*   createRoom() -> POST /rooms
*   joinRoom()   -> POST /rooms/:code/join  (validation only)
*
* They never touch media — only room bookkeeping.
*/
export const createRoom = createServerFn({ method: "POST" }).handler(async () => {
	return await createRoomRecord();
});
export const joinRoom = createServerFn({ method: "POST" }).inputValidator((data) => z.object({ roomCode: z.string().trim().length(6) }).parse(data)).handler(async ({ data }) => {
	const room = await findRoom(data.roomCode);
	if (!room) throw new Error("Room not found. Double-check the code.");
	return room;
});
