import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Formation,
  FormationCategory,
  FormationLevel,
} from '../../interfaces/formation';
import { FormationService } from '../../services/formation';

@Component({
  selector: 'app-formation-catalog',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './formation-catalog.html',
  styleUrl: './formation-catalog.scss',
})
export class FormationCatalogComponent implements OnInit {
  formations: Formation[] = [];

  search = '';
  selectedCategory: '' | FormationCategory = '';
  selectedLevel: '' | FormationLevel = '';

  loading = false;
  errorMessage = '';

  constructor(private readonly formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  get filteredFormations(): Formation[] {
    const searchQuery = this.search.trim().toLowerCase();

    return this.formations.filter(formation => {
      const matchesSearch =
        !searchQuery ||
        formation.title.toLowerCase().includes(searchQuery);

      const matchesCategory =
        !this.selectedCategory ||
        formation.category === this.selectedCategory;

      const matchesLevel =
        !this.selectedLevel ||
        formation.level === this.selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }

  loadFormations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationService.getFormations().subscribe({
      next: formations => {
        this.formations = formations;
        this.loading = false;
      },
      error: () => {
        this.formations = [];
        this.loading = false;
        this.errorMessage =
          'Erreur : impossible de charger les formations.';
      },
    });
  }
}