import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {URL} from "../../Constants/api-urls";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {Item} from "../../models/Item";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-package-renewal',
  templateUrl: './package-renewal.component.html',
})
export class PackageRenewalComponent implements OnInit, AfterViewInit, OnDestroy {
  listScript = [];
  loading: boolean = false;
  data: Item = {};
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private route: ActivatedRoute,) {
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.package-purchased'), "active");
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.init();
  }
  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    this.api.getById<Item>(this.route.snapshot.paramMap.get('id'), URL.API_ORDER_SERVICE).subscribe((data) => {
      console.log(data)
      this.data = data;
      this.data.packages = this.scriptFC.getPackageService(this.data.attributes);
      this.loading = false;
    })
  }

}
