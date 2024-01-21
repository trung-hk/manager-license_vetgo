import {Component, Input, OnInit} from '@angular/core';
import { Constant } from 'src/app/Constants/vg-constant';

@Component({
  selector: 'vet-percent',
  template: `<nz-statistic [nzValue]="(content | number: '1.0-2')!"
                           [nzSuffix]="'%'"
                           [nzValueStyle]="{ color: '#3F8600', 'font-size': '14px' }">
             </nz-statistic>`,
})
export class PercentComponent implements OnInit{
  protected readonly Constant = Constant;
  @Input() content?: string | number | null;
  constructor() { }

  ngOnInit(): void {
  }
}
