import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { FormationCatalogComponent } from './components/formation-catalog/formation-catalog';
import { FormationDetailComponent } from './components/formation-detail/formation-detail';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Formation Tests Angular',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
  },
  {
    path: 'formations',
    component: FormationCatalogComponent,
    title: 'Catalogue des formations',
  },
  {
    path: 'formations/:id',
    component: FormationDetailComponent,
    title: 'Détail formation',
  },
  {
    path: 'users',
    component: UserListComponent,
    title: 'Utilisateurs',
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    title: 'Créer un utilisateur',
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    title: 'Détail utilisateur',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
