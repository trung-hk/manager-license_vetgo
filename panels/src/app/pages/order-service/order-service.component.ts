import {Component, Renderer2, ViewContainerRef} from '@angular/core';
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {ROLES, STATUS_AGENT_PRODUCT, STATUS_PRODUCT_SERVICE} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";
import * as Message from "../../Constants/message-constant";
import {UntypedFormGroup} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";
import {IModalData} from "../../models/ModalData";
import {FormOrderServiceModalComponent} from "../form-order-service-modal/form-order-service-modal.component";
import {User} from "../../models/User";
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
export class OrderServiceComponent {
  protected readonly STATUS_AGENT_PRODUCT = STATUS_AGENT_PRODUCT;
  protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
  protected readonly ROLES = ROLES;
  listScript = [];
  dataProductList: Item[] = [];
  dataProductRegisterList: Map<string, AgentProduct> = new Map<string, AgentProduct>();
  dataPackageProductMap: Map<string, PackageProduct[]> = new Map<string, PackageProduct[]>();
  totalProduct: number = 0;
  totalRegisterProduct: number = 0;
  loading: boolean = true;
  isVisible: boolean = false;
  idShowModal: number | string | null | undefined = null;
  isVisibleDelete = false;
  idDelete: number | string | null | undefined = -1;
  validateForm!: UntypedFormGroup;
  isConfirmLoading = false;
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

  handleOk(idProduct: string | null, e: any): void {
    this.loading = true;
    if (!idProduct) {
      this.scriptFC.alertShowMessageError(Message.MESSAGE_REGISTER_FAILED);
      return;
    } else {
      const data: AgentProduct = {itemId: idProduct, status: STATUS_AGENT_PRODUCT.REGISTERED_VALUE}
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
      this.api.delete(this.idDelete, URL.API_AGENT_PRODUCT).subscribe(() => {
        this.handleCancelDeletePopup();
        this.loadDataFromServer().then(() => {
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
        });
      }, (error) => {
        this.loading = false;
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
      });
    }
  }

  search(event: any): void {
    this.loadDataFromServer(event.target.value).then();
    event.target.value = "";
  }

  formatPhone(event: any): void {
    event.target.value = this.scriptFC.formatPhone(event.target.value);
  }

  handleCancel() {
    this.isVisible = false;
  }
  showModal(agent?: User): void {
    this.isVisible = true;
    // this.validateForm.clearValidators();
    // if (agent) {
    //   this.validateForm.setValue({
    //     id: agent.id,
    //     realm: agent.realm,
    //     code: agent.code,
    //     name: agent.name,
    //     email: agent.email,
    //     phone: this.scriptFC.formatPhone(agent.phone),
    //     status: agent.status,
    //     address: agent.address,
    //   });
    //   this.validateForm.get("realm")?.disable();
    //   this.validateForm.get("code")?.disable();
    // } else {
    //   this.validateForm.get("realm")?.enable();
    //   this.validateForm.get("code")?.enable();
    //   this.validateForm.reset();
    //   this.validateForm.patchValue({
    //     // status: this.STATUS_AGENT.ACTIVATED_VALUE
    //   })
    // }
    // this.idShowModal = this.validateForm.get("id")?.value;
  }
  createComponentModal(idSelect: string): void {
    this.scriptFC.createComponentModalFormOrderService(idSelect, this.dataProductList, this.dataPackageProductMap, null, null, this.viewContainerRef)
  }
}
