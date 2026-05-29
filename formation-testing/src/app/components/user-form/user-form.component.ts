import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserPayload, UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  user: CreateUserPayload = {
    name: '',
    email: '',
    role: 'user',
  };

  submitted = false;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.user.name || !this.user.email || !this.user.role) {
      return;
    }

    this.userService.createUser(this.user).subscribe({
      next: () => {
        void this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage = 'Erreur : impossible de créer l’utilisateur.';
      },
    });
  }
}
