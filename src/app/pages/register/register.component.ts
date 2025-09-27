import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  name = signal('');
  email = signal('');
  password = signal('');
  phone = signal('');
  error = signal('');

  register() {
    const name = this.name().trim();
    const email = this.email().trim();
    const password = this.password();
    if (!name || !email || !password) {
      this.error.set('Popunite sva obavezna polja.');
      return;
    }
    this.auth.register({ name, email, password, phone: this.phone().trim() || undefined });
    this.router.navigateByUrl('/profil');
  }
}
