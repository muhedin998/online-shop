import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getGeneralMessage } from '../../utils/api-error';

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
  error = signal('');

  user = computed(() => this.auth.user());

  async login() {
    const res = await this.auth.loginBackend(this.username().trim(), this.password());
    if (!res.ok) {
      this.error.set(getGeneralMessage(res.error, 'Neispravni podaci. Pokušajte ponovo.'));
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
