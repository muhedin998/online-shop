import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export function roleGuard(roles: string[]): CanMatchFn {
  return () => {
    const router = inject(Router);
    const username = localStorage.getItem('auth.username');
    const storedRoles = JSON.parse(localStorage.getItem('auth.roles') || '[]');
    const allowed = roles.some(r => storedRoles.includes(r));
    if (allowed) return true;
    if (!username) {
      router.navigate(['/profil'], { queryParams: { redirect: 'admin' } });
      return false;
    }
    // Roles not present or insufficient; navigate home
    router.navigate(['/']);
    return false;
  };
}
