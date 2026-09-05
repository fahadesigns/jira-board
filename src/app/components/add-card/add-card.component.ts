import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('cardForm') cardForm?: NgForm;
  @Output() submitCard = new EventEmitter<{ listId: string; title: string; desc: string }>();

  targetListId: string | null = null;
  cardTitle = '';
  cardDesc = '';
  errorMessage = '';

  open(listId: string): void {
    this.reset();
    this.targetListId = listId;
    if (typeof this.dialogRef?.nativeElement?.showModal === 'function') {
      this.dialogRef.nativeElement.showModal();
    }
  }

  close(): void {
    this.reset();
    if (typeof this.dialogRef?.nativeElement?.close === 'function') {
      this.dialogRef.nativeElement.close();
    }
  }

  reset(): void {
    this.errorMessage = '';
    this.targetListId = null;
    this.cardForm?.reset();
    this.cardTitle = '';
    this.cardDesc = '';
  }

  submit(): void {
    if (!this.targetListId) return;

    const trimmed = this.cardTitle.trim();
    if (!trimmed) {
      this.errorMessage = 'Card title is required.';
      return;
    }

    const payload = {
      listId: this.targetListId,
      title: trimmed,
      desc: this.cardDesc.trim()
    };

    this.submitCard.emit(payload);
    this.close();
  }
}
