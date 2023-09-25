import {Injectable} from '@angular/core';
import {CommunicationService} from "./communication.service";

@Injectable({
  providedIn: 'root'
})
export class ScriptCommonService {
  constructor(private communicationService: CommunicationService) { }

  alertShowMessageSuccess(message: string, title?: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: "alert-success", data:{title: title, message: message}});
    // this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "green"} });
  }
  alertShowMessageError(message?: string, title?: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: "alert-success", data:{title: title, message: message}})
    // this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "red"} });
  }
  formatPhone(value: string | null | undefined) {
    if (!value) return "";
    return '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
  }
}
