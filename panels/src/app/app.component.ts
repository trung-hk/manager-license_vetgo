import {AfterViewInit, Component, Inject} from '@angular/core';
import {CommunicationService} from "./services/communication.service";
import {DOCUMENT} from "@angular/common";
import {isEnvironmentPro} from "./Constants/vg-constant";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{
  constructor(@Inject(DOCUMENT) private readonly document: Document ,private communicationService: CommunicationService) {}
  ngAfterViewInit(): void {
    // document.dispatchEvent(new CustomEvent('vetgo-event-in', { detail: { key: 'value' } }));
    this.document.addEventListener('vetgo-event-in', (event: any) => {
        console.log( 'angular receiver from js: ' , event.detail);
       if(event.detail) {
         this.communicationService.pushChange(event.detail.actionType, event.detail.data);
       }
    })
  }
}
