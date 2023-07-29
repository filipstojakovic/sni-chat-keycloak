import {Component} from '@angular/core';
import {frontendPath} from '../../constants/frontendPath';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {

  protected readonly frontendPath = frontendPath;

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }

  getLoggedUserName() {
    return this.authService.getFullName();
  }
}
