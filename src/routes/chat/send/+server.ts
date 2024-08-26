import {SseManager} from "$lib/server/SseManager";
import type {RequestHandler} from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('broadcasting', data.message);
    
    SseManager.instance.broadcast(data.name, data.message);
    return new Response(null, { status: 204 });
}