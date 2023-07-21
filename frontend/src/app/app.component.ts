import {Component} from '@angular/core';
import {frontendPath} from './constants/frontendPath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  protected readonly frontendPath = frontendPath;
}
