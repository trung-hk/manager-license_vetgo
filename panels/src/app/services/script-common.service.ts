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
    this.communicationService.sendEventToJs("ScriptComponent", {event: "alert-error", data:{title: title, message: message}})
    // this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "red"} });
  }
  formatPhone(value: string | null | undefined): string | null {
    value = this.convertInputFormatToNumber(value);
    if (!value) return null;
    if (value.length <= 3) {
      return `${value.slice(0, 3)}`;
    }
    if (value.length > 3 && value.length <=6) {
      return `(${value.slice(0, 3)}) ${value.slice(3, 6)}`;
    }
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }
  convertInputFormatToNumber(value: string | null | undefined): string | null {
    return value ? value.replace(/\D/g, "") : null;
  }
}
