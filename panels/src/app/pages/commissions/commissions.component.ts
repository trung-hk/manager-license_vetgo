import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TYPE_COMMISSION} from "../../Constants/vg-constant";
import {FormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {
  COMMISSION_ACCUMULATE_FORM,
  COMMISSION_FORM,
} from "../../Constants/Form";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Message} from "../../Constants/message-constant";
import {Commission, CommissionAccumulates} from "../../models/Commission";
import {ResponseError} from "../../models/ResponseError";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
})
export class CommissionsComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly TYPE_COMMISSION = TYPE_COMMISSION;
  listScript = [];
  dataList: Commission[] = [];
  total: number = 1;
  loading: boolean = true;
  modalLoading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoadingDelete = false;
  isConfirmLoading = false;
  validateCommissionForm!: UntypedFormGroup;
  validateCommissionAccumulateForm!: UntypedFormGroup;
  attributeArrayForm: string = "accumulates";
  idDelete: number | string | null | undefined = -1;
  idShowModal: number | string | null | undefined = null;
  filter: Array<{ key: string; value: string[] }> | null = null;
  formAccumulates!: FormArray;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private communicationService: CommunicationService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.init();
    this.validateCommissionForm = this.fb.group(COMMISSION_FORM);
    this.validateCommissionAccumulateForm = this.fb.group({
      accumulates: this.fb.array([])
    });
    this.formAccumulates = this.validateCommissionAccumulateForm.get(this.attributeArrayForm) as FormArray;
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.commission-list'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.commission-list'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer(keyWork?: string): void {
    this.loading = true;
    const objectSelectCommission: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<Commission>>(URL.API_COMMISSION, objectSelectCommission).subscribe((data) => {
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

  showModal(commission?: Commission): void {
    this.isVisible = true;
    this.formAccumulates.clear()
    this.validateCommissionForm.reset();
    this.validateCommissionForm.controls["rate"].setValidators(Validators.required);
    this.validateCommissionForm.patchValue({
      commissionType: this.TYPE_COMMISSION.DEFAULT.value
    });
    this.modalLoading = !(!commission?.id)
    if (commission) {
      this.api.getById<Commission>(commission.id!, URL.API_COMMISSION).subscribe((data) => {
        this.validateCommissionForm.setValue({
          id: data.id,
          name: data.name,
          commissionType: data.commissionType,
          rate: data.rate
        });
        if (data.commissionType === TYPE_COMMISSION.REVENUE.value) {
          data.commissionAccumulates?.forEach(accumulates => {
            this.formAccumulates.push(this.fb.group({
              revenueFrom: [accumulates.revenueFrom],
              rate: [accumulates.rate],
            }));
          })
        }
        this.modalLoading = false;
      }, error => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
        this.modalLoading = false;
      })
    }
    this.idShowModal = commission?.id!;
  }

  handleOk(): void {
    try {
      if (this.validateCommissionForm.invalid) {
        Object.values(this.validateCommissionForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
          }
        });
        return;
      }
      this.isConfirmLoading = true;
      const data: Commission = this.validateCommissionForm.value;
      if (data.commissionType === TYPE_COMMISSION.DEFAULT.value) {
        if (!data.rate) {
          this.scriptFC.alertShowMessageError(Message.MESSAGE_SAVE_FAILED);
          this.isConfirmLoading = false;
          return;
        }
      } else {
        const dataAccumulates = this.validateCommissionAccumulateForm.value;
        let revenueFromCurrent = 0;
        let rateCurrent = 0;
        const accumulates: CommissionAccumulates[] = dataAccumulates.accumulates as CommissionAccumulates[]
       for (let accumulate of accumulates) {
         accumulate = accumulate as CommissionAccumulates;
         const revenueFrom = parseInt(accumulate.revenueFrom!);
         const rate = parseInt(accumulate.rate!);
         if (!revenueFrom || !rate || revenueFromCurrent >= revenueFrom || rateCurrent >= rate) {
           console.log(revenueFrom, rate)
           this.scriptFC.alertShowMessageError(Message.MESSAGE_SAVE_COMMISSION_FAILED);
           this.isConfirmLoading = false;
           return;
         }
         revenueFromCurrent = revenueFrom;
         rateCurrent = rate;
       }
        data.commissionAccumulates = accumulates;
      }
      if (data.id) {
        this.api.update<Commission>(data.id, data, URL.API_COMMISSION).subscribe((data) => {
          if (data.status == 400 || data.status == 409){
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
        this.api.insert<Commission>(data, URL.API_COMMISSION)
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
      this.api.delete<ResponseError>(this.idDelete, URL.API_COMMISSION).subscribe((data) => {
        if (data.status === 400) {
          this.scriptFC.alertShowMessageError(`${Message.MESSAGE_DELETE_FAILED}, ${data.message}`);
          this.isConfirmLoadingDelete = false;
        } else {
          this.loadDataFromServer();
          this.handleCancelDeletePopup();
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
          this.isConfirmLoadingDelete = false;
        }
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
        this.isConfirmLoadingDelete = false;
      });
    }
  }

  search(event: any): void {
    this.loadDataFromServer(event.target.value);
    event.target.value = "";
  }

  addCommission() {
    this.formAccumulates.push(this.fb.group(COMMISSION_ACCUMULATE_FORM));
  }

  removeField(index: number, e: MouseEvent): void {
    e.preventDefault();
    this.formAccumulates.removeAt(index)
  }

  onchangeCommissionType (value: string) {

    if (value === TYPE_COMMISSION.DEFAULT.value) {
      this.validateCommissionForm.controls["rate"].setValidators(Validators.required);
    } else {
      this.validateCommissionForm.controls["rate"].removeValidators(Validators.required);
      this.validateCommissionForm.controls["rate"].updateValueAndValidity({onlySelf: false});
    }
  }
}
