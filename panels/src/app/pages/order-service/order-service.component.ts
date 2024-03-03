import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
    ROLES,
    STATUS_AGENT_PRODUCT,
    STATUS_PRODUCT_SERVICE
} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {AttributesModalFormOrderService} from "../../models/AttributesModalFormOrderService";

@Component({
    selector: 'app-order-service',
    templateUrl: './order-service.component.html',
})
export class OrderServiceComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_AGENT_PRODUCT = STATUS_AGENT_PRODUCT;
    protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
    protected readonly ROLES = ROLES;
    listScript = [];
    dataProductList: Item[] = [];
    loading: boolean = true;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
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
                    const objectSelectItem: ObjectSelectAll = {keyword: keyWork}
                    this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, objectSelectItem)
                        .subscribe((data) => {
                            console.log(data)
                            this.dataProductList = data.content.filter(ps => IdProductRegisterList.includes(ps.id)).map(d => {
                                d.packages = this.scriptFC.getPackageService(d.attributes);
                                return d;
                            });
                            this.loading = false;
                            rs();
                        });
                });
        })
    }

    createComponentModal(idSelect: string): void {
        const attributesInsert: AttributesModalFormOrderService = {
            modeOpen: MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT,
            productInfo: this.dataProductList,
            idProductSelect: idSelect,
        }
        this.scriptFC.createComponentModalFormOrderService(this.viewContainerRef, attributesInsert)
    }

    createComponentModalView(product: Item) {
        this.scriptFC.createComponentModalViewProductDetails(product, this.viewContainerRef);
    }
}
