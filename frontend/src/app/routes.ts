import {Routes} from '@angular/router';
import {frontendPath} from './constants/frontendPath';
import {canActivateFn} from './auth/canActivateFn';
import {HomeComponent} from './page/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: frontendPath.HOME,
  },
  {
    path: frontendPath.HOME,
    pathMatch: 'full',
    canActivate: [canActivateFn],
    component: HomeComponent,
    // data: { role: [RoleEnum.admin, RoleEnum.user] } // example of passing role data
  },
];
