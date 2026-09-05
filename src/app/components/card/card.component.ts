import { Component, Input, Output, EventEmitter, OnDestroy, signal } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnDestroy {
  @Input({ required: true }) card!: Card;
  @Output() deleteCard = new EventEmitter<string>();

  readonly dragging = signal(false);
  readonly copyMsg = signal('');
  readonly copyFailed = signal(false);
  private feedbackTimer: number | null = null;

  get isoDate(): string {
    return new Date(this.card.timestamp).toISOString();
  }

  onDragStart(e: DragEvent): void {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({
          cardId: this.card.id,
          sourceListId: this.card.listId
        })
      );
    }
    this.dragging.set(true);
  }

  onDragEnd(): void {
    this.dragging.set(false);
  }

  onDelete(e: MouseEvent): void {
    e.stopPropagation();
    this.deleteCard.emit(this.card.id);
  }

  share(): string {
    const parts: string[] = [`Title: ${this.card.title}`];
    if (this.card.desc?.trim()) {
      parts.push(`Description: ${this.card.desc.trim()}`);
    }
    parts.push(`Created: ${this.card.fmtDate()}`);
    return parts.join('\n');
  }

  async onShare(e: MouseEvent): Promise<void> {
    e.stopPropagation();
    const text = this.share();

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        this.fallback(text);
      }
      this.copyMsg.set('Copied to clipboard! You can now share it anywhere.');
      this.copyFailed.set(false);
    } catch {
      this.copyMsg.set('Failed to copy to clipboard.');
      this.copyFailed.set(true);
    }

    this.clearTimer();
    this.feedbackTimer = window.setTimeout(() => {
      this.copyMsg.set('');
    }, 3000);
  }

  private fallback(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('execCommand copy failed');
      }
    } finally {
      document.body.removeChild(textArea);
    }
  }

  private clearTimer(): void {
    if (this.feedbackTimer !== null) {
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
