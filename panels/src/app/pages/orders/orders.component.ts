import {Component, Renderer2, ViewContainerRef} from '@angular/core';
import {User} from "../../models/User";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {USER_FORM_FOR_AGENT} from "../../Constants/Form";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {USER_TYPE, STATUS_AGENT, STATUS_PAYMENT, STATUS_ORDER, ROLES} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ResponseError} from "../../models/ResponseError";
import * as Message from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {PackageProduct} from "../../models/PackageProduct";
import {ModalFormOrderServiceCallback} from "../../models/ModalFormOrderServiceCallback";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  protected readonly STATUS_AGENT = STATUS_AGENT;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly STATUS_ORDER = STATUS_ORDER;
  listScript = [];
  dataList: OrderService[] = [];
  productList: Item[] = [];
  dataProductMap: Map<string, Item> = new Map<string, Item>();
  dataPackageProductMap: Map<string, PackageProduct[]> = new Map<string, PackageProduct[]>();
  dataPackageMap: Map<string, PackageProduct> = new Map<string, PackageProduct>();
  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoading = false;
  isHorizontal = false;
  validateForm!: UntypedFormGroup;
  orderDelete: OrderService | null | undefined = null;
  idShowModal: number | string | null | undefined = null;
  filter: Array<{ key: string; value: string[] }> | null = null;
  statusList: {text: string, value: string}[] = [
    {text: this.STATUS_ORDER.IN_PROCESS_LABEL, value: this.STATUS_ORDER.IN_PROCESS_VALUE},
    {text: this.STATUS_ORDER.CANCEL_ORDER_LABEL, value: this.STATUS_ORDER.CANCEL_ORDER_VALUE},
    {text: this.STATUS_ORDER.FINISHED_LABEL, value: this.STATUS_ORDER.FINISHED_VALUE}
  ];
  paymentStatusList: {text: string, value: string}[] = [
    {text: this.STATUS_PAYMENT.UN_PAID_LABEL, value: this.STATUS_PAYMENT.UN_PAID_VALUE},
    {text: this.STATUS_PAYMENT.PAID_LABEL, value: this.STATUS_PAYMENT.PAID_VALUE}
  ];

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(USER_FORM_FOR_AGENT);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.orders'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.orders'), "active");
  }

  init(): void {
    this.loadDataFromServer().then();
  }

  async loadDataFromServer(keyWork?: string): Promise<void> {
    return new Promise(rs => {
      this.loading = true;
      let isLoadedDataOrderService = false;
      let isLoadedDataProduct = false;
      this.api.getAll<ResponseDataGetAll<OrderService>>(URL.API_ORDER_SERVICE, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
        console.log(data)
        this.loading = false;
        this.total = data.totalElements;
        this.dataList = data.content;
        isLoadedDataOrderService = true;
      }, error => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
        rs()
        this.loading = false;
      });
      this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
          .subscribe((data) => {
            console.log(data)
            const idProductRegisterList = data.content.map(ap => ap.itemId);
            this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, null, null, null, null, keyWork)
                .subscribe((data) => {
                  console.log(data)
                  this.productList = data.content.filter(ps => idProductRegisterList.includes(ps.id));
                  this.dataProductMap = new Map<string, Item>(
                      this.productList.map(p => [p.id!, p])
                  )
                  this.dataPackageProductMap = new Map<string, PackageProduct[]>(
                      this.productList.map(product => {
                        const packageList = this.scriptFC.getPackageService(product.attributes);
                        packageList.forEach(p => this.dataPackageMap.set(p.id!, p));
                        return [product.id!, packageList];
                      })
                  )
                  isLoadedDataProduct = true;
                }, error => {
                  console.log(error);
                  this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                  rs()
                  this.loading = false;
                });
          }, error => {
            console.log(error);
            this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
            rs()
            this.loading = false;
          });
      const interval = setInterval(() => {
        if (isLoadedDataProduct && isLoadedDataOrderService) {
          this.loading = false;
          clearInterval(interval);
          rs();
        }
      }, 500);
    })


  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.changeFirst) {
      this.changeFirst = false;
      return;
    }
    console.log(params)
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.filter = filter;
    if (!sortField) {
      this.sort = "last_modified_date,desc";
    } else {
      let sortOrder = (currentSort && currentSort.value) || null;
      sortOrder = sortOrder && sortOrder === 'ascend' ? 'asc' : 'desc';
      this.sort = `${sortField},${sortOrder}`;
    }
    this.loadDataFromServer();
  }

  showModal(agent?: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    if (agent) {
      this.validateForm.setValue({
        id: agent.id,
        realm: agent.realm,
        code: agent.code,
        name: agent.name,
        email: agent.email,
        phone: this.scriptFC.formatPhone(agent.phone),
        status: agent.status,
        address: agent.address,
      });
      this.validateForm.get("realm")?.disable();
      this.validateForm.get("code")?.disable();
    } else {
      this.validateForm.get("realm")?.enable();
      this.validateForm.get("code")?.enable();
      this.validateForm.reset();
      this.validateForm.patchValue({
        status: this.STATUS_AGENT.ACTIVATED_VALUE
      })
    }
    this.idShowModal = this.validateForm.get("id")?.value;
  }

  handleOk(): void {
    try {
      if (this.validateForm.valid) {
        this.isConfirmLoading = true;
        this.validateForm.get("code")?.enable();
        this.validateForm.get("realm")?.enable();
        const data: User = this.validateForm.value
        data.type = USER_TYPE.AGENT;
        const phoneUnFormat = this.scriptFC.convertInputFormatToNumber(data.phone);
        data.phone = phoneUnFormat?.slice(0, 10);
        if (data.id) {
          this.api.update(data.id, data, URL.API_USER).subscribe((data) => {
            if (data.status == 400){
              data = data as ResponseError;
              this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
            } else {
              this.isVisible = false;
              this.loadDataFromServer();
              this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
            }
            this.isConfirmLoading = false;
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
            this.isConfirmLoading = false;
          });
        } else {
          this.api.insert(data, URL.API_USER)
              .subscribe((data) => {
                if (data.status == 400 || data.status == 409){
                  data = data as ResponseError;
                  this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                } else {
                  this.isVisible = false;
                  this.loadDataFromServer();
                  this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                }
                this.isConfirmLoading = false;
              }, error => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                this.isConfirmLoading = false;
              })
        }
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
          }
        });
      }
    } catch (error) {
      console.log(error)
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteModal(order: OrderService) {
    this.isVisibleDelete = true;
    this.orderDelete = order;
  }

  handleCancelDeletePopup(): void {
    this.isVisibleDelete = false;
    this.orderDelete = null;
  }

  handleConfirmToDelete() {
    if (this.orderDelete) {
      this.orderDelete.status = STATUS_ORDER.CANCEL_ORDER_VALUE;
      this.api.update(this.orderDelete.id, this.orderDelete, URL.API_ORDER_SERVICE).subscribe((data) => {
        if (data.status === 400 || data.status ===409) {
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_FAILED);
        } else {
          this.loadDataFromServer().then();
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
        }
        this.handleCancelDeletePopup();
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
      });
    }
  }

  search(event: any): void {
    this.loadDataFromServer(event.target.value);
    event.target.value = "";
  }

  formatPhone(event: any): void {
    event.target.value = this.scriptFC.formatPhone(event.target.value);
  }


  createComponentModal(order?: OrderService): void {
    const callback: ModalFormOrderServiceCallback = {
      reloadData: () => {
        // Gọi phương thức từ class đã định nghĩa ở đây
        this.loadDataFromServer().then();
      }
    };

    this.scriptFC.createComponentModalFormOrderService(order?.itemId!, this.productList, this.dataPackageProductMap, order?.customerId!, order, this.viewContainerRef, callback)
  }

  protected readonly ROLES = ROLES;
}
