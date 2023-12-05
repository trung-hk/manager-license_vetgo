import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {mergeMap, Observable, retryWhen, throwError, timer} from "rxjs";
import {CallScriptObject} from "../models/CallScriptObject";

@Injectable({
    providedIn: 'root'
})

export class ApiScriptCommonService {
    static readonly URL_PRODUCTION: string = "https://script.google.com/macros/s/AKfycbxB-8oQowVVDen9WhD44QEja8cm_lFtQc3Sc_0dCEHkNhCFzo8hTlNVUCkagA6ms5cGKg/exec";
    static readonly  URL_DEV: string = "https://script.google.com/macros/s/AKfycbzC9sSxdtHmTpbzOBMNcOwBV8D36PUOEehuM4XlKe2_B9eNhmrJOf8LRWIv-nYN2LG4/exec";
    static readonly URL: string = window.location.origin.startsWith("http://localhost") ? ApiScriptCommonService.URL_DEV : ApiScriptCommonService.URL_PRODUCTION;
    regex = /^(?!\s*$).+/;
    headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    constructor(private httpClient: HttpClient) {
    }

    callAPI<T>(data: CallScriptObject): Observable<T> {
        if (!data.csrfToken) data.csrfToken = "VETGODEV";
        let retryAttempts = 0;
        return this.httpClient.post<T>(ApiScriptCommonService.URL, JSON.stringify(data), { headers: this.headers }).pipe(
            retryWhen(errors =>
                errors.pipe(
                    mergeMap(error => {
                        if (++retryAttempts <= 5) {
                            console.log(`Retry attempt #${retryAttempts}`);
                            return timer(3000);
                        }
                        return throwError('Max retry attempts reached');
                    })
                )
            )
        );
    }
}
