import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('listForm') listForm?: NgForm;
  @Output() submitList = new EventEmitter<string>();

  listTitle = '';
  errorMessage = '';

  open(): void {
    this.reset();
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
    this.listForm?.reset();
    this.listTitle = '';
  }

  submit(): void {
    const trimmed = this.listTitle.trim();
    if (!trimmed) {
      this.errorMessage = 'List title is required.';
      return;
    }
    this.submitList.emit(trimmed);
    this.close();
  }
}
