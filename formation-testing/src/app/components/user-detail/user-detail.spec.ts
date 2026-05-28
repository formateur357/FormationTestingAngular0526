import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetail } from './user-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { throwError } from 'rxjs';

describe('UserDetail', () => {
  let component: UserDetail;
  let fixture: ComponentFixture<UserDetail>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockActivatedRoute = {
    snapshot: { params: { id: '1' } }
  };

  const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService',
      ['getUserById', 'deleteUser']
    );

    await TestBed.configureTestingModule({
      declarations: [UserDetail],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetail);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should load user with id 42 on init', () => {
    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUsers[0]);
  })

  it('should display username and email', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Alice');
    expect(compiled.textContent).toContain('alice@exemple.com');
    expect(compiled.textContent).toContain('admin');
  })

  it('should navigate to /users on delete', () => {
    component.deleteUser();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);

  })

  it('should show error if user not found', () => {
    userServiceSpy.getUserById.and.returnValue(
      throwError(() => {
        new Error("Not found");
      })
    )
  })
})