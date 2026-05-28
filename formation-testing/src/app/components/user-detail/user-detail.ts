import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit {
  user: User | null = null;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    this.userService.getUserById(id).subscribe({
      next: user => {
        this.user = user;
      },
      error: () => {
        this.error = 'Utilisateur introuvable'
      }
    })
  }

  deleteUser(): void {
    if (!this.user) {
      return;
    }

    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: () => {
        this.error = "Impossible de supprimer l'utilisateur";
      }
    })
  }
}
