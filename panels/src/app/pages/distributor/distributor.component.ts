import {Component, Renderer2} from '@angular/core';
import {User} from "../../models/User";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {USER_FORM} from "../../Constants/Form";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {STATUS_DISTRIBUTOR, USER_TYPE} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ResponseError} from "../../models/ResponseError";
import * as Message from "../../Constants/message-constant";

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
})
export class DistributorComponent {
  protected readonly STATUS_DATA = STATUS_DISTRIBUTOR;
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
      this.renderer.addClass(document.querySelector('.agent-distributor'), "active");
      this.renderer.addClass(document.querySelector('.agent-distributor a'), "toggled");
      this.renderer.addClass(document.querySelector('.distributor-list'), "active");
      this.renderer.addClass(document.querySelector('.distributor-list a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.agent-distributor'), "active");
    this.renderer.removeClass(document.querySelector('.distributor-list'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(keyWork?: string): void {
    this.loading = true;
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.DISTRIBUTOR, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
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

  showModal(distributor?: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    if (distributor) {
      this.validateForm.setValue({
        id: distributor.id,
        code: distributor.code,
        name: distributor.name,
        email: distributor.email,
        phone: this.scriptFC.formatPhone(distributor.phone),
        status: distributor.status,
        address: distributor.address,
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
        data.type = USER_TYPE.DISTRIBUTOR;
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
