import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {User} from "../../models/User";
import {BehaviorSubject, debounceTime, distinctUntilChanged} from "rxjs";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {
    Constant,
    MODE_DISPLAY,
    ROLES, STATUS_CUSTOMER,
    USER_TYPE
} from "../../Constants/vg-constant";
import {USER_FORM} from "../../Constants/Form";
import {ResponseError} from "../../models/ResponseError";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly ROLES = ROLES;
  protected readonly MODE_DISPLAY = MODE_DISPLAY;
  protected readonly STATUS_CUSTOMER = STATUS_CUSTOMER;
  listScript = [];
  dataList: User[] = [];
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoadingDelete = false;
  isConfirmLoading = false;
  userDelete: User | null | undefined = null;
  selectUser: string = "";
  private searchSubject = new BehaviorSubject<string>('');
  nzFilterOption = (): boolean => true;
  modeView!: string;
  validateForm!: UntypedFormGroup;
  childrenIdFilter!: string;

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder,
              private viewContainerRef: ViewContainerRef,
              private elRef: ElementRef,) {
    super()
  }
  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  ngOnInit() {
    this.modeView = this.elRef.nativeElement.offsetWidth < 765 ? MODE_DISPLAY.MOBILE : MODE_DISPLAY.PC;
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.customers'), "active");
    });
    window.addEventListener('resize', () => {
      this.modeView = this.elRef.nativeElement.offsetWidth < 765 ? MODE_DISPLAY.MOBILE : MODE_DISPLAY.PC;
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.customers'), "active");
  }

  init(): void {
    this.loadDataFromServer();
    this.validateForm = this.fb.group(USER_FORM);
  }

  loadDataFromServer(from?: string, to?: string, keyWork?: string): void {
    this.loading = true;
    const objectSelectUser: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork, childrenId: this.childrenIdFilter}
    this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.CUSTOMER, objectSelectUser).subscribe((data) => {
      console.log(data)
      this.total = data.totalElements;
      this.dataList = data.content;
      this.loading = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
  }
  handleOk(): void {
    try {
      if (this.validateForm.valid) {
        this.isConfirmLoading = true;
        this.validateForm.get("code")?.enable();
        const data: User = this.validateForm.value
        data.type = USER_TYPE.CUSTOMER;
        if (data.id) {
          this.api.update(data.id, data, URL.API_USER).subscribe((data) => {
            if (this.scriptFC.validateResponseAPI(data.status)) {
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
  showModal(customer: User): void {
    this.isVisible = true;
    this.validateForm.clearValidators();
    this.validateForm.setValue({
      id: customer.id,
      code: customer.code,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      address: customer.address,
      commissionId: customer.commissionId
    });
    this.validateForm.get("code")?.disable();
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteModal(user: User) {
    this.isVisibleDelete = true;
    this.userDelete = user;
  }

  handleCancelDeletePopup(): void {
    this.isVisibleDelete = false;
    this.userDelete = null;
  }

  handleConfirmToDelete() {
    if (this.userDelete) {
      this.isConfirmLoadingDelete = true;
      this.api.delete<User>(this.userDelete?.id!, URL.API_USER).subscribe((data) => {
        if (data.status === 400 || data.status === 409) {
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_FAILED);
          this.isConfirmLoadingDelete = false;
        } else {
          this.loadDataFromServer();
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
          this.isConfirmLoadingDelete = false;
        }
        this.handleCancelDeletePopup();
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
        this.isConfirmLoadingDelete = false;
      });
    }
  }
  filterOrder(e: string) {
    this.setFilter(e).then(() => {
      this.loadDataFromServer();
    })
  }
  setFilter(value: string): Promise<void> {
    return new Promise( rs => {
      this.scriptFC.hasPermission(ROLES.ADMIN).then(result => {
        if (result) {
          this.filter = [{key: "vu.realm", value: [value]}];
          rs();
        }
      })
      this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
        if (result) {
          this.childrenIdFilter = value;
          rs();
        }
      })
      this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
        if (result) {
          this.childrenIdFilter = value;
          rs();
        }
      })
    })
  }
  createComponentModalViewCustomer(idUser: string) {

    this.scriptFC.createComponentModalViewCustomerDetails(idUser, this.viewContainerRef);
  }

    protected readonly Constant = Constant;
}
