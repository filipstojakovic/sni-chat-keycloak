import {Routes} from '@angular/router';
import {frontendPath} from './constants/frontendPath';
import {canActivateFn} from './auth/canActivateFn';
import {HomeComponent} from './page/home/home.component';
import {ChatRoomComponent} from './page/chat-room/chat-room.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: frontendPath.CHAT_ROOM,
  },
  {
    path: frontendPath.HOME,
    pathMatch: 'full',
    canActivate: [canActivateFn],
    component: HomeComponent,
    // data: { role: [RoleEnum.admin, RoleEnum.user] } // example of passing role data
  },
  {
    path: frontendPath.CHAT_ROOM,
    pathMatch: 'full',
    canActivate: [canActivateFn],
    component: ChatRoomComponent,
  },
];
