import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LineBreakPipe} from "../LineBreakPipe";
import {MoneyPipe} from "../MoneyPipe";
import {ParseMoneyPipe} from "../ParseMoneyPipe";



@NgModule({
  declarations: [LineBreakPipe, MoneyPipe, ParseMoneyPipe],
  imports: [
    CommonModule
  ],
  exports: [LineBreakPipe, MoneyPipe, ParseMoneyPipe]
})
export class ShareModule { }
