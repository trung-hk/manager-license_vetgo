import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalViewCustomerData} from "../../models/ModalData";
import {ScriptCommonService} from "../../services/script-common.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-customer-details-modal',
  templateUrl: './customer-details-modal.component.html',
})
export class CustomerDetailsModalComponent implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: IModalViewCustomerData = inject(NZ_MODAL_DATA);
  customer!: User;
  constructor(public scriptFC: ScriptCommonService,) {
  }
  ngOnInit(): void {
    this.customer = this.nzModalData.customer;
  }
}
