import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {UntypedFormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {OrderService} from "../../models/OrderService";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {AgentProduct} from "../../models/AgentProduct";
import {Item} from "../../models/Item";
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
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder,
              private viewContainerRef: ViewContainerRef,
              private elRef: ElementRef,
              private router: Router,) {
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
    // let loading_success_1 = false;
    // let loading_success_2 = false;
    // const objectSelectOrderService: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<PackagePurchased>>(URL.API_PACKAGE_PURCHASED).subscribe((data) => {
      data.content = [
        {
          id: "1",
          customerId: "1",
          itemId: "1",
          attributes: "{\"itemName\": \"vet go app\"}",
          expiredDate: "2023-12-03T16:02:17.574Z"

        },
        {
          id: "2",
          customerId: "1",
          itemId: "2",
          attributes: "{\"itemName\": \"Wifi maketting\"}",
          expiredDate: "2023-11-03T16:02:17.574Z"

        },
        {
          id: "3",
          customerId: "1",
          itemId: "3",
          attributes: "{\"itemName\": \"CSKH ZALO\"}",
          expiredDate: "2024-12-02T16:02:17.574Z"

        }
      ]
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
    // this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
    //     .subscribe((data) => {
    //       console.log(data)
    //       const idProductRegisterList = data.content.map(ap => ap.itemId);
    //       this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM)
    //           .subscribe((data) => {
    //             console.log(data)
    //             this.productList = data.content
    //                 .filter(ps => idProductRegisterList.includes(ps.id))
    //                 .map(product => {
    //                   product.packages = this.scriptFC.getPackageService(product.attributes);
    //                   return product;
    //                 });
    //             loading_success_2 = true;
    //             this.loading = !(loading_success_1 && loading_success_2);
    //           }, error => {
    //             console.log(error);
    //             this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //             this.loading = false;
    //           });
    //     }, error => {
    //       console.log(error);
    //       this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //       this.loading = false;
    //     });
  }

}
