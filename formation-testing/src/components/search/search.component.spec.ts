import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick
} from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search immediately on input', fakeAsync(() => {
    component.searchControl.setValue('Alice');

    tick(299);

    expect(component.loading).toBe(false);
    expect(component.results.length).toBe(0);

    flush();
  }));

  it('should search after 300ms debounce', fakeAsync(() => {
    component.searchControl.setValue('Alice');

    tick(300);

    expect(component.loading).toBe(true);
    expect(component.results.length).toBe(0);

    tick(500);

    expect(component.loading).toBe(false);
    expect(component.results.length).toBe(1);
    expect(component.results[0].name).toBe('Alice');
  }));

  it('should show loading state during search', fakeAsync(() => {
    component.searchControl.setValue('Bob');

    tick(300);

    expect(component.loading).toBe(true);

    tick(500);

    expect(component.loading).toBe(false);
  }));

  it('should update the DOM after search completes', fakeAsync(() => {
    component.searchControl.setValue('Alice');

    tick(300);
    tick(500);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Alice');
    expect(compiled.textContent).not.toContain('Chargement...');
  }));
});
