import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {RouteURL} from "../../Constants/route-url";
import {ScriptCommonService} from "../../services/script-common.service";
import {ApiCommonService} from "../../services/api-common.service";
import {User} from "../../models/User";
import {URL} from "../../Constants/api-urls";
import {ROLES} from "../../Constants/vg-constant";
import {DataService} from "../../services/data.service";
import {CallbackLoadDataServer} from "../../models/CallbackLoadDataServer";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    protected readonly RouteURL = RouteURL;
    protected readonly ROLES = ROLES;
    user!: User | null;
    callbackReloadData: CallbackLoadDataServer = {
        reloadData: (from?: string, to?: string, keyWork?: string) => {
            // Gọi phương thức từ class đã định nghĩa ở đây
            this.loadDataFromServer();
        }
    };
    constructor(private keycloak: KeycloakService,
                public scriptFC: ScriptCommonService,
                private api: ApiCommonService,
                private dataService: DataService) {
    }

    logout() {
        this.keycloak.logout().then();
    }

    ngOnInit(): void {
        this.loadDataFromServer();
        this.dataService.setReLoadDataFunc(this.callbackReloadData);
    }
    loadDataFromServer() {
        this.api.getById<User>(this.scriptFC.getUserIdLogin(), URL.API_USER).subscribe(data => {
            console.log(data)
            this.user = !this.scriptFC.validateResponseAPI(data.status) ? data : null;
        });
    }
}