import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  @Input() message: string = ''; // The confirmation message to display
  @Input() showModal: boolean = false; // Flag to control modal visibility
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Close the modal and emit the user's response
  closeModal(confirmed: boolean) {
    this.confirm.emit(confirmed);
  }
}
