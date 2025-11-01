import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDtoModel } from '../../models/dtos/login-dto.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  username = signal('');
  password = signal('');
  permanent = signal(true);
  error = signal('');

  user = computed(() => this.auth.user());

  login() {
    this.error.set('');
    const credentials: LoginDtoModel = {
      username: this.username().trim(),
      password: this.password(),
      permanent: this.permanent()
    };
    if (!credentials.username || !credentials.password) {
      this.error.set('Unesite korisničko ime i lozinku.');
      return;
    }
    this.auth.login(credentials).subscribe({
      next: () => {
        const nav = this.router.parseUrl(this.router.url);
        const redirect = nav.queryParams['redirect'] as string | undefined;
        if (redirect) {
          this.router.navigateByUrl('/' + redirect.replace(/^\/+/, ''));
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Neispravni podaci. Pokušajte ponovo.';
        this.error.set(msg);
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
