import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './components/search.component';
import { UserDetail } from './components/user-detail/user-detail';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchComponent, UserDetail],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('formation-testing');
}
