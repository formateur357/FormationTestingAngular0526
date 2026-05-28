import { Routes } from '@angular/router';

import { SearchComponent } from './components/search/search.component';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: 'users' }
];
