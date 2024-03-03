import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';
import {Constant, STATUS_PARTNER, USER_TYPE} from "../../Constants/vg-constant";
import {User} from "../../models/User";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {USER_FORM} from "../../Constants/Form";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ResponseError} from "../../models/ResponseError";
import {Message} from "../../Constants/message-constant";
import {Commission} from "../../models/Commission";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly STATUS_DATA = STATUS_PARTNER;
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
      this.renderer.addClass(document.querySelector('.distributor'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.distributor'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(from?: string, to?: string, keyWork?: string): void {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    const objectSelectUser: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.PARTNER, objectSelectUser).subscribe((data) => {
      console.log(data)
      loading_success_1 = true;
      this.total = data.totalElements;
      this.dataList = data.content;
      this.loading = !(loading_success_1 && loading_success_2);
    });
    this.api.getAll<ResponseDataGetAll<Commission>>(URL.API_COMMISSION).subscribe((data) => {
      console.log(data)
      loading_success_2 = true;
      this.dataCommission = data.content;
      this.dataCommissionMap = new Map<string, Commission>(data.content?.map(d => [d.id!, d]));
      this.loading = !(loading_success_1 && loading_success_2);
    });
  }

  showModal(partner?: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    if (partner) {
      this.validateForm.setValue({
        id: partner.id,
        code: partner.code,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        status: partner.status,
        address: partner.address,
        commissionId: partner.commissionId
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
        data.type = USER_TYPE.PARTNER;
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
}