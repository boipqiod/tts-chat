import type EventEmitter from "events";

export class SseManager {
    clients: {id: string, client: EventEmitter}[] = [];
    private encoder = new TextEncoder();

    static instance: SseManager = new SseManager();

    private constructor() {}

    addClient(id: string, client: EventEmitter) {
        this.clients.push({
            id,
            client
        });
    }
    removeClient(id: string) {
        const client = this.clients.find(item => item.id === id);
        if (!client) {
            return;
        }
        client.client.removeAllListeners();
        this.clients = this.clients.filter(item => item.id !== id);
        
    }

    broadcast(data: string) {
        this.clients.forEach(item => {
            const message = `data: ${data}\n\n`;
            item.client.emit('message', message);
        });
    }
}

