import { CardList, CardListData } from './card-list.model';

export interface BoardData {
  id?: string;
  title?: string;
  lists?: CardList[];
}

export class Board {
  id: string;
  title: string;
  lists: CardList[];

  constructor(data: BoardData = {}) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || 'Jira Board';
    this.lists = data.lists || [];
  }

  addList(title: string): CardList {
    const newList = new CardList({ title });
    this.lists.push(newList);
    return newList;
  }

  dropList(listId: string): boolean {
    const index = this.lists.findIndex((list) => list.id === listId);
    if (index !== -1) {
      this.lists.splice(index, 1);
      return true;
    }
    return false;
  }

  getList(listId: string): CardList | undefined {
    return this.lists.find((list) => list.id === listId);
  }

  moveCard(cardId: string, sourceListId: string, targetListId: string): boolean {
    const sourceList = this.getList(sourceListId);
    const targetList = this.getList(targetListId);

    if (!sourceList || !targetList) {
      return false;
    }

    const card = sourceList.pullCard(cardId);
    if (!card) {
      return false;
    }

    card.listId = targetListId;
    targetList.addCard(card);
    targetList.sortNewest();
    return true;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      lists: this.lists.map((list) => list.toJSON())
    };
  }

  static fromJSON(data: Partial<BoardData> | null | undefined): Board | null {
    if (!data) return null;
    const lists = Array.isArray(data.lists)
      ? data.lists.map((listData) => CardList.fromJSON(listData as Partial<CardListData>)).filter((l: CardList | null): l is CardList => l !== null)
      : [];
    return new Board({
      id: data.id,
      title: data.title,
      lists
    });
  }
}
