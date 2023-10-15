import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LineBreakPipe} from "../LineBreakPipe";
import {MoneyPipe} from "../MoneyPipe";
import {ParseMoneyPipe} from "../ParseMoneyPipe";
import {PhoneFormatPipe} from "../PhoneFormatPipe";



@NgModule({
  declarations: [LineBreakPipe, MoneyPipe, ParseMoneyPipe, PhoneFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [LineBreakPipe, MoneyPipe, ParseMoneyPipe, PhoneFormatPipe]
})
export class ShareModule { }
