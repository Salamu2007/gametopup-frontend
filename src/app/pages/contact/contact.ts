import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactModel {
  name?: string;
  contact?: string;
  subject?: string;
  message?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  model: ContactModel = {};
  sending = false;
  success = false;
  error = false;

  sendContact(): void {
    this.error = false;
    this.success = false;
    if (!this.model.name || !this.model.contact || !this.model.message) {
      this.error = true;
      return;
    }

    this.sending = true;
    // Fake send delay (replace with real API call)
    setTimeout(() => {
      this.sending = false;
      this.success = true;
      this.model = {};
    }, 900);
  }

  resetForm(): void {
    this.model = {};
    this.error = false;
    this.success = false;
  }
}
