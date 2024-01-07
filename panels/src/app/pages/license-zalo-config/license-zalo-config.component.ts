import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {
  CONFIG_LICENSE_ZALO_ACCOUNT_FORM,
  CONFIG_LICENSE_ZALO_FORM,
  CONFIG_LICENSE_ZALO_SYSTEM_FORM,
} from "../../Constants/Form";
import {Message} from "../../Constants/message-constant";
import {AccountInfo, LicenseZalo} from "../../models/LicenseZalo";
import {
  CONFIG,
  Constant,
  TYPE_LICENSE,
} from "../../Constants/vg-constant";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {ApiScriptCommonService} from "../../services/api-script-common.service";
import {ApiLicenseZalo} from "../../models/ApiLicenseZalo";
import {BodyDataScript, CallScriptObject} from "../../models/CallScriptObject";

@Component({
  selector: 'app-license-zalo-config',
  templateUrl: './license-zalo-config.component.html',
})
export class LicenseZaloConfigComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly TYPE_LICENSE = TYPE_LICENSE;
  protected readonly ApiScriptCommonService = ApiScriptCommonService;
  listScript = [];
  dataList: LicenseZalo[] = [];
  dataConfigSystemApiList: ApiLicenseZalo[] = [];
  dataApiList: ApiLicenseZalo[] = [];
  dataApiDeleteList: ApiLicenseZalo[] = [];
  total: number = 0;
  loading: boolean = true;
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoadingDelete = false;
  isConfirmLoading = false;
  validateForm!: UntypedFormGroup;
  validateFormConfigSystem!: UntypedFormGroup;
  idDelete: string | null | undefined = null;
  idShowModal: number | string | null | undefined = null;
  isShowModalSystem = false;
  formConfigSystem!: FormArray;
  formApi!: FormArray;
  formPhone!: FormArray;
  attributeArrayForm: string = "configSystem";
  attributeArrayFormAPI: string = "api";
  attributeArrayFormPhones: string = "phones";
  executingIdList: string[] = [];
  constructor(private loadScript: LazyLoadScriptService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder,
              private i18n: NzI18nService,
              private callScript: ApiScriptCommonService) {
  }
  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(CONFIG_LICENSE_ZALO_FORM);
    this.validateFormConfigSystem = this.fb.group({
      configSystem: this.fb.array([]),
      api: this.fb.array([]),
      phones: this.fb.array([])
    });
    this.formConfigSystem = this.validateFormConfigSystem.get(this.attributeArrayForm) as FormArray;
    this.formApi = this.validateFormConfigSystem.get(this.attributeArrayFormAPI) as FormArray;
    this.formPhone = this.validateFormConfigSystem.get(this.attributeArrayFormPhones) as FormArray;
    this.i18n.setLocale(en_US);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.config'), "active");
      this.renderer.addClass(document.querySelector('.config a'), "toggled");
      this.renderer.addClass(document.querySelector('.license-zalo'), "active");
      this.renderer.addClass(document.querySelector('.license-zalo a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.config'), "active");
    this.renderer.removeClass(document.querySelector('.license-zalo'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(): void {
    this.loading = true;
    let isSuccess1 = false;
    let isSuccess2 = false;
    const dataManagerSheet: CallScriptObject = {
      actionType: "GET",
      table: "MANAGER_SHEET",
    }
    this.callScript.callAPI<LicenseZalo[]>(dataManagerSheet).subscribe((data) => {
      this.dataList = data.filter(d => d.deleted == "false").map(d => {
        d.accountList = this.scriptFC.getAccountZaloListFromJson(d.phone!);
        return d;
      });
      this.total = this.dataList.length;
      isSuccess1 = true;
      this.loading = !(isSuccess1 && isSuccess2);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    })
    const dataManagerSystem: CallScriptObject = {
      actionType: "GET",
      table: "MANAGER_SYSTEM",
    }
    this.callScript.callAPI<ApiLicenseZalo[]>(dataManagerSystem).subscribe((data) => {
      data = data.filter(d => d.deleted == "false");
      this.dataConfigSystemApiList = data.filter(d => Constant.API_CONFIG_SYSTEM_LIST.includes(d.id!));
      this.dataApiList = data.filter(d => !Constant.API_CONFIG_SYSTEM_LIST.includes(d.id!));
      console.log(this.dataApiList)
      isSuccess2 = true;
      this.loading = !(isSuccess1 && isSuccess2);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    })
  }
  showModal(licenseZalo?: LicenseZalo): void {
    this.isVisible = true;
    this.isShowModalSystem = false;
    this.formConfigSystem.clear();
    this.formApi.clear();
    this.formPhone.clear();
    this.dataApiDeleteList = [];
    if (licenseZalo) {
      this.validateForm.setValue({
        name: licenseZalo.name,
        id: licenseZalo.id,
        email: licenseZalo.email,
        license: licenseZalo.license,
      });
      licenseZalo.accountList?.forEach(account => {
        this.formPhone.push(this.fb.group({
          phone: account.phone,
          expiredDate: account?.expiredDate ? this.scriptFC.formatDate_YYYY_MM_DD(account?.expiredDate) : null
        }))
      });
      if (ApiScriptCommonService.URL.includes(licenseZalo.id!)) {
        this.isShowModalSystem = true;
        this.dataConfigSystemApiList.forEach(config => {
          this.formConfigSystem.push(this.fb.group({
            id: config.id,
            data: config.data,
          }));
        })
        this.dataApiList.forEach(api => {
          this.formApi.push(this.fb.group({
            id: api.id,
            data: api.data,
          }));
        })
      }
    } else {
      this.validateForm.reset();
      this.validateForm.patchValue({
        license: TYPE_LICENSE.PRO.value,
      })
    }
    this.idShowModal = this.validateForm.get("id")?.value;
  }

  handleOk(): void {
    try {
      if (this.validateForm.valid) {
        this.isConfirmLoading = true;
        const data: LicenseZalo = this.validateForm.value;
        const accountList: {phones: AccountInfo[]} = {phones: this.validateFormConfigSystem.get(this.attributeArrayFormPhones)?.getRawValue()}
        accountList.phones = accountList.phones.map(account => {
          let expiredDate = new Date(account.expiredDate);
          expiredDate.setUTCHours(0,0,0,0);
          account.expiredDate = expiredDate.toISOString();
          return account;
        })
        data.phone = JSON.stringify(accountList);
        const dataUpdate: CallScriptObject = {
          actionType: 'POST',
          table: 'MANAGER_SHEET',
          data: data,
        }
        let isSuccess1 = false;
        let isSuccess2 = !ApiScriptCommonService.URL.includes(data.id!);
        let isSuccess3 = !(this.dataApiDeleteList.length > 0);
        this.callScript.callAPI(dataUpdate).subscribe((data) => {
          isSuccess1 = true;
          this.isConfirmLoading = !(isSuccess1 && isSuccess2 && isSuccess3);
          this.isVisible = !(isSuccess1 && isSuccess2 && isSuccess3);
          if (isSuccess1 && isSuccess2 && isSuccess3) {
            this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
            this.loadDataFromServer();
          }
        }, (error) => {
          console.log(error);
          this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
          this.isConfirmLoading = false;
        })
        if (ApiScriptCommonService.URL.includes(data.id!)) {
          const dataApi: {configSystem: ApiLicenseZalo[], api: ApiLicenseZalo[]} = this.validateFormConfigSystem.value;
          const allListData: ApiLicenseZalo[] = []
          dataApi.configSystem.forEach(d => allListData.push(d));
          dataApi.api.forEach(d => allListData.push(d));
          const dataUpdate: CallScriptObject = {
            actionType: 'addAll',
            table: 'MANAGER_SYSTEM',
            data: allListData,
          }
          this.callScript.callAPI(dataUpdate).subscribe((data) => {
            isSuccess2 = true;
            this.isConfirmLoading = !(isSuccess1 && isSuccess2 && isSuccess3);
            this.isVisible = !(isSuccess1 && isSuccess2 && isSuccess3);
            if (isSuccess1 && isSuccess2 && isSuccess3) {
              this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
              this.loadDataFromServer();
            }
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
            this.isConfirmLoading = false;
          })
          if (this.dataApiDeleteList.length > 0) {
            new Promise((rs) => {
              const dataDelete: CallScriptObject = {
                actionType: 'DELETE',
                table: 'MANAGER_SYSTEM'
              }
              for (let i = 0; i < this.dataApiDeleteList.length; i++) {
                dataDelete.id = this.dataApiDeleteList[i].id!;
                this.callScript.callAPI(dataDelete).subscribe(() => {
                  if (i == this.dataApiDeleteList.length -1 ) rs("OK");
                });
              }
            }).then(result => {
              isSuccess3 = result == "OK";
              this.isConfirmLoading = !(isSuccess1 && isSuccess2 && isSuccess3);
              this.isVisible = !(isSuccess1 && isSuccess2 && isSuccess3);
              if (isSuccess1 && isSuccess2 && isSuccess3) {
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                this.loadDataFromServer();
              }
            })
          }
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

  showDeleteModal(id: string | null | undefined) {
    this.isVisibleDelete = true;
    this.idDelete = id;
  }

  handleCancelDeletePopup(): void {
    this.isVisibleDelete = false;
    this.idDelete = null;
  }

  handleConfirmToDelete() {
    if (this.idDelete) {
      this.isConfirmLoadingDelete = true;
      const dataDelete: CallScriptObject = {
        actionType: 'DELETE',
        table: 'MANAGER_SHEET',
        id: this.idDelete!
      }
      this.callScript.callAPI(dataDelete).subscribe(() => {
        this.loadDataFromServer();
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
  addConfigSystem() {
    this.formConfigSystem.push(this.fb.group(CONFIG_LICENSE_ZALO_SYSTEM_FORM));
  }
  addConfigApi() {
    this.formApi.push(this.fb.group(CONFIG_LICENSE_ZALO_SYSTEM_FORM));
  }
  removeFieldConfigSystem(index: number, e: MouseEvent, api: AbstractControl<ApiLicenseZalo>): void {
    e.preventDefault();
    this.formConfigSystem.removeAt(index)
    const value = api.value;
    if (value.id) this.dataApiDeleteList.push(value);
  }
  removeFieldConfigApi(index: number, e: MouseEvent, api: AbstractControl<ApiLicenseZalo>): void {
    e.preventDefault();
    this.formApi.removeAt(index);
    const value = api.value;
    if (value.id) this.dataApiDeleteList.push(value);
  }
  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  executeApi(api: ApiLicenseZalo, licenseZalo?: LicenseZalo, phone?: string) {
    const idExecute = api.id!.replace("{phone}", phone ? phone : "");
    try {
      const dataExecute: CallScriptObject = JSON.parse(api.data!);
      const dataBody : BodyDataScript | undefined = dataExecute.data;
      if (licenseZalo && dataBody) {
        dataBody.sheetId = licenseZalo.id;
      }
      if (phone && dataBody) {
        dataBody.phone = phone;
      }
      dataExecute.data = dataBody
      this.executingIdList.push(idExecute);
      this.callScript.callAPI(dataExecute).subscribe(() => {
        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_EXECUTE_API_SUCCESS);
        this.executingIdList = this.executingIdList.filter(e => e != idExecute);
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_EXECUTE_API_FAILED);
        this.executingIdList = this.executingIdList.filter(e => e != idExecute);
      });
    } catch (error) {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_EXECUTE_API_FAILED);
      this.executingIdList = this.executingIdList.filter(e => e != idExecute);
    }
  }
  addAccount() {
    this.formPhone.push(this.fb.group(CONFIG_LICENSE_ZALO_ACCOUNT_FORM));
  }
  removeFieldAddAccount(index: number, e: MouseEvent) {
    e.preventDefault();
    this.formPhone.removeAt(index);
  }
  protected readonly Constant = Constant;
}
