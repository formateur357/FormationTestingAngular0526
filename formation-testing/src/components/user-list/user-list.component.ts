import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  error = '';

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.error = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
      },
      error: () => {
        this.error = 'Impossible de charger les utilisateurs';
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
      },
      error: () => {
        this.error = 'Impossible de supprimer l’utilisateur';
      }
    });
  }
}
