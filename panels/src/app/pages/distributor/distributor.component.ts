import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {User} from "../../models/User";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {USER_FORM} from "../../Constants/Form";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Constant, ROLES, STATUS_DISTRIBUTOR, USER_TYPE} from "../../Constants/vg-constant";
import {ResponseError} from "../../models/ResponseError";
import {Message} from "../../Constants/message-constant";
import {Commission} from "../../models/Commission";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
})
export class DistributorComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly STATUS_DATA = STATUS_DISTRIBUTOR;
  listScript = [];
  dataList: User[] = [];
  dataCommission: Commission[] = [];
  dataCommissionMap: Map<string, Commission> = new Map<string, Commission>();
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoadingDelete = false;
  isConfirmLoading = false;
  isHorizontal = false;
  validateForm!: UntypedFormGroup;
  idDelete: number | string | null | undefined = -1;
  idShowModal: number | string | null | undefined = null;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {
    super()
  }

  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(USER_FORM);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.agent-distributor'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.agent-distributor'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(from?: string, to?: string, keyWork?: string): void {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    const objectSelectUser: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.DISTRIBUTOR, objectSelectUser).subscribe((data) => {
      console.log(data)
      loading_success_1 = true;
      this.total = data.totalElements;
      this.dataList = data.content;
      this.loading = !(loading_success_1 && loading_success_2);
    });
    const objectSelectCommission: ObjectSelectAll = {keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<Commission>>(URL.API_COMMISSION, objectSelectCommission).subscribe((data) => {
      console.log(data)
      loading_success_2 = true;
      this.dataCommission = data.content;
      this.dataCommissionMap = new Map<string, Commission>(data.content.map(d => [d.id!, d]));
      this.loading = !(loading_success_1 && loading_success_2);
    });
  }

  showModal(distributor?: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    if (distributor) {
      this.validateForm.setValue({
        id: distributor.id,
        code: distributor.code,
        name: distributor.name,
        email: distributor.email,
        phone: distributor.phone,
        status: distributor.status,
        address: distributor.address,
        commissionId: distributor.commissionId ? distributor.commissionId.toString() : null
      });
      this.validateForm.get("code")?.disable();
    } else {
      this.validateForm.get("code")?.enable();
      this.validateForm.reset();
      this.validateForm.patchValue({
        status: this.STATUS_DATA.ACTIVATED.value
      })
    }
    this.idShowModal = this.validateForm.get("id")?.value;
  }

  handleOk(): void {
    try {
      if (this.validateForm.valid) {
        this.isConfirmLoading = true;
        this.validateForm.get("code")?.enable();
        const data: User = this.validateForm.value
        data.type = USER_TYPE.DISTRIBUTOR;
        if (data.id) {
          this.api.update(data.id, data, URL.API_USER).subscribe((data) => {
            if (this.scriptFC.validateResponseAPI(data.status)){
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
                if (this.scriptFC.validateResponseAPI(data.status)){
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
      this.api.delete(this.idDelete, URL.API_USER).subscribe(() => {
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
    protected readonly Constant = Constant;
    protected readonly ROLES = ROLES;
}
