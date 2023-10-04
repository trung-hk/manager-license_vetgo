import {Component, Renderer2} from '@angular/core';
import {Item} from "../../models/Item";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {ROLES, STATUS_AGENT_PRODUCT} from "../../Constants/vg-constant";
import {AgentProduct} from "../../models/AgentProduct";

@Component({
    selector: 'app-agent-product',
    templateUrl: './agent-product.component.html',
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
export class AgentProductComponent {
    protected readonly STATUS_AGENT_PRODUCT = STATUS_AGENT_PRODUCT;
    protected readonly ROLES = ROLES;
    listScript = [];
    dataProductList: Item[] = [];
    dataProductRegisterList: Map<string, AgentProduct> = new Map<string, AgentProduct>();
    totalProduct: number = 0;
    totalRegisterProduct: number = 0;
    loading: boolean = true;
    isVisibleDelete = false;
    idDelete: number | string | null | undefined = -1;
    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                public scriptFC: ScriptCommonService) {
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
             this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, null, null, null, null, keyWork)
                .subscribe((data) => {
                    console.log(data)
                    this.totalProduct = data.totalElements;
                    this.dataProductList = data.content;
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
                    this.dataProductRegisterList = new Map<string, AgentProduct>(data.content.map(ap => [ap.itemId!, ap]));
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
            this.scriptFC.alertShowMessageError('Đăng ký thất bại');
            return;
        } else {
            const data: AgentProduct = {itemId: idProduct, status: STATUS_AGENT_PRODUCT.REGISTERED_VALUE}
            this.api.insert(data, URL.API_AGENT_PRODUCT)
                .subscribe(() => {
                    this.loadDataFromServer().then(() => this.scriptFC.alertShowMessageSuccess('Đăng ký thành công'));
                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError('Đăng ký thất bại');
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
            this.api.delete(this.idDelete, URL.API_AGENT_PRODUCT).subscribe(() => {
                this.handleCancelDeletePopup();
                this.loadDataFromServer().then(() => {
                    this.scriptFC.alertShowMessageSuccess('Xóa thành công');
                });
            }, (error) => {
                this.loading = false;
                console.log(error);
                this.scriptFC.alertShowMessageError('Xóa thất bại');
            });
        }
    }

    search(event: any): void {
        this.loadDataFromServer(event.target.value).then();
        event.target.value = "";
    }
}
