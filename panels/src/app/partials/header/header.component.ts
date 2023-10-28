import {Component, OnInit, Renderer2} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    constructor(private readonly keycloak: KeycloakService) {
    }

    logout() {
        this.keycloak.logout().then();
    }
}
