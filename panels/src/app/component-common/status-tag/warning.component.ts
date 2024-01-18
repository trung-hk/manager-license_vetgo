import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vet-status-warning',
  template: `<nz-tag [nzColor]="'yellow'">{{content}}</nz-tag>`,
})
export class WarningComponent implements OnInit{
  @Input() content?: string
  constructor() { }

  ngOnInit(): void {
  }
}
