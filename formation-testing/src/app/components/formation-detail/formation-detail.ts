import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Formation } from '../../interfaces/formation';
import { FormationService } from '../../services/formation';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './formation-detail.html',
})
export class FormationDetailComponent implements OnInit {
  formation?: Formation;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formationService: FormationService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.formationService.getFormationById(id).subscribe({
      next: formation => {
        this.formation = formation;
      },
      error: () => {
        this.errorMessage = 'Formation introuvable.';
      },
    });
  }
}