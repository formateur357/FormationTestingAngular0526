import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationCatalog } from './formation-catalog';

describe('FormationCatalog', () => {
  let component: FormationCatalog;
  let fixture: ComponentFixture<FormationCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(FormationCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
