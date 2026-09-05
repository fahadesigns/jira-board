import { Injectable } from '@angular/core';
import { Board } from '../models/board.model';
import { CardList } from '../models/card-list.model';
import { Card } from '../models/card.model';

const STORAGE_KEY = 'jira_board_state_v1';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storageKey = STORAGE_KEY;

  save(board: Board): void {
    if (!board) return;
    try {
      const serialized = JSON.stringify(board.toJSON());
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error('Failed to save board to localStorage:', error);
    }
  }

  load(): Board | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return Board.fromJSON(parsed);
    } catch (error) {
      console.error('Failed to load board from localStorage:', error);
      return null;
    }
  }

  seedBoard(): Board {
    const now = Date.now();
    const todoListId = crypto.randomUUID();
    const inprogressListId = crypto.randomUUID();
    const reviewListId = crypto.randomUUID();
    const doneListId = crypto.randomUUID();

    const todoCards = [
      new Card({
        id: crypto.randomUUID(),
        listId: todoListId,
        title: 'Add drag and drop',
        desc: 'Implement native drag events and drop target handling.',
        timestamp: now - 1800000
      }),
      new Card({
        id: crypto.randomUUID(),
        listId: todoListId,
        title: 'Configure project structure',
        desc: 'Organize models, services, and standalone components.',
        timestamp: now - 3600000
      })
    ];

    const inprogressCards = [
      new Card({
        id: crypto.randomUUID(),
        listId: inprogressListId,
        title: 'Implement board functionality',
        desc: 'Handle list management, card creation, and state updates.',
        timestamp: now - 1200000
      })
    ];

    const reviewCards = [
      new Card({
        id: crypto.randomUUID(),
        listId: reviewListId,
        title: 'Review implementation',
        desc: 'Verify requirements, edge cases, and code quality.',
        timestamp: now - 600000
      })
    ];

    const doneCards = [
      new Card({
        id: crypto.randomUUID(),
        listId: doneListId,
        title: 'Create initial layout',
        desc: 'Set up wireframe board layout and styling.',
        timestamp: now - 5400000
      }),
      new Card({
        id: crypto.randomUUID(),
        listId: doneListId,
        title: 'Set up project',
        desc: 'Configure TypeScript and project settings.',
        timestamp: now - 7200000
      })
    ];

    const todoList = new CardList({ id: todoListId, title: 'To Do', cards: todoCards });
    const inprogressList = new CardList({ id: inprogressListId, title: 'In Progress', cards: inprogressCards });
    const reviewList = new CardList({ id: reviewListId, title: 'Review', cards: reviewCards });
    const doneList = new CardList({ id: doneListId, title: 'Done', cards: doneCards });

    todoList.sortNewest();
    inprogressList.sortNewest();
    reviewList.sortNewest();
    doneList.sortNewest();

    return new Board({
      id: crypto.randomUUID(),
      title: 'Jira Board',
      lists: [todoList, inprogressList, reviewList, doneList]
    });
  }

  init(): Board {
    const existing = this.load();
    if (existing) {
      return existing;
    }
    const initialBoard = this.seedBoard();
    this.save(initialBoard);
    return initialBoard;
  }

  watch(callback: (board: Board) => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          const board = Board.fromJSON(parsed);
          if (board) {
            callback(board);
          }
        } catch (err) {
          console.error('Error handling storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}
