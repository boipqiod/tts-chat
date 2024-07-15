// src/routes/api/stream/+server.ts
import {SseManager} from '$lib/server/SseManager';
import type {RequestHandler} from '@sveltejs/kit';
import {EventEmitter} from 'events';


export const GET: RequestHandler = async ({request}) => {
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        start(controller) {
            const randomId = Math.random().toString(36);
            const eventEmitter = new EventEmitter();

            eventEmitter.on('message', (message: string) => {
                controller.enqueue(encoder.encode(message));
            })

            SseManager.instance.addClient(randomId, eventEmitter);
            console.log('client added');
            request.signal.addEventListener('abort', () => {
                console.log('client removed', randomId);
                SseManager.instance.removeClient(randomId);
            });
        }
    });

    const res = new Response(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });

    return res;
};