import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {ROLES, STATUS_AGENT_PRODUCT, STATUS_PRODUCT_SERVICE} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";
import {PackageProduct} from "../../models/PackageProduct";

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styles: [
    `
          .dynamic-delete-button {
            cursor: pointer;
            position: relative;
            top: 4px;
            font-size: 24px;
            color: #999;
            transition: all 0.3s;
          }

          .dynamic-delete-button:hover {
            color: #777;
          }
        `
  ]
})
export class OrderServiceComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly STATUS_AGENT_PRODUCT = STATUS_AGENT_PRODUCT;
  protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
  protected readonly ROLES = ROLES;
  listScript = [];
  dataProductList: Item[] = [];
  dataPackageProductMap: Map<string, PackageProduct[]> = new Map<string, PackageProduct[]>();
  loading: boolean = true;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.partner'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.partner'), "active");
  }

  init(): void {
    this.loadDataFromServer().then();
  }

  loadDataFromServer(keyWork?: string): Promise<void> {
    return new Promise(async rs => {
      this.loading = true;
      this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
          .subscribe((data) => {
            console.log(data)
            const IdProductRegisterList = data.content.map(ap => ap.itemId);
            this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, null, null, null, null, keyWork)
                .subscribe((data) => {
                  console.log(data)
                  this.dataProductList = data.content.filter(ps => IdProductRegisterList.includes(ps.id)).sort(function(a, b){return ((JSON.parse(a.attributes!).packages).length - (JSON.parse(b.attributes!).packages).length)});
                  this.dataPackageProductMap = new Map<string, PackageProduct[]>(
                      this.dataProductList.map(product => [product.id!, this.scriptFC.getPackageService(product.attributes)])
                  )
                  this.loading = false;
                  rs();
                });
          });
    })
  }
  search(event: any): void {
    this.loadDataFromServer(event.target.value).then();
    event.target.value = "";
  }

  formatPhone(event: any): void {
    event.target.value = this.scriptFC.formatPhone(event.target.value);
  }
  createComponentModal(idSelect: string): void {
    this.scriptFC.createComponentModalFormOrderService(idSelect, this.dataProductList, this.dataPackageProductMap, null, null, this.viewContainerRef)
  }
}
