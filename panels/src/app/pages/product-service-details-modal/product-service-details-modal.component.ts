import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalViewProductServiceData} from "../../models/ModalData";
import {Item} from "../../models/Item";
import {ScriptCommonService} from "../../services/script-common.service";
import {PackageProduct} from "../../models/PackageProduct";

@Component({
  selector: 'app-product-service-details-modal',
  templateUrl: './product-service-details-modal.component.html',
})
export class ProductServiceDetailsModalComponent implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: IModalViewProductServiceData = inject(NZ_MODAL_DATA);
  product!: Item;
  packages!: PackageProduct[];
  constructor(public scriptFC: ScriptCommonService,) {
  }
  ngOnInit(): void {
    this.product = this.nzModalData.product;
    this.packages = this.scriptFC.getPackageService(this.product.attributes);
  }

}
