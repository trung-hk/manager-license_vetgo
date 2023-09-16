import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    url: string = "https://dev-api.phanmemvet.vn/api";

    constructor(private httpClient: HttpClient) {
    }

    getAll<T>(api: string, page?: string, size?: string, sort?: string, keyword?: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.url}/${api}?page=${page}&size=${size}&sort=${sort}&keyword=${keyword}`);
    }

    getById<T>(id: string | null, api: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${api}/${id}`);
    }

    insert<T>(data: T, api: string): Observable<T> {
        return this.httpClient.post<T>(`${this.url}/${api}`, data);
    }

    update<T>(id: string | null | undefined, data: T, api: string): Observable<T> {
        return this.httpClient.put<T>(`${this.url}/${api}/${id}`, data);
    }

    delete<T>(id: string, api: string): Observable<T> {
        return this.httpClient.delete<T>(`${this.url}/${api}/${id}`);
    }
}
