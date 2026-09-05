import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { Card } from '../../models/card.model';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let testCard: Card;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    testCard = new Card({
      id: 'card-123',
      listId: 'list-456',
      title: 'Test Share Card',
      desc: 'Card details for sharing',
      timestamp: 1672531199000
    });

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.card = testCard;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render card title, desc, formatted date, and share button', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-title')?.textContent).toContain('Test Share Card');
    expect(el.querySelector('.card-desc')?.textContent).toContain('Card details for sharing');
    expect(el.querySelector('.btn-share')).toBeTruthy();
    expect(el.querySelector('.share-label')?.textContent).toBe('share');
    expect(el.querySelector('.card-meta')?.textContent).toContain(testCard.fmtDate());
  });

  it('should construct properly formatted share text', () => {
    const text = component.share();
    expect(text).toContain('Title: Test Share Card');
    expect(text).toContain('Description: Card details for sharing');
    expect(text).toContain(`Created: ${testCard.fmtDate()}`);
  });

  it('should omit description in share text if desc is empty', () => {
    component.card = new Card({
      id: 'card-no-desc',
      listId: 'list-456',
      title: 'Title Only',
      timestamp: 1672531199000
    });
    fixture.detectChanges();

    const text = component.share();
    expect(text).toContain('Title: Title Only');
    expect(text).not.toContain('Description:');
    expect(text).toContain(`Created: ${component.card.fmtDate()}`);
  });

  it('should copy card text to clipboard and display success feedback', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy
      }
    });

    const event = new MouseEvent('click');
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

    await component.onShare(event);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(writeTextSpy).toHaveBeenCalledWith(component.share());
    expect(component.copyMsg()).toBe('Copied to clipboard! You can now share it anywhere.');
    expect(component.copyFailed()).toBe(false);

    const el: HTMLElement = fixture.nativeElement;
    const feedbackEl = el.querySelector('.copy-toast');
    expect(feedbackEl).not.toBeNull();
    expect(feedbackEl?.textContent?.trim()).toContain('Copied to clipboard! You can now share it anywhere.');
  });

  it('should display error message if copying fails', async () => {
    const writeTextSpy = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy
      }
    });

    const event = new MouseEvent('click');
    await component.onShare(event);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.copyMsg()).toBe('Failed to copy to clipboard.');
    expect(component.copyFailed()).toBe(true);

    const el: HTMLElement = fixture.nativeElement;
    const feedbackEl = el.querySelector('.copy-toast.toast-error');
    expect(feedbackEl).not.toBeNull();
    expect(feedbackEl?.textContent?.trim()).toContain('Failed to copy to clipboard.');
  });

  it('should emit deleteCard event when delete button is clicked', () => {
    let deletedId: string | null = null;
    component.deleteCard.subscribe((id) => {
      deletedId = id;
    });

    const deleteBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.del-btn');
    deleteBtn.click();

    expect(deletedId).toBe('card-123');
  });
});
