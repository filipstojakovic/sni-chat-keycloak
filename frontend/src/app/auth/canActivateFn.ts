import {AuthGuard} from './auth.guard';
import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';

export const canActivateFn: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
}
