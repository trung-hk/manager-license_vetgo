import {Component, OnInit} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";

@Component({
  selector: 'app-error-not-found',
  templateUrl: './error-not-found.component.html'
})
export class ErrorNotFoundComponent implements OnInit{
  cssList = ['assets/css/error.css']

  constructor(private loadScript: LazyLoadScriptService) {
  }

  ngOnInit(): void {
    this.loadScript.addListCss(this.cssList);
  }
}
