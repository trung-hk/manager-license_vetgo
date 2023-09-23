import {Component, OnInit, inject, AfterViewInit, OnDestroy, Renderer2} from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiCommonService } from 'src/app/services/api-common.service';
import {ConfigApp} from "../../models/ConfigApp";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {USER_TYPE} from "../../Constants/vg-constant";
import {User} from "../../models/User";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit, AfterViewInit, OnDestroy {
  listScript = [];
  dataList: ConfigApp[] = [];
  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string = "last_modified_date,desc";
  changeFirst: boolean = true;
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoading = false;
  isHorizontal = false;
  validateForm!: UntypedFormGroup;
  idDelete: number | string | null | undefined = -1;
  idShowModal: number | string | null | undefined = null;
  customerShowModal: {id: string | null | undefined, name: string | null | undefined} | null = null;

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {

  }
  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group({
      id: [null],
      realm: [null, [Validators.required]],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^\+?[0-9]{9,13}$/)]],
      status: [null, [Validators.required]],
      address: [null],
    });
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(document.querySelector('.agent'), "active");
    this.renderer.addClass(document.querySelector('.agent a'), "toggled");
    this.renderer.addClass(document.querySelector('.agent-list'), "active");
    this.renderer.addClass(document.querySelector('.agent-list a'), "toggled");
    this.loadScript.addListScript(this.listScript).then();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.agent'), "active");
    this.renderer.removeClass(document.querySelector('.agent-list'), "active");
  }

  init(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.sort);
  }

  loadDataFromServer(pageIndex: number, pageSize?: number, sort?: string): void {
    this.loading = true;
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.AGENT, pageIndex - 1, pageSize, sort).subscribe((data => {
      console.log(data)
      this.loading = false;
      this.total = data.totalElements;
      this.dataList = data.content;
    }))
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.changeFirst) {
      this.changeFirst = false;
      return;
    }
    console.log(params)
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    if (!sortField) {
      this.loadDataFromServer(this.pageIndex, this.pageSize);
      return;
    }
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder = sortOrder && sortOrder === 'ascend' ? "asc" : 'desc';
    this.sort = `${sortField},${sortOrder}`;
    this.loadDataFromServer(this.pageIndex, this.pageSize, `${sortField},${sortOrder}`);
  }
  onPageIndexChange(pageIndex: number): void {
    console.log(pageIndex);
    this.pageIndex = pageIndex;
  }
  showModal(agent?: ConfigApp): void {
    this.isVisible = true;

    if (agent) {
      this.validateForm.setValue({
        // id: agent.id,
        // realm: agent.realm,
        // code: agent.code,
        // name: agent.name,
        // email: agent.email,
        // phone: agent.phone,
        // address: agent.address,
        // status: agent.status,
      });
      // if (configApp.customerId && configApp.customerId !== "") {
      //   this.customerShowModal = {
      //     id: configApp.customerId,
      //     name: configApp.userName
      //   }
      // } else {
      //   this.customerShowModal = null;
      // }
    } else {
      this.validateForm.setValue({
        id: null,
        firebase: null,
        sheetId: null,
        customer: "",
        status: "0"
      });
      this.customerShowModal = null;
    }
    this.idShowModal = this.validateForm.get("id")?.value;
  }

  async handleOk(): Promise<void> {
    try {
      if (this.validateForm.valid) {
        this.isConfirmLoading = true;
        const data: ConfigApp = this.validateForm.value
        if (data.id) {
          await this.api.update<ConfigApp>(data.id, data, URL.API_CONFIG_APP).subscribe(() => {
            this.isVisible = false;
            this.loadDataFromServer(this.pageIndex, this.pageSize);
            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
            this.isConfirmLoading = false;
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError('Lưu thất bại');
            this.isConfirmLoading = false;
          })
        } else {
          await this.api.insert<ConfigApp>(data, URL.API_CONFIG_APP).subscribe(() => {
            this.isVisible = false;
            this.loadDataFromServer(this.pageIndex, this.pageSize);
            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
            this.isConfirmLoading = false;
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError('Lưu thất bại');
            this.isConfirmLoading = false;
          })
        }
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    } catch (error) {
      console.log(error)
      this.scriptFC.alertShowMessageError('Lưu thất bại');
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
      this.api.delete(this.idDelete, URL.API_CONFIG_APP).subscribe(() => {
        this.loadDataFromServer(this.pageIndex, this.pageSize);
        this.handleCancelDeletePopup();
        this.scriptFC.alertShowMessageSuccess('Xóa thành công');
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError('Xóa thất bại');
      })
    }

  }
}
