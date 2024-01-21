import {Component, Input, OnInit} from '@angular/core';
import { Constant } from 'src/app/Constants/vg-constant';

@Component({
  selector: 'vet-phone',
  template: `<span>{{!content ? "" : content | mask: Constant.FORMAT_PHONE : Constant.FORMAT_DEFAULT_CONFIG}}</span>`,
})
export class PhoneComponent implements OnInit{
  protected readonly Constant = Constant;
  @Input() content?: string | number | null;
  constructor() { }

  ngOnInit(): void {
  }
}
