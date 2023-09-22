import {AfterViewInit, Component, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script.service';
import {HttpClient} from "@angular/common/http";
import {ConfigApp} from "../../models/ConfigApp";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {Constant} from "../../utils/constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Item} from "../../models/Item";

@Component({
  selector: 'app-product-service',
  templateUrl: './product-service.component.html',
})
export class ProductServiceComponent implements OnInit, AfterViewInit, OnDestroy {
  listScript = [];
  dataList: Item[] = [];
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
      firebase: [null, [Validators.required]],
      sheetId: [null, [Validators.required]],
      customer: [null],
      status: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(document.querySelector('.config'), "active");
    this.renderer.addClass(document.querySelector('.config a'), "toggled");
    this.renderer.addClass(document.querySelector('.manager-config-app'), "active");
    this.renderer.addClass(document.querySelector('.manager-config-app a'), "toggled");
    this.loadScript.addListScript(this.listScript).then();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.config'), "active");
    this.renderer.removeClass(document.querySelector('.manager-config-app'), "active");
  }

  init(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.sort);
  }
  loadDataFromServer(pageIndex: number, pageSize?: number, sort?: string): void {
    this.loading = true;
    this.api.getAll<ResponseDataGetAll<Item>>(Constant.API_ITEM, pageIndex - 1, pageSize, sort).subscribe((data => {
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
    // this.pageIndex = pageIndex

  }
  onPageIndexChange(pageIndex: number): void {
    console.log(pageIndex);
    this.pageIndex = pageIndex;
  }
  showModal(configApp?: ConfigApp): void {
    this.isVisible = true;

    if (configApp) {
      this.validateForm.setValue({
        id: configApp.id,
        firebase: configApp.firebase,
        sheetId: configApp.sheetId,
        customer: configApp.customerId,
        status: configApp.status
      });
    } else {
      this.validateForm.setValue({
        id: null,
        firebase: null,
        sheetId: null,
        customer: null,
        status: 0
      });
    }
    this.idShowModal = this.validateForm.get("id")?.value;
  }

  handleOk(): void {
    try {
      this.isConfirmLoading = true;
      if (this.validateForm.valid) {
        const data: ConfigApp = this.validateForm.value
        console.log(data);
        if (data.id) {
          this.api.update<ConfigApp>(data.id, data, Constant.API_CONFIG_APP).subscribe(() => {
            this.isVisible = false;
            this.loadDataFromServer(this.pageIndex, this.pageSize);
            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError('Lưu thất bại');
          })
        } else {
          this.api.insert<ConfigApp>(data, Constant.API_CONFIG_APP).subscribe(() => {
            this.isVisible = false;
            this.loadDataFromServer(this.pageIndex, this.pageSize);
            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
          }, (error) => {
            console.log(error);
            this.scriptFC.alertShowMessageError('Lưu thất bại');
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
    this.isConfirmLoading = false;

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
      this.api.delete(this.idDelete, Constant.API_CONFIG_APP).subscribe(() => {
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
