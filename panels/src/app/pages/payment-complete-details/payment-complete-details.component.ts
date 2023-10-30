import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";

@Component({
  selector: 'app-payment-complete-details',
  templateUrl: './payment-complete-details.component.html',
})
export class PaymentCompleteDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
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
