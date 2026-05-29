import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';

  submitted = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.email || !this.password) {
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
      },
      error: error => {
        if (error.status === 401) {
          this.errorMessage =
            error.error?.message ?? 'Identifiants incorrects';
          return;
        }

        this.errorMessage =
          'Erreur serveur. Veuillez réessayer plus tard.';
      },
    });
  }
}
