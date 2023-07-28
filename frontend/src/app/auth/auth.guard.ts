import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {

  /**
   *  https://www.npmjs.com/package/keycloak-angular#authguard
   */
  constructor(
    protected override readonly router: Router,
    private readonly keycloak: KeycloakService) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {

    let authenticated = this.keycloak.getKeycloakInstance().authenticated;
    if (!authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    if (this.keycloak.isTokenExpired()) { // TODO: delete me
      console.error("auth.guard.ts > isAccessAllowed(): " + "TOKEN EXPIRED");
    }

    const requiredRoles = route.data['role']; // data send through Route in RouterModule, =>  data: { role: [RoleEnum.admin, RoleEnum.user] }

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }

}
