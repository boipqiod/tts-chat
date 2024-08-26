export type ChatMessage = {
  index: number;
  user: string;
  message: string;
  timestamp: number;
}

export class ChatManager {
  private index = 0;
  private messages: ChatMessage[] = [];

  static instance: ChatManager = new ChatManager();
  private constructor() {}

  addMessage(message: Omit<ChatMessage, 'index' | 'timestamp'>) {
    this.messages.push({
      index: this.index++,
      timestamp: Date.now(),
      ...message
    });
  }

  getMessages() {
    this.cleanUpMessages();
    console.log('messages', this.messages);
    
    return this.messages;
  }

  private cleanUpMessages() {
    const currentTime = Date.now();
    this.messages = this.messages.filter((message) => currentTime - message.timestamp < 1000 * 60 * 60 * 24);
  }
}