import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getFieldErrors, getGeneralMessage } from '../../utils/api-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  username = signal('');
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  error = signal('');
  fieldErrors = signal<Record<string, string>>({});

  async register() {
    const username = this.username().trim();
    const email = this.email().trim();
    const password = this.password();
    if (!username || !email || !password) {
      this.error.set('Popunite obavezna polja: korisničko ime, email i lozinka.');
      return;
    }
    this.error.set('');
    this.fieldErrors.set({});
    const res = await this.auth.register({ username, email, password, firstName: this.firstName().trim() || undefined, lastName: this.lastName().trim() || undefined });
    if (res.ok) {
      this.router.navigateByUrl('/profil');
      return;
    }
    // Show backend error details if present
    if (res.error) {
      const details = getFieldErrors(res.error);
      this.fieldErrors.set(details);
      this.error.set(getGeneralMessage(res.error, 'Registracija nije uspela.'));
    } else {
      this.error.set('Registracija nije uspela.');
    }
  }
}
