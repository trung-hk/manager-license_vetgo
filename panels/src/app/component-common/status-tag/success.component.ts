import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vet-status-success',
  template: `<nz-tag [nzColor]="'green'">{{content}}</nz-tag>`,
})
export class SuccessComponent implements OnInit{
  @Input() content?: string
  constructor() { }

  ngOnInit(): void {
  }
}
