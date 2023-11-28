import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LineBreakPipe} from "../LineBreakPipe";
import {MoneyPipe} from "../MoneyPipe";
import {ParseMoneyPipe} from "../ParseMoneyPipe";
import {PhoneFormatPipe} from "../PhoneFormatPipe";
import {SplitCommanPipe} from "../SplitCommanPipe";
import {ReplaceParamPipe} from "../ReplaceParamPhonePipe";



@NgModule({
  declarations: [LineBreakPipe, MoneyPipe, ParseMoneyPipe, PhoneFormatPipe, SplitCommanPipe, ReplaceParamPipe],
  imports: [
    CommonModule
  ],
  exports: [LineBreakPipe, MoneyPipe, ParseMoneyPipe, PhoneFormatPipe, SplitCommanPipe, ReplaceParamPipe]
})
export class ShareModule { }
