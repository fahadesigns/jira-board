import { Component, ViewChild, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { BoardListComponent } from '../board-list/board-list.component';
import { AddListComponent } from '../add-list/add-list.component';
import { AddCardComponent } from '../add-card/add-card.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [BoardListComponent, AddListComponent, AddCardComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  protected readonly boardService = inject(BoardService);
  protected readonly board = this.boardService.board;

  @ViewChild(AddListComponent) addListDialog!: AddListComponent;
  @ViewChild(AddCardComponent) addCardDialog!: AddCardComponent;

  openListForm(): void {
    this.addListDialog.open();
  }

  openCardForm(listId: string): void {
    this.addCardDialog.open(listId);
  }

  handleNewList(title: string): void {
    this.boardService.addList(title);
  }

  handleNewCard(payload: { listId: string; title: string; desc: string }): void {
    this.boardService.addCard(payload.listId, payload.title, payload.desc);
  }

  onDeleteList(listId: string): void {
    this.boardService.deleteList(listId);
  }

  onDeleteCard(payload: { listId: string; cardId: string }): void {
    this.boardService.deleteCard(payload.listId, payload.cardId);
  }

  handleDrop(payload: { cardId: string; sourceListId: string; targetListId: string }): void {
    this.boardService.moveCard(payload.cardId, payload.sourceListId, payload.targetListId);
  }
}
