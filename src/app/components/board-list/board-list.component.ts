import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardList } from '../../models/card-list.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent {
  @Input({ required: true }) list!: CardList;
  @Output() deleteList = new EventEmitter<string>();
  @Output() addCard = new EventEmitter<string>();
  @Output() deleteCard = new EventEmitter<{ listId: string; cardId: string }>();
  @Output() cardDrop = new EventEmitter<{ cardId: string; sourceListId: string; targetListId: string }>();

  dropping = false;

  dragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    this.dropping = true;
  }

  dragLeave(e: DragEvent): void {
    const currentTarget = e.currentTarget as HTMLElement | null;
    const relatedTarget = e.relatedTarget as Node | null;
    if (currentTarget && (!relatedTarget || !currentTarget.contains(relatedTarget))) {
      this.dropping = false;
    }
  }

  handleDrop(e: DragEvent): void {
    e.preventDefault();
    this.dropping = false;

    const raw = e.dataTransfer?.getData('application/json');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      if (data.cardId && data.sourceListId) {
        this.cardDrop.emit({
          cardId: data.cardId,
          sourceListId: data.sourceListId,
          targetListId: this.list.id
        });
      }
    } catch (err) {
      console.error('Failed to parse drag-and-drop payload:', err);
    }
  }

  onDeleteList(): void {
    const confirmed = window.confirm(`Delete list "${this.list.title}" and all its cards?`);
    if (confirmed) {
      this.deleteList.emit(this.list.id);
    }
  }

  onAddCard(): void {
    this.addCard.emit(this.list.id);
  }

  onDeleteCard(cardId: string): void {
    this.deleteCard.emit({ listId: this.list.id, cardId });
  }
}
