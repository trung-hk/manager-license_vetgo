import {Component, OnInit, Renderer2} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

interface DataKeycloak{
    preferred_username: string
}
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit{
    username?: string;
    constructor(private readonly keycloak: KeycloakService) {
    }

    logout() {
        this.keycloak.logout().then();
    }

    ngOnInit(): void {
        this.username = (this.keycloak.getKeycloakInstance().tokenParsed as DataKeycloak).preferred_username;
    }
}
