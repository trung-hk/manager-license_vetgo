import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';
import {STATUS_PARTNER, USER_TYPE} from "../../Constants/vg-constant";
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

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly STATUS_DATA = STATUS_PARTNER;
  listScript = [];
  dataList: User[] = [];
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
  idDelete: number | string | null | undefined = -1;
  idShowModal: number | string | null | undefined = null;
  filter: Array<{ key: string; value: string[] }> | null = null;
  statusList: {text: string, value: string}[] = [
    {text: this.STATUS_DATA.IN_ACTIVE_LABEL, value: this.STATUS_DATA.IN_ACTIVE_VALUE},
    {text: this.STATUS_DATA.ACTIVATED_LABEL, value: this.STATUS_DATA.ACTIVATED_VALUE}
  ];

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(USER_FORM);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.distributor'), "active");
      this.renderer.addClass(document.querySelector('.distributor a'), "toggled");
      this.renderer.addClass(document.querySelector('.partner-list'), "active");
      this.renderer.addClass(document.querySelector('.partner-list a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.distributor'), "active");
    this.renderer.removeClass(document.querySelector('.partner-list'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(keyWork?: string): void {
    this.loading = true;
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.PARTNER, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
      console.log(data)
      this.loading = false;
      this.total = data.totalElements;
      this.dataList = data.content;
    });
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

  showModal(partner?: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    if (partner) {
      this.validateForm.setValue({
        id: partner.id,
        code: partner.code,
        name: partner.name,
        email: partner.email,
        phone: this.scriptFC.formatPhone(partner.phone),
        status: partner.status,
        address: partner.address,
        commissionId: partner.commissionId
      });
      this.validateForm.get("code")?.disable();
    } else {
      this.validateForm.get("code")?.enable();
      this.validateForm.reset();
      this.validateForm.patchValue({
        status: this.STATUS_DATA.ACTIVATED_VALUE
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
        const phoneUnFormat = this.scriptFC.convertInputFormatToNumber(data.phone);
        data.phone = phoneUnFormat?.slice(0, 10);
        console.log(data);
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
      this.api.delete(this.idDelete, URL.API_USER).subscribe(() => {
        this.loadDataFromServer();
        this.handleCancelDeletePopup();
        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
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
}