import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {ConfigPhoneCsZalo, PackagePurchased} from "../../models/PackagePurchased";
import {format} from "date-fns";
import {CONFIG, Constant} from "../../Constants/vg-constant";
import {Item} from "../../models/Item";

@Component({
  selector: 'app-package-purchased',
  templateUrl: './package-purchased.component.html',
})
export class PackagePurchasedComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly CONFIG = CONFIG;
  listScript = [];
  loading: boolean = false;
  dataList: PackagePurchased[] = []
  item_CS_ZALO_EXPAND: Item = {}
  item_CS_ZALO_TIME_EXTENSION: Item = {}
  dataPhoneList_CS_ZALO: ConfigPhoneCsZalo[] = []

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,) {
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.package-purchased'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.package-purchased'), "active");
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    let loading_success_3 = false;
    this.api.getAll<ResponseDataGetAll<PackagePurchased>>(URL.API_PACKAGE_PURCHASED).subscribe((data) => {
      loading_success_1 = true;
      this.dataList = data.content.map(d => {
        d.attributeObject = this.scriptFC.convertAttributeStringToObjectForPackagePurchased(d.attributes);
        // Xử lý data cho gói CS_ZALO
        if (d.attributeObject.usingConfig == CONFIG.CS_ZALO.value)  {
          const phones: ConfigPhoneCsZalo[] | undefined = d.attributeObject?.data?.phones;
          d.quantityRegisterPhone = 0;
          d.quantityNotExpiredPhone = 0;
          if (phones) {
            d.quantityRegisterPhone = phones.length;
            d.quantityNotExpiredPhone = phones.length;
            this.dataPhoneList_CS_ZALO = phones.map(phone => {
              const expiredDate = new Date(phone.expiredDate!);
              phone.expiredDate = format(expiredDate, 'yyyy/MM/dd');
              phone.quantityDateUsing = this.scriptFC.getDayDiff(new Date(), expiredDate);
              if (phone.quantityDateUsing <= 0) d.quantityNotExpiredPhone!--;
              return phone;
            });
          }
        // Xử lý data cho các gói khác
        } else {
          const expiredDate = new Date(d.expiredDate!);
          d.expiredDate = format(expiredDate, 'yyyy/MM/dd');
          d.quantityDateUsing = this.scriptFC.getDayDiff(new Date(), expiredDate);
        }
        return d;
      });
      this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
    this.api.getByCode<Item>(CONFIG.CS_ZALO_EXPAND.value, URL.API_ITEM_BY_CODE).subscribe((data) => {
      loading_success_2 = true;
      this.item_CS_ZALO_EXPAND = data;
      this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
    this.api.getByCode<Item>(CONFIG.CS_ZALO_TIME_EXTENSION.value, URL.API_ITEM_BY_CODE).subscribe((data) => {
      loading_success_3 = true;
      this.item_CS_ZALO_TIME_EXTENSION = data;
      this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
  }

  protected readonly Constant = Constant;
}
