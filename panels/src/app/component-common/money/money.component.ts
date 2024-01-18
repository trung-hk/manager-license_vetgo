import {Component, Input, OnInit} from '@angular/core';
import {Constant} from "../../Constants/vg-constant";

@Component({
  selector: 'vet-money',
  template: `<span>{{!content ? "" : content | mask: Constant.FORMAT_MONEY_SEPARATOR : Constant.FORMAT_MONEY_CONFIG}}</span>`,
})
export class MoneyComponent implements OnInit{
  protected readonly Constant = Constant;
  @Input() content?: string | number | null;
  constructor() { }

  ngOnInit(): void {
  }
}
