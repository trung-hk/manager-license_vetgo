import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const fullURL = window.location.href
    const domainRegex = new RegExp('.phanmemvet.vn(.*)', 'g');
    const  storedCorporate = fullURL.replace(domainRegex, '')
        .replace(/localhost(.*)/g, '')
        .replace(/^http(.*):\/\//g, '')
        .replace(/\./g, '');
    console.log( "brand id: " +  storedCorporate);
    let realm  = 'phanmemvet';
    if (storedCorporate) {
      realm = storedCorporate;
    }
    if (window.location.href.startsWith('https://phanmemvet.vn')) {
      realm  = 'phanmemvet';
    }
    request = request.clone({
      setHeaders: { realm: realm}
    });
    return next.handle(request);
  }
}
