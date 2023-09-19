import {Injectable, TemplateRef} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";

@Injectable({
  providedIn: 'root'
})
export class ScriptCommonService {
  constructor(private notificationService: NzNotificationService) { }

  alertShowMessageSuccess(notificationTemplate: TemplateRef<any>, message: string): void {
    this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "green"} });
  }
  alertShowMessageError(notificationTemplate: TemplateRef<any>, message: string): void {
    this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "red"} });
  }
}
