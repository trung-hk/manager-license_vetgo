import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LineBreakPipe} from "../LineBreakPipe";
import {SplitCommanPipe} from "../SplitCommanPipe";
import {ReplaceParamPipe} from "../ReplaceParamPipe";



@NgModule({
  declarations: [LineBreakPipe, SplitCommanPipe, ReplaceParamPipe],
  imports: [
    CommonModule
  ],
  exports: [LineBreakPipe, SplitCommanPipe, ReplaceParamPipe]
})
export class ShareModule { }
