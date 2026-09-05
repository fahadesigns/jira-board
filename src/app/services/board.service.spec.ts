import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';
import { StorageService } from './storage.service';
import { Card } from '../models/card.model';

describe('BoardService & Domain Requirements', () => {
  let service: BoardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [BoardService, StorageService]
    });
    service = TestBed.inject(BoardService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with generic seed lists and cards', () => {
    const board = service.board();
    expect(board.lists.length).toBe(4);
    expect(board.lists[0].title).toBe('To Do');
    expect(board.lists[0].cards.length).toBe(2);
    expect(board.lists[0].cards[0].title).toBe('Add drag and drop');
    expect(board.lists[0].cards[1].title).toBe('Configure project structure');

    expect(board.lists[1].title).toBe('In Progress');
    expect(board.lists[1].cards[0].title).toBe('Implement board functionality');

    expect(board.lists[2].title).toBe('Review');
    expect(board.lists[2].cards[0].title).toBe('Review implementation');

    expect(board.lists[3].title).toBe('Done');
    expect(board.lists[3].cards[0].title).toBe('Create initial layout');
    expect(board.lists[3].cards[1].title).toBe('Set up project');
  });

  it('should add a new list', () => {
    service.addList('Backlog');
    const board = service.board();
    expect(board.lists.length).toBe(5);
    expect(board.lists[4].title).toBe('Backlog');
  });

  it('should delete a list and its contained cards', () => {
    const board = service.board();
    const todoListId = board.lists[0].id;
    service.deleteList(todoListId);

    const updated = service.board();
    expect(updated.lists.length).toBe(3);
    expect(updated.getList(todoListId)).toBeUndefined();
  });

  it('should add cards and allow duplicate card titles in the same list', () => {
    const board = service.board();
    const todoListId = board.lists[0].id;

    service.addCard(todoListId, 'Task Alpha', 'First desc');
    service.addCard(todoListId, 'Task Alpha', 'Second desc with same title');

    const updated = service.board();
    const todoList = updated.getList(todoListId)!;
    const alphaCards = todoList.cards.filter((c) => c.title === 'Task Alpha');

    expect(alphaCards.length).toBe(2);
    expect(alphaCards[0].id).not.toBe(alphaCards[1].id);
  });

  it('should move card, update listId, leave timestamp immutable, and sort target list reverse chronologically', () => {
    const board = service.board();
    const listA = board.lists[0];
    const listB = board.lists[1];
    const cardD = new Card({ listId: listB.id, title: 'Card D', timestamp: 13000 });
    const cardE = new Card({ listId: listB.id, title: 'Card E', timestamp: 9000 });
    listB.cards = [cardD, cardE];
    const cardA = new Card({ listId: listA.id, title: 'Card A', timestamp: 10000 });
    listA.cards = [cardA];
    service.moveCard(cardA.id, listA.id, listB.id);
    const updated = service.board();
    const updatedListA = updated.getList(listA.id)!;
    const updatedListB = updated.getList(listB.id)!;
    expect(updatedListA.cards.length).toBe(0);
    expect(updatedListB.cards.length).toBe(3);
    expect(updatedListB.cards[0].title).toBe('Card D');
    expect(updatedListB.cards[0].timestamp).toBe(13000);

    expect(updatedListB.cards[1].title).toBe('Card A');
    expect(updatedListB.cards[1].timestamp).toBe(10000);
    expect(updatedListB.cards[1].listId).toBe(listB.id);

    expect(updatedListB.cards[2].title).toBe('Card E');
    expect(updatedListB.cards[2].timestamp).toBe(9000);
  });
});
