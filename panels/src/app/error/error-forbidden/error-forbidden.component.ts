import {Component, OnInit} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";

@Component({
    selector: 'app-error-forbidden',
    templateUrl: './error-forbidden.component.html'
})
export class ErrorForbiddenComponent implements OnInit {
    cssList = ['assets/css/error.css']

    constructor(private loadScript: LazyLoadScriptService) {
    }

    ngOnInit(): void {
        this.loadScript.addListCss(this.cssList);
    }
}
