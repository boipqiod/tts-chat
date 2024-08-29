import {ChatManager} from "$lib/server/ChatManager";
import {SseManager} from "$lib/server/SseManager";
import type {RequestHandler} from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    
    SseManager.instance.broadcast(data.name, data.message);
    ChatManager.instance.addMessage({user: data.name, message: data.message});

    return new Response(null, { status: 204 });
}