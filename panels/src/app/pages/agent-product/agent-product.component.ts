import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {Item} from "../../models/Item";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {ROLES, STATUS_AGENT_PRODUCT, STATUS_PRODUCT_SERVICE} from "../../Constants/vg-constant";
import {AgentProduct} from "../../models/AgentProduct";
import {Message} from "../../Constants/message-constant";
import {PackageProduct} from "../../models/PackageProduct";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";

@Component({
    selector: 'app-agent-product',
    templateUrl: './agent-product.component.html',
})
export class AgentProductComponent implements OnInit, AfterViewInit, OnDestroy{
    protected readonly STATUS_AGENT_PRODUCT = STATUS_AGENT_PRODUCT;
    protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
    protected readonly ROLES = ROLES;
    listScript = [];
    dataProductList: Item[] = [];
    dataProductRegisterMap: Map<string, AgentProduct> = new Map<string, AgentProduct>();
    totalProduct: number = 0;
    totalRegisterProduct: number = 0;
    loading: boolean = true;
    isVisibleDelete = false;
    isConfirmLoadingDelete = false;
    idDelete: number | string | null | undefined = -1;
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
            this.renderer.addClass(document.querySelector('.agent-product'), "active");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.agent-product'), "active");
    }

    init(): void {
        this.loadDataFromServer().then();
    }

    loadDataFromServer(keyWork?: string): Promise<void> {
        return new Promise(async rs => {
            this.loading = true;
            let isSuccessLoadDataProduct = false;
            let isSuccessLoadDataProductRegister = false;
            const objectSelectItem: ObjectSelectAll = {keyword: keyWork}
             this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, objectSelectItem)
                .subscribe((data) => {
                    console.log(data)
                    this.totalProduct = data.totalElements;
                    this.dataProductList = data.content;
                    this.dataProductList = this.dataProductList.map(d => {
                        d.packages = this.scriptFC.getPackageService(d.attributes)
                        return d;
                    })
                    isSuccessLoadDataProduct = true;
                    if (!(isSuccessLoadDataProduct && isSuccessLoadDataProductRegister)) {
                        this.loading = false;
                        rs();
                    }
                });
             this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
                .subscribe((data) => {
                    console.log(data)
                    this.totalRegisterProduct = data.totalElements;
                    this.dataProductRegisterMap = new Map<string, AgentProduct>(data.content.map(ap => [ap.itemId!, ap]));
                    isSuccessLoadDataProductRegister = true;
                    if (!(isSuccessLoadDataProduct && isSuccessLoadDataProductRegister)) {
                        this.loading = false;
                        rs();
                    }
                });
        })
    }

    handleOk(idProduct: string | null, e: any): void {
        this.loading = true;
        if (!idProduct) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_REGISTER_FAILED);
            return;
        } else {
            const data: AgentProduct = {itemId: idProduct, status: STATUS_AGENT_PRODUCT.REGISTERED.value}
            this.api.insert(data, URL.API_AGENT_PRODUCT)
                .subscribe(() => {
                    this.loadDataFromServer().then(() => this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_REGISTER_SUCCESS));
                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                    this.loading = false;
                })
        }
    }
    showDeleteModal(id: number | string | null | undefined) {
        this.isVisibleDelete = true;
        this.idDelete = id;
    }
    handleCancelDeletePopup(): void {
        this.isVisibleDelete = false;
        this.idDelete = -1;
    }
    handleConfirmToDelete() {
        if (this.idDelete) {
            this.isConfirmLoadingDelete = true;
            this.api.delete(this.idDelete, URL.API_AGENT_PRODUCT).subscribe(() => {
                this.handleCancelDeletePopup();
                this.loadDataFromServer().then(() => {
                    this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
                    this.isConfirmLoadingDelete = false;
                });
            }, (error) => {
                this.loading = false;
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
                this.isConfirmLoadingDelete = false;
            });
        }
    }

    search(event: any): void {
        this.loadDataFromServer(event.target.value).then();
        event.target.value = "";
    }
    createComponentModalView(product: Item) {
        this.scriptFC.createComponentModalViewProductDetails(product, this.viewContainerRef);
    }
}
