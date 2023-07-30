import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment.development';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: `http://localhost:${environment.authServerPort}`,
        realm: environment.realm,
        clientId: environment.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
      },
    });
}
