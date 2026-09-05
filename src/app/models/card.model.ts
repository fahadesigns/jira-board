export interface CardData {
  id?: string;
  listId: string;
  title: string;
  desc?: string;
  timestamp?: number;
}

export class Card {
  id: string;
  listId: string;
  title: string;
  desc: string;
  timestamp: number;

  constructor(data: CardData) {
    this.id = data.id || crypto.randomUUID();
    this.listId = data.listId;
    this.title = data.title;
    this.desc = data.desc ?? '';
    this.timestamp = data.timestamp ?? Date.now();
  }

  fmtDate(): string {
    return new Date(this.timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      listId: this.listId,
      title: this.title,
      desc: this.desc,
      timestamp: this.timestamp
    };
  }

  static fromJSON(data: Partial<CardData> | null | undefined): Card | null {
    if (!data || !data.listId || !data.title) return null;
    return new Card({
      id: data.id,
      listId: data.listId,
      title: data.title,
      desc: data.desc,
      timestamp: data.timestamp
    });
  }
}
