import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {REALM} from "../Constants/vg-constant";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('https://script.google.com')) {
      request = request.clone({
        setHeaders: { realm: REALM()}
      });
    }
    return next.handle(request);
  }
}
