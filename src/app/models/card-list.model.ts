import { Card, CardData } from './card.model';

export interface CardListData {
  id?: string;
  title: string;
  cards?: Card[];
}

export class CardList {
  id: string;
  title: string;
  cards: Card[];

  constructor(data: CardListData) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title;
    this.cards = data.cards || [];
  }

  addCard(card: Card): void {
    card.listId = this.id;
    this.cards.push(card);
  }

  pullCard(cardId: string): Card | null {
    const index = this.cards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      return this.cards.splice(index, 1)[0];
    }
    return null;
  }

  getCard(cardId: string): Card | undefined {
    return this.cards.find((c) => c.id === cardId);
  }

  sortNewest(): void {
    this.cards.sort((a, b) => b.timestamp - a.timestamp);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      cards: this.cards.map((c) => c.toJSON())
    };
  }

  static fromJSON(data: Partial<CardListData> | null | undefined): CardList | null {
    if (!data || !data.title) return null;
    const cards = Array.isArray(data.cards)
      ? data.cards.map((cardData) => Card.fromJSON(cardData as Partial<CardData>)).filter((c: Card | null): c is Card => c !== null)
      : [];
    return new CardList({
      id: data.id,
      title: data.title,
      cards
    });
  }
}
