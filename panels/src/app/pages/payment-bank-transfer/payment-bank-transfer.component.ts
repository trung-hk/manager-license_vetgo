import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ROLES, STATUS_AGENT, STATUS_ORDER, STATUS_PAYMENT} from "../../Constants/vg-constant";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";

@Component({
  selector: 'app-payment-bank-transfer',
  templateUrl: './payment-bank-transfer.component.html',
})
export class PaymentBankTransferComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly STATUS_AGENT = STATUS_AGENT;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly STATUS_ORDER = STATUS_ORDER;
  protected readonly ROLES = ROLES;
  constructor(private loadScript: LazyLoadScriptService,) {
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript([]).then(() => {
    });
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
