import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  user?: User;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(id).subscribe({
      next: user => {
        this.user = user;
      },
      error: () => {
        this.errorMessage = 'Utilisateur introuvable.';
      },
    });
  }

  deleteUser(): void {
    if (!this.user) {
      return;
    }

    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        void this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage = 'Erreur : impossible de supprimer cet utilisateur.';
      },
    });
  }
}
