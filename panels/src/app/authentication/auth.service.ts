import {inject, Injectable} from '@angular/core';
import {KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {from, Observable} from 'rxjs';

export interface AuthConfig {
  redirectUrlLogin: string;
  redirectUrlLogout: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keycloak = inject(KeycloakService);

  constructor() {
    this.keycloak.keycloakEvents$.subscribe(
      (event) => {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          console.log('token -> expired');
           this.keycloak.updateToken(1800).then();
          console.log('refresh token');
        }
      }
    );
    this.keycloak.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        this.keycloak.getKeycloakInstance().loadUserProfile().then( it => {
          console.log(it);
        });
      }
    });
  }

  public logout(): void {
    this.keycloak.logout(window.location.origin).then();
  }

  login() {
    this.keycloak.login({redirectUri: window.location.origin + "/dashboard"}).then();
  }


  isLoggedIn(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  getUsername(): string {
    return this.keycloak.getKeycloakInstance()?.profile?.username as string;
  }

  getId(): string {
    return this.keycloak?.getKeycloakInstance()?.profile?.id as string;
  }

  getTokenExpirationDate(): number {
    return (this.keycloak.getKeycloakInstance().refreshTokenParsed as { exp: number })['exp'] as number;
  }

  refresh(): Observable<any> {
    return from(this.keycloak.getKeycloakInstance().updateToken(1800));
  }

  isExpired(): boolean {
    return this.keycloak.getKeycloakInstance().isTokenExpired();
  }
}
