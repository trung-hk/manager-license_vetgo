import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {Router} from "@angular/router";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {PackagePurchased} from "../../models/PackagePurchased";
import {format} from "date-fns";

@Component({
  selector: 'app-package-purchased',
  templateUrl: './package-purchased.component.html',
})
export class PackagePurchasedComponent implements OnInit, AfterViewInit, OnDestroy {
  listScript = [];
  loading: boolean = false;
  dataList: PackagePurchased[] = []

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,) {
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.package-purchased'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.package-purchased'), "active");
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    this.loading = true;
    this.api.getAll<ResponseDataGetAll<PackagePurchased>>(URL.API_PACKAGE_PURCHASED).subscribe((data) => {
      this.dataList = data.content.map(d => {
        const expiredDate = new Date(d.expiredDate!);
        d.expiredDate = format(expiredDate, 'yyyy/MM/dd');
        d.attributeObject = this.scriptFC.convertAttributeStringToObjectForPackagePurchased(d.attributes);
        d.quantityDateUsing = this.scriptFC.getDayDiff(new Date(), expiredDate);
        return d;
      });
      this.loading = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
  }

}
