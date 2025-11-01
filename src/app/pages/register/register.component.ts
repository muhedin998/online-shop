import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterDtoModel } from '../../models/dtos/user-register-dto.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  private fb = inject(FormBuilder);

  // Reactive form strongly typed to match UserRegisterDtoModel
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)]]
  });

  submitting = signal(false);
  submitAttempted = signal(false);
  error = signal('');

  controls = computed(() => this.form.controls);

  register() {
    this.submitAttempted.set(true);
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UserRegisterDtoModel = this.form.getRawValue();
    this.submitting.set(true);

    this.auth.register(payload).subscribe({
      next: () => {
          console.log("Uspesno registriran")
        this.submitting.set(false);
        this.router.navigateByUrl('/profil');
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.message || 'Registracija nije uspjela. Pokušajte ponovo.';
        this.error.set(msg);
      }
    });
  }
}
