// src/routes/api/stream/+server.ts
import {SseManager} from '$lib/server/SseManager';
import type {RequestHandler} from '@sveltejs/kit';
import {EventEmitter} from 'events';
import {getRandomId} from '../../../utils/random';

const encoder = new TextEncoder();

export const GET: RequestHandler = async () => {
    const randomId = getRandomId();
    const eventEmitter = new EventEmitter();

    const readableStream = new ReadableStream({
        start(controller) {
            eventEmitter.on('chat', (message: string) => {
                controller.enqueue(encoder.encode(message));
            });
            SseManager.instance.addClient(randomId, eventEmitter);
            console.log('client added');
        },
        cancel() {
            console.log('stream cancelled');
            SseManager.instance.removeClient(randomId);
        }
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
