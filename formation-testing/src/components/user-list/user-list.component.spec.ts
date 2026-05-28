import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let mockUserService: {
    getUsers: ReturnType<typeof vi.fn>;
    getUserById: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' }
  ];

  beforeEach(async () => {
    mockUserService = {
      getUsers: vi.fn(),
      getUserById: vi.fn(),
      deleteUser: vi.fn()
    };

    mockUserService.getUsers.mockReturnValue(of(mockUsers));
    mockUserService.deleteUser.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
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
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.users.length).toBe(2);
  });

  it('should display user names', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Alice');
    expect(compiled.textContent).toContain('Bob');
  });

  it('should render one list item per user', () => {
    const items = fixture.debugElement.queryAll(By.css('li'));

    expect(items.length).toBe(2);
  });

  it('should call deleteUser when delete button clicked', () => {
    const deleteButtons = fixture.debugElement.queryAll(By.css('button'));

    deleteButtons[0].triggerEventHandler('click', null);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should remove user from list after successful deletion', () => {
    component.deleteUser(1);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users).toEqual([
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' }
    ]);
  });

  it('should show error message on service failure', () => {
    mockUserService.getUsers.mockReturnValue(
      throwError(() => new Error('Service Error'))
    );

    component.loadUsers();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.error).toBe('Impossible de charger les utilisateurs');
    expect(compiled.textContent).toContain('Impossible de charger les utilisateurs');
  });

  it('should show error message when delete fails', () => {
    mockUserService.deleteUser.mockReturnValue(
      throwError(() => new Error('Delete Error'))
    );

    component.deleteUser(1);
    fixture.detectChanges();

    expect(component.error).toBe('Impossible de supprimer l’utilisateur');
  });
});
