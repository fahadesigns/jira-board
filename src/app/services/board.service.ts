import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Board } from '../models/board.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly storageService = inject(StorageService);
  private readonly _board = signal<Board>(this.storageService.init());
  readonly board = this._board.asReadonly();

  constructor() {
    this.storageService.watch((updatedBoard) => {
      this._board.set(updatedBoard);
    });
  }

  addList(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const current = this._board();
    current.addList(trimmed);
    this.save(current);
  }

  deleteList(listId: string): void {
    const current = this._board();
    const removed = current.dropList(listId);
    if (removed) {
      this.save(current);
    }
  }

  addCard(listId: string, title: string, desc: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const current = this._board();
    const list = current.getList(listId);
    if (!list) return;

    const card = new Card({
      listId,
      title: trimmedTitle,
      desc: desc.trim(),
      timestamp: Date.now()
    });

    list.addCard(card);
    list.sortNewest();
    this.save(current);
  }

  deleteCard(listId: string, cardId: string): void {
    const current = this._board();
    const list = current.getList(listId);
    if (list) {
      list.pullCard(cardId);
      this.save(current);
    }
  }

  moveCard(cardId: string, sourceListId: string, targetListId: string): void {
    const current = this._board();
    const moved = current.moveCard(cardId, sourceListId, targetListId);
    if (moved) {
      this.save(current);
    }
  }

  private save(board: Board): void {
    this.storageService.save(board);
    const fresh = Board.fromJSON(board.toJSON());
    if (fresh) {
      this._board.set(fresh);
    }
  }
}
