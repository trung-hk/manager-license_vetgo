import { Injectable } from '@angular/core';
import {CommunicationService} from "./communication.service";

@Injectable({
  providedIn: 'root'
})
export class ScriptCommonService {

  constructor(private communicationService: CommunicationService) { }

  alertShowMessageSuccess(title: string | null, message: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: 'alert-success', data: {title: title, message: message}});
  }
  alertShowMessageError(title: string | null, message: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: 'alert-error', data: {title: title, message: message}});
  }
}
