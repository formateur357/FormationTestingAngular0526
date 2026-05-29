import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  search = '';
  loading = false;
  errorMessage = '';

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get filteredUsers(): User[] {
    const query = this.search.trim().toLowerCase();

    if (!query) {
      return this.users;
    }

    return this.users.filter(user =>
      user.name.toLowerCase().includes(query),
    );
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.loading = false;
        this.errorMessage = 'Erreur : impossible de charger les utilisateurs.';
      },
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
      },
      error: () => {
        this.errorMessage = 'Erreur : impossible de supprimer cet utilisateur.';
      },
    });
  }
}
