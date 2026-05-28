# 📝 Exercices Jour 1 — Karma & Jasmine

> **Prérequis** : Node.js 18+, Angular CLI 17+, Chrome installé
> **Référencés dans** : `jour1.md` slides 22, 38, 54, 70

---

## 🔧 Exercice 1 — Installation et Premier Run Karma

### Contexte
Vous allez créer votre premier projet Angular avec Karma et explorer la structure générée.

### Étapes

**1.1 Créer le projet**
```bash
ng new formation-tests --routing --style=scss --skip-git
cd formation-tests
```

**1.2 Explorer la structure des tests**
```bash
# Observer les fichiers générés
ls src/app/*.spec.ts
cat karma.conf.js
cat src/test.ts
```

**1.3 Lancer les tests**
```bash
ng test
```
> Observez le navigateur Chrome s'ouvrir automatiquement. Notez le port utilisé (9876 par défaut).

**1.4 Observer le rapport**

Quand Karma démarre :
- Ouvrez `http://localhost:9876` dans un second onglet
- Explorez l'onglet **DEBUG** pour voir les tests individuels

**1.5 Générer un rapport de couverture**
```bash
ng test --code-coverage --watch=false
```

Ouvrez ensuite `coverage/formation-tests/index.html` dans un navigateur.

### Questions de réflexion
1. Combien de tests sont générés par défaut ? Où sont-ils ?
2. Quel est le pourcentage de couverture initial ?
3. Que se passe-t-il si vous modifiez `app.component.ts` et sauvegardez ?

### Critères de validation
- [ ] `ng test` lance sans erreur
- [ ] Chrome s'ouvre avec l'interface Karma
- [ ] Le rapport de couverture HTML est accessible

---

## 🔧 Exercice 2 — Matchers Jasmine : CalculatorService

### Contexte
Créer un service de calculatrice et écrire des tests exhaustifs avec les différents matchers Jasmine.

### 2.1 Créer le service

```bash
ng generate service services/calculator
```

Implémentez `calculator.service.ts` :

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) throw new Error('Division par zéro impossible');
    return a / b;
  }

  average(numbers: number[]): number {
    if (numbers.length === 0) throw new Error('Tableau vide');
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
}
```

### 2.2 Écrire les tests

Complétez `calculator.service.spec.ts` :

```typescript
import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // EXERCICE : Compléter les tests suivants

  describe('add()', () => {
    it('should add two positive numbers', () => {
      // TODO : tester 2 + 3 = 5 avec toBe
    });

    it('should add negative numbers', () => {
      // TODO : tester -2 + -3 = -5
    });

    it('should return a number', () => {
      // TODO : vérifier le type avec toBeInstanceOf ou typeof
    });
  });

  describe('divide()', () => {
    it('should divide correctly', () => {
      // TODO : 10 / 2 = 5
    });

    it('should handle decimal results', () => {
      // TODO : 1 / 3 ≈ 0.333... avec toBeCloseTo
    });

    it('should throw when dividing by zero', () => {
      // TODO : utiliser toThrowError
    });
  });

  describe('average()', () => {
    it('should calculate average of numbers', () => {
      // TODO : [1, 2, 3, 4, 5] → 3
    });

    it('should throw on empty array', () => {
      // TODO : toThrowError('Tableau vide')
    });
  });

  describe('isPrime()', () => {
    it('should return true for prime numbers', () => {
      // TODO : tester 2, 3, 5, 7, 11, 13
    });

    it('should return false for non-prime numbers', () => {
      // TODO : tester 0, 1, 4, 6, 8, 9
    });
  });
});
```

### 2.3 Bonus — Custom Matcher

Ajoutez un custom matcher `toBePositive` :

```typescript
// Dans beforeEach ou beforeAll
jasmine.addMatchers({
  toBePositive: () => ({
    compare: (actual: number) => ({
      pass: actual > 0,
      message: `Expected ${actual} to be a positive number`
    })
  })
});

// Utilisation
expect(service.add(1, 2)).toBePositive();
```

### Critères de validation
- [ ] Tous les tests `add()` passent
- [ ] `toThrowError` fonctionne pour la division par zéro
- [ ] `toBeCloseTo` est utilisé pour les décimales
- [ ] Le custom matcher est défini et utilisé
- [ ] Couverture du service ≥ 90%

---

## 🔧 Exercice 3 — Spies & Mocking : UserService

### Contexte
Tester un composant qui dépend d'un service HTTP, en mockant complètement les dépendances.

### 3.1 Créer les types et le service

```bash
ng generate interface interfaces/user
ng generate service services/user
ng generate component components/user-list
```

**`user.ts`** :
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}
```

**`user.service.ts`** :
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### 3.2 Tester le service avec HttpClientTestingModule

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController }
  from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // vérifie pas de requêtes non traitées
  });

  describe('getUsers()', () => {
    it('should fetch all users', () => {
      // TODO :
      // 1. S'abonner à service.getUsers()
      // 2. Intercepter la requête GET /api/users
      // 3. Vérifier la méthode HTTP
      // 4. Simuler la réponse avec req.flush(mockUsers)
      // 5. Vérifier les données reçues
    });

    it('should handle server error', () => {
      // TODO :
      // 1. S'abonner en gérant l'erreur
      // 2. Simuler une erreur 500 avec req.error()
      // 3. Vérifier que l'erreur est bien remontée
    });
  });

  describe('getUserById()', () => {
    it('should fetch a specific user', () => {
      // TODO : tester GET /api/users/1
    });

    it('should handle 404 not found', () => {
      // TODO : simuler un 404
    });
  });

  describe('deleteUser()', () => {
    it('should send DELETE request', () => {
      // TODO : vérifier DELETE /api/users/1
    });
  });
});
```

### 3.3 Tester le composant avec un service mocké

```typescript
// user-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' as const }
  ];

  beforeEach(async () => {
    // Créer le SpyObj avec toutes les méthodes nécessaires
    mockUserService = jasmine.createSpyObj('UserService',
      ['getUsers', 'deleteUser']
    );

    // Configurer les valeurs de retour par défaut
    mockUserService.getUsers.and.returnValue(of(mockUsers));
    mockUserService.deleteUser.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    // TODO : vérifier que getUsers a été appelé
    // et que component.users contient les données
  });

  it('should display user names', () => {
    // TODO : vérifier le rendu HTML avec fixture.debugElement
  });

  it('should call deleteUser when delete button clicked', () => {
    // TODO : déclencher le clic, vérifier l'appel au service
  });

  it('should show error message on service failure', () => {
    // TODO : configurer le spy pour retourner une erreur
    // et vérifier que le message d'erreur s'affiche
    mockUserService.getUsers.and.returnValue(
      throwError(() => new Error('Service Error'))
    );
    // ...
  });
});
```

### Critères de validation
- [ ] Les tests HTTP utilisent `HttpTestingController`
- [ ] `afterEach(() => httpMock.verify())` est présent
- [ ] Le composant utilise `jasmine.createSpyObj`
- [ ] Les erreurs service sont testées
- [ ] `toHaveBeenCalledWith` est utilisé pour vérifier les arguments

---

## 🔧 Exercice 4 — Async, fakeAsync & Horloge

### Contexte
Tester du code asynchrone : debounce, animations, appels HTTP différés.

### 4.1 Créer un composant de recherche avec debounce

```typescript
// search.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl" placeholder="Rechercher...">
    <div *ngIf="loading">Chargement...</div>
    <ul>
      <li *ngFor="let user of results">{{ user.name }}</li>
    </ul>
    <div *ngIf="error" class="error">{{ error }}</div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  results: User[] = [];
  loading = false;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(query => {
      this.search(query ?? '');
    });
  }

  search(query: string) {
    this.loading = true;
    this.error = '';
    // Simuler un appel avec délai
    setTimeout(() => {
      this.loading = false;
      this.results = [{ id: 1, name: query, email: '', role: 'user' }];
    }, 500);
  }
}
```

### 4.2 Tester avec fakeAsync

```typescript
// search.component.spec.ts
import {
  ComponentFixture, TestBed,
  fakeAsync, tick, flush
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { UserService } from '../../services/user.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    const mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not search immediately on input', fakeAsync(() => {
    // TODO :
    // 1. Changer la valeur du formulaire
    // 2. Avancer de moins de 300ms avec tick(299)
    // 3. Vérifier que loading est toujours false
  }));

  it('should search after 300ms debounce', fakeAsync(() => {
    // TODO :
    // 1. Changer la valeur du formulaire
    // 2. tick(300) pour passer le debounce
    // 3. tick(500) pour passer le setTimeout de search()
    // 4. fixture.detectChanges()
    // 5. Vérifier que results est rempli
  }));

  it('should show loading state during search', fakeAsync(() => {
    // TODO :
    // 1. Déclencher la recherche (tick 300ms)
    // 2. Vérifier loading = true
    // 3. tick(500) → vérifier loading = false
  }));
});
```

### 4.3 Tester avec jasmine.clock()

```typescript
describe('jasmine.clock() demo', () => {
  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  it('should use mocked date', () => {
    // TODO :
    // 1. Mocker la date : new Date('2025-01-15T10:00:00')
    // 2. Vérifier que new Date().getFullYear() === 2025
  });

  it('should trigger setTimeout immediately', () => {
    let called = false;
    setTimeout(() => { called = true; }, 2000);

    // TODO : avancer le temps et vérifier
    jasmine.clock().tick(/* ? */);
    expect(called).toBeTrue();
  });
});
```

### 4.4 expectAsync — Tests de Promises

```typescript
describe('Promise-based tests', () => {
  it('should resolve with data', async () => {
    const promise = Promise.resolve({ id: 1, name: 'Alice' });
    // TODO : utiliser expectAsync et toBeResolvedTo
  });

  it('should reject with error', async () => {
    const promise = Promise.reject(new Error('Not found'));
    // TODO : utiliser expectAsync et toBeRejectedWithError
  });
});
```

### Critères de validation
- [ ] `fakeAsync` + `tick` utilisés pour le debounce
- [ ] `jasmine.clock().install()` et `uninstall()` corrects
- [ ] Les tests de loading state passent
- [ ] `expectAsync` utilisé pour les Promises
- [ ] Aucun test ne dure plus de 100ms en réalité

---

## 🔧 Exercice Bonus — TestBed Avancé

### Contexte
Tester un composant Angular avec routing, animations et des services complexes.

### Objectif

Créer un test complet pour un composant `UserDetailComponent` qui :
- Récupère l'`id` depuis les paramètres de route (`ActivatedRoute`)
- Charge l'utilisateur via `UserService.getUserById(id)`
- Affiche les détails ou un message d'erreur
- Permet de supprimer et naviguer vers la liste (`Router`)

### Structure à implémenter

```typescript
// user-detail.component.spec.ts

describe('UserDetailComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockActivatedRoute = {
    snapshot: { params: { id: '42' } }
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService',
      ['getUserById', 'deleteUser']
    );

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
  });

  // TODO : écrire les tests
  // - should load user with id 42 on init
  // - should display user name and email
  // - should navigate to /users on delete
  // - should show error if user not found
});
```

### Critères de validation
- [ ] `ActivatedRoute` correctement mocké
- [ ] `Router` mocké avec spy sur `navigate`
- [ ] Test de navigation après suppression
- [ ] Cas d'erreur (404) testé

---

## 📋 Récapitulatif des commandes utiles

```bash
# Lancer les tests en watch mode
ng test

# Tests en single run (pour CI)
ng test --watch=false

# Avec couverture
ng test --code-coverage

# ChromeHeadless (pour CI/CD)
ng test --browsers=ChromeHeadless --watch=false

# Générer un composant de test
ng generate component components/nom --skip-tests=false
```

## 📖 Ressources

- [Jasmine 5.x Documentation](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [HttpClientTestingModule](https://angular.dev/api/common/http/testing/HttpClientTestingModule)
- [fakeAsync & tick](https://angular.dev/api/core/testing/fakeAsync)
