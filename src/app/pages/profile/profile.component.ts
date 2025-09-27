import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  email = signal('');
  password = signal('');
  error = signal('');

  user = computed(() => this.auth.user());

  login() {
    const ok = this.auth.login(this.email().trim(), this.password());
    if (!ok) {
      this.error.set('Neispravni podaci. Pokušajte ponovo.');
      return;
    }
    const nav = this.router.parseUrl(this.router.url);
    const redirect = nav.queryParams['redirect'] as string | undefined;
    if (redirect) {
      this.router.navigateByUrl('/' + redirect.replace(/^\/+/, ''));
    }
  }

  logout() {
    this.auth.logout();
  }
}
