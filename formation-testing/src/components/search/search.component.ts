import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { User } from '../../interfaces/user';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="Rechercher...">

    <div *ngIf="loading">
      Chargement...
    </div>

    <ul>
      <li *ngFor="let user of results">
        {{ user.name }}
      </li>
    </ul>

    <div *ngIf="error" class="error">
      {{ error }}
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  results: User[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.search(query ?? '');
    });
  }

  search(query: string): void {
    this.loading = true;
    this.error = '';

    setTimeout(() => {
      this.loading = false;
      this.results = [
        {
          id: 1,
          name: query,
          email: '',
          role: 'user'
        }
      ];
    }, 500);
  }
}
