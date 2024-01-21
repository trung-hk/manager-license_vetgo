import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vet-status-danger',
  template: `<nz-tag [nzColor]="'red'">{{content}}</nz-tag>`,
})
export class DangerComponent implements OnInit{
  @Input() content?: string
  constructor() { }

  ngOnInit(): void {
  }
}
