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
    static readonly URL: string = location.hostname.includes("localhost") ? ApiScriptCommonService.URL_DEV : ApiScriptCommonService.URL_PRODUCTION;
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

    // getAllUsersByType<T>(api: string, type: string, objectSelect?: ObjectSelectAll): Observable<T> {
    //     return this.getAll(`${api}/${type}`, objectSelect);
    // }
    //
    // getById<T>(id: number | string | null, api: string): Observable<T> {
    //     return this.httpClient.get<T>(`${this.url}/${api}/${id}`);
    // }
    // getCustomerByPhone(phone: number | string | null): Observable<User | ResponseError> {
    //     return this.httpClient.get<User | ResponseError>(`${this.url}/${URL.API_CUSTOMER_BY_PHONE}/${phone}`);
    // }
    // insert<T>(data: T, api: string): Observable<T | ResponseError> {
    //     return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, data);
    // }
    //
    // update<T>(id: number | string | null | undefined, data: T, api: string): Observable<T | ResponseError> {
    //     return this.httpClient.put<T | ResponseError>(`${this.url}/${api}/${id}`, data);
    // }
    //
    // delete<T>(id: number | string, api: string): Observable<T | ResponseError> {
    //     return this.httpClient.delete<T | ResponseError>(`${this.url}/${api}/${id}`);
    // }
    // payment<T>(api: string, returnURL?: string, prod?: string): Observable<T | ResponseError> {
    //     let params = new HttpParams();
    //     if (returnURL) params = params.append("returnURL", returnURL);
    //     if (prod) params = params.append("prod", prod);
    //     return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, null, {params});
    // }
}
