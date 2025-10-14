import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../api/auth.api';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  private authApi = inject(AuthApiService);
  email = signal('');
  message = signal('');
  error = signal('');
  fieldErrors = signal<Record<string, string>>({});

  submit() {
    this.message.set('');
    this.error.set('');
    this.fieldErrors.set({});
    const email = this.email().trim();
    if (!email) { this.error.set('Unesite email.'); return; }
    this.authApi.forgotPassword(email).subscribe({
      next: (res) => this.message.set(res.message || 'Ako se email nalazi u sistemu, poslat je link za reset lozinke.'),
      error: (e) => {
        // Security-wise, generic success is fine, but if details provided, show inline
        const details = getFieldErrors(e);
        if (details && Object.keys(details).length) this.fieldErrors.set(details);
        this.message.set('Ako se email nalazi u sistemu, poslat je link za reset lozinke.');
      },
    });
  }
}
