import {EventEmitter, Inject, Injectable, Type} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {DOCUMENT} from "@angular/common";
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private events: Map<string, EventEmitter<any>> = new Map<
    string,
    EventEmitter<any>
  >();
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}
  sendEventToJs(actionType: string, data: any): void {
    console.log('action type' , actionType);
    console.log('send angular to js : ', data);
    this.document.dispatchEvent(new CustomEvent('vetgo-event-out', { detail: { actionType, data } }));
  }
  pushChange<T>(key: string, value: T): void {
    if (!this.events.has(key)) {
      this.events.set(key, new EventEmitter<T>());
    }
    (this.events.get(key) as EventEmitter<T>).next(value);
  }
  listenChange<T>(name: string): Observable<T> {
    if (!this.events.has(name)) {
      this.events.set(name, new EventEmitter<T>());
    }
    return (this.events.get(name) as Subject<T>).pipe(tap((k) => {}));
  }
  unsubscribeChange(nameArr: Array<string>): void {
    if (!nameArr || nameArr.length === 0) {
      return;
    }
    if (Array.isArray(nameArr)) {
      nameArr.forEach((name) => {
        this.deleteEvents(name);
      });
    } else {
      this.deleteEvents(nameArr);
    }
  }
  deleteEvents<T>(name: string): void {
    if (this.events.has(name)) {
      const subscription = this.events.get(name);
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
        this.events.delete(name);
      }
    }
  }
}
