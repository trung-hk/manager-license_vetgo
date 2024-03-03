import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CommissionApproved} from "../../models/CommissionApproved";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {
  Constant,
  ROLES,
  STATUS_PAYMENT, USER_TYPE,
} from "../../Constants/vg-constant";
import {RouteURL} from "../../Constants/route-url";
import {PayloadApprovePayment} from "../../models/PayloadApprovePayment";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {CommonParamComponent} from "../../models/CommonParamComponent";

interface ObjectByRole {
  userType: string,
}

@Component({
  selector: 'app-approve-manual-payment-commission',
  templateUrl: './approve-manual-payment-commission.component.html',
})
export class ApproveManualPaymentCommissionComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly RouteURL = RouteURL;
  listScript = [];
  dataCommissionApprovedList: CommissionApproved[] = [];
  idShowModal: boolean = false;
  commissionApproved!: CommissionApproved | null;
  isAwaitApprove: boolean = false;

  objectByRole!: ObjectByRole;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,) {
    super()
  }
  ngOnInit() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.transactions'), "active");
      this.renderer.addClass(document.querySelector('.transactions a'), "toggled");
      this.renderer.addClass(document.querySelector('.commission-await-approve-list'), "active");
      this.renderer.addClass(document.querySelector('.commission-await-approve-list a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.transactions'), "active");
    this.renderer.removeClass(document.querySelector('.commission-await-approve-list'), "active");
  }

  init(): void {
    this.loadDataFromServer().then();
  }
  async loadDataFromServer(from?: string, to?: string, keyWork?: string) {
    this.loading = true;
    if (!this.objectByRole) this.objectByRole = await this.getObjectByRoles();
    //this.filter?.push({key: "ods.payment_status", value: [this.STATUS_PAYMENT.IN_PAYMENT.value]});
    //console.log(this.filter)
    const objectGetAll: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    const apiURL = this.scriptFC.formatString(URL.API_COMMISSION_APPROVED_BY_TYPE, [this.objectByRole.userType])
    this.api.getAll<ResponseDataGetAll<CommissionApproved>>(apiURL, objectGetAll).subscribe(data => {
      this.dataCommissionApprovedList = data.content;
      this.total = data.totalElements;
      this.loading = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    })
  }
  getObjectByRoles(): Promise<ObjectByRole> {
    return new Promise((rs) => {
      this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
        if (result) rs({userType:USER_TYPE.AGENT});
      });
      this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
        if (result) rs({userType:USER_TYPE.DISTRIBUTOR});
      });
      this.scriptFC.hasPermission(ROLES.PARTNER).then(result => {
        if (result) rs({userType:USER_TYPE.PARTNER});
      });
    });
  }
  showApproveModal(commissionApproved: CommissionApproved) {
    this.idShowModal = true;
    this.commissionApproved = commissionApproved;
  }
  approvePayment() {
    this.isAwaitApprove = true;
    const payload: PayloadApprovePayment = {code: this.commissionApproved?.paymentCode, amount: this.commissionApproved?.totalCommissionAmount, resultCode: 0}
    this.api.approvePayment(URL.API_APPROVE_MANUAL_PAYMENT, payload).subscribe(data => {
      this.loadDataFromServer().then();
      this.isAwaitApprove = false;
      this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
      this.idShowModal = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
      this.isAwaitApprove = false;
    });

  }
  handleCancelApprovePopup() {
    this.idShowModal = false;
    this.commissionApproved = null;
    this.isAwaitApprove = false;
  }

  protected readonly ROLES = ROLES;
  protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
}
