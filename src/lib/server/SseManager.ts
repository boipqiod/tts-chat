import type EventEmitter from "events";

export class SseManager {
    clients: {id: string, client: EventEmitter}[] = [];

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

    broadcast(name: string, data: string) {
        this.clients.forEach(item => {
            const message = `data: ${JSON.stringify({name, message: data})}\n\n`;
            item.client.emit('chat', message);
        });
    }
}

