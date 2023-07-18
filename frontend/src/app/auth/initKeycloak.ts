import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment.development';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
      keycloak.init({
        config: {
          url: environment.authServer,
          realm: environment.realm,
          clientId: environment.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
        },
      });
}
