import { ChatMessage } from '../types';

type MessageCallback = (msg: ChatMessage) => void;

class ChatServiceImpl {
  private timer: NodeJS.Timeout | null = null;
  private listener: MessageCallback | null = null;

  private samplePool = [
    ["David M.", "Amen and Amen! Powerful Word!"],
    ["Esther O.", "Praying along from home with my children."],
    ["Joy N.", "God bless you mightily, Pastor Israel."],
    ["Peter B.", "Hallelujah! Chains are breaking in my life right now!"],
    ["Ruth A.", "Please pray for my mother's health. Believing God!"],
    ["Daniel K.", "Joining live from Accra. Glory be to God!"],
    ["Sarah W.", "Thank you Jesus for this timely deliverance word!"]
  ];

  subscribe(callback: MessageCallback) {
    this.listener = callback;
    const scheduleNext = () => {
      this.timer = setTimeout(() => {
        if (!this.listener) return;
        const [author, message] = this.samplePool[Math.floor(Math.random() * this.samplePool.length)];
        this.listener({
          id: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          author,
          message,
          createdAt: new Date().toISOString()
        });
        scheduleNext();
      }, 7000 + Math.random() * 8000);
    };

    scheduleNext();
  }

  send(author: string, message: string): ChatMessage {
    const newMsg: ChatMessage = {
      id: `mine-${Date.now()}`,
      author: author.trim() || "Guest",
      message: message.trim(),
      createdAt: new Date().toISOString(),
      mine: true
    };
    if (this.listener) {
      this.listener(newMsg);
    }
    return newMsg;
  }

  disconnect() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.listener = null;
  }
}

export const chatService = new ChatServiceImpl();
