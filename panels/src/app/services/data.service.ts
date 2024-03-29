import { Injectable } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
export interface PaymentBankTransferData {
  backUrl: string,
  typePayment: string
}
export interface PaymentCompleteDetailsData {
  backUrl: string,
  typePayment: string
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any;

  constructor(private router: Router) {}

  setData(data: any) {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }

  navigateToPage(url: string) {
    const navigationExtras: NavigationExtras = {
      // skipLocationChange: true // Điều này sẽ không thêm lịch sử trình duyệt mới
    };
    this.router.navigateByUrl(url, navigationExtras);
  }
}
