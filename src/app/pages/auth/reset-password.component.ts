import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthApiService } from '../../api/auth.api';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private authApi = inject(AuthApiService);

  token = signal('');
  password = signal('');
  message = signal('');
  error = signal('');
  fieldErrors = signal<Record<string, string>>({});

  constructor() {
    const t = this.route.snapshot.queryParamMap.get('token') || '';
    this.token.set(t);
  }

  submit() {
    this.message.set('');
    this.error.set('');
    this.fieldErrors.set({});
    const token = this.token().trim();
    const pw = this.password();
    if (!token || !pw) { this.error.set('Nedostaju podaci.'); return; }
    this.authApi.resetPassword(token, pw).subscribe({
      next: (res) => this.message.set(res.message || 'Lozinka promenjena. Možete se prijaviti.'),
      error: (e) => {
        const details = getFieldErrors(e);
        if (details && Object.keys(details).length) this.fieldErrors.set(details);
        this.error.set(getGeneralMessage(e, 'Greška pri promeni lozinke.'));
      },
    });
  }
}
