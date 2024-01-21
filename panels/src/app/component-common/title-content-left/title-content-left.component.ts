import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vet-title-content-left',
  template: `<ng-content></ng-content>
            <nz-tag *ngIf="quantity" [nzColor]="color">
                <nz-statistic [nzValueStyle]="{'font-size': 'unset'}" [nzValue]="(quantity | number)!"></nz-statistic>
            </nz-tag>`,
})
export class TitleContentLeftComponent implements OnInit{
  @Input() quantity?: number;
  @Input() color?: string = '#33CCFF';
  constructor() { }
  ngOnInit(): void {
  }

}
