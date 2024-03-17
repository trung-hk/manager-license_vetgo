import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalViewCustomerData} from "../../models/ModalData";
import {ScriptCommonService} from "../../services/script-common.service";
import {User} from "../../models/User";
import {Constant} from "../../Constants/vg-constant";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";

@Component({
  selector: 'app-customer-details-modal',
  templateUrl: './customer-details-modal.component.html',
})
export class CustomerDetailsModalComponent implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: IModalViewCustomerData = inject(NZ_MODAL_DATA);
  customer?: User;
  loading: boolean = true;
  constructor(public scriptFC: ScriptCommonService,
              private api: ApiCommonService) {
  }
  ngOnInit(): void {
    this.api.getById<User>(this.nzModalData.idUser, URL.API_USER).subscribe(data => {
      console.log(data)
      this.customer = data;
      this.customer.wifiMarketingDTOs?.forEach(wifiDTO => {
        wifiDTO.attributesObject = JSON.parse(wifiDTO.attributes!);
      })
      console.log(this.customer)
      this.loading = false;
    })

  }

    protected readonly Constant = Constant;
}
