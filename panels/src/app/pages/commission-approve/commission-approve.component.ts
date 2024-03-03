import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {SettingBankingInfo} from "../../models/SettingBankingInfo";
import {User} from "../../models/User";
import {BankingInfo} from "../../models/BankingInfo";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {SETTING_BANKING_INFO_FORM} from "../../Constants/Form";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {
  Constant,
  ROLES, STATUS_CODE_ERROR,
  STATUS_PAYMENT,
  STATUS_SETTING_BANKING_INFO,
  TEMPLATE_VIET_QR, TYPE_PAYMENT,
  USER_TYPE
} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ResponseError} from "../../models/ResponseError";
import {CommissionApproved} from "../../models/CommissionApproved";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {OrderService} from "../../models/OrderService";
import {RouteURL} from "../../Constants/route-url";
import {CommissionApprovePending} from "../../models/CommissionApprovePending";
import {CommonParamComponent} from "../../models/CommonParamComponent";

interface ObjectByRole {
  userType: string,
}

@Component({
  selector: 'app-commission-approve',
  templateUrl: './commission-approve.component.html',
})
export class CommissionApproveComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_SETTING_BANKING_INFO = STATUS_SETTING_BANKING_INFO;
  listScript = [];
  dataList: CommissionApproved[] = [];
  userList: User[] = [];
  userMap: Map<string, User> = new Map<string, User>();
  bankingInfo: BankingInfo[] = [];
  bankingInfoMap: Map<string, BankingInfo> = new Map<string, BankingInfo>();

  isShowForm: boolean = false;
  validateForm!: UntypedFormGroup;
  isConfirmLoading: boolean = false;
  isVisibleDelete: boolean = false;
  isConfirmLoadingDelete: boolean = false;
  idDelete: string | null = null;
  isLoadFirstData: boolean = true;

  objectByRole!: ObjectByRole;

  selectUser: string | null = null;

  isRePayment = false;
  repaymentObject!: CommissionApproved | null;

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {
    super()
  }

  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(SETTING_BANKING_INFO_FORM);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.commissions'), "active");
      this.renderer.addClass(document.querySelector('.commissions a'), "toggled");
      this.renderer.addClass(document.querySelector('.commission-approved-list'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.commissions'), "active");
    this.renderer.removeClass(document.querySelector('.commission-approved-list'), "active");
  }
  init(): void {
    this.loadDataFromServer().then();
  }
  async loadDataFromServer(from?: string, to?: string, keyWork?: string): Promise<void> {
    this.loading = true;
    if (!this.objectByRole) this.objectByRole = await this.getObjectByRoles();
    let loading_success_1 = false;
    let loading_success_2 = false;
    let loading_success_3 = false;
    const objectSelect: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<CommissionApproved>>(URL.API_COMMISSION_APPROVED, objectSelect).subscribe(data => {
      this.dataList = data.content;
      this.total = data.totalElements;
      loading_success_1 = true;
      this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
      this.loading = false;

    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
    // if (this.isLoadFirstData) {
    //   this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, this.objectByRole.userType).subscribe((data) => {
    //     console.log(data)
    //     this.userList = data.content;
    //     this.userMap = new Map<string, User>(this.userList.map(user => [user.id!, user]));
    //     loading_success_2 = true;
    //     this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    //   }, error => {
    //     console.log(error);
    //     this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //     this.loading = false;
    //   });
    //   this.api.getAll<ResponseDataGetAll<BankingInfo>>(URL.API_BANK_INFO).subscribe((data) => {
    //     console.log(data)
    //     this.bankingInfo = data.content;
    //     this.bankingInfoMap = new Map<string, BankingInfo>(this.bankingInfo.map(banking => [banking.bin!, banking]));
    //     loading_success_3 = true;
    //     this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    //   }, error => {
    //     console.log(error);
    //     this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //     this.loading = false;
    //   });
    //   this.isLoadFirstData = false;
    // } else {
    //   loading_success_2 = true;
    //   loading_success_3 = true;
    //   this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    // }

  }
  getObjectByRoles(): Promise<ObjectByRole> {
    return new Promise((rs) => {
      this.scriptFC.hasPermission(ROLES.ADMIN).then(result => {
        if (result) rs({userType:USER_TYPE.AGENT});
      });
      this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
        if (result) rs({userType:USER_TYPE.DISTRIBUTOR});
      });
      this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
        if (result) rs({userType:USER_TYPE.PARTNER});
      });
    });
  }
  showModal(settingBankingInfo?: SettingBankingInfo) {
    this.isShowForm = true;
    this.validateForm.clearValidators();
    this.validateForm.reset();
    if (settingBankingInfo) {
      this.validateForm.setValue({
        id: settingBankingInfo.id,
        userId: settingBankingInfo.userId?.toString(),
        acqId: settingBankingInfo.acqId,
        accountNo: settingBankingInfo.accountNo,
        accountName: settingBankingInfo.accountName,
        status: settingBankingInfo.status,
      });
    } else {
      this.validateForm.patchValue({
        status: this.STATUS_SETTING_BANKING_INFO.ACTIVATED.value
      })
    }
  }
  handleCancel() {
    this.isShowForm = false;
  }

  handleOk() {
    try {
      if (this.validateForm.invalid) {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
          }
        });
        return
      }
      this.isConfirmLoading = true;
      const data: SettingBankingInfo = this.validateForm.value
      data.template = TEMPLATE_VIET_QR.TEMPLATE_1;
      if (data.id) {
        this.api.update(data.id, data, URL.API_SETTING_BANK_INFO).subscribe((data) => {
          if (this.scriptFC.validateResponseAPI(data.status)){
            data = data as ResponseError;
            this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
          } else {
            this.isShowForm = false;
            this.loadDataFromServer().then();
            this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
          }
          this.isConfirmLoading = false;
        }, (error) => {
          console.log(error);
          this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
          this.isConfirmLoading = false;
        });
      } else {
        this.api.insert(data, URL.API_SETTING_BANK_INFO)
            .subscribe((data) => {
              if (this.scriptFC.validateResponseAPI(data.status)){
                data = data as ResponseError;
                this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
              } else {
                this.isShowForm = false;
                this.loadDataFromServer().then();
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
              }
              this.isConfirmLoading = false;
            }, error => {
              console.log(error);
              this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
              this.isConfirmLoading = false;
            })
      }
    } catch (error) {
      console.log(error)
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
    }
  }
  showDeleteModal(id: string) {
    this.isVisibleDelete = true;
    this.idDelete = id;
  }
  handleToDelete() {
    if (this.idDelete) {
      this.isConfirmLoadingDelete = true;
      this.api.delete(this.idDelete, URL.API_SETTING_BANK_INFO).subscribe(() => {
        this.loadDataFromServer().then();
        this.handleCancelDeletePopup();
        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
        this.isConfirmLoadingDelete = false;
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
        this.isConfirmLoadingDelete = false;
      });
    }
  }
  handleCancelDeletePopup() {
    this.isVisibleDelete = false;
    this.idDelete = null;
  }

  protected readonly ROLES = ROLES;
  protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  payment(commissionApproved: CommissionApproved, method: string): void {
    this.api.getById<SettingBankingInfo>(commissionApproved.userId!, URL.API_GET_SETTING_BANK_INFO_BY_USER_ID).subscribe(data => {
      console.log(data)
      if (this.scriptFC.validateResponseAPI(data.status) && data.status == STATUS_CODE_ERROR.ERROR_404) {
        this.scriptFC.alertShowMessageError(Message.MESSAGE_NOT_SETTING_BANKING_INFO);
      } else {
        this.scriptFC.paymentForCommission(commissionApproved, method, RouteURL.PAGE_COMMISSION_APPROVE);
      }
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
    })
  }

  showRePaymentModal(commissionApproved: CommissionApproved) {
    this.isRePayment = true;
    this.repaymentObject = commissionApproved;
  }
  rePayment() {
    this.isRePayment = false;
    this.payment(this.repaymentObject!, PAYMENTS_METHOD.VIET_QR);
  }
  handleCancelRePaymentModalPopup() {
    this.isRePayment = false;
    this.repaymentObject = null;
  }

  protected readonly TYPE_PAYMENT = TYPE_PAYMENT;
}
