import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vet-status-info',
  template: `<nz-tag [nzColor]="'blue'">{{content}}</nz-tag>`,
})
export class InfoComponent implements OnInit{
  @Input() content?: string
  constructor() { }

  ngOnInit(): void {
  }
}
