import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    url: string = "https://dev-api.phanmemvet.vn/api";

    constructor(private httpClient: HttpClient) {
    }

    getAll<T>(pathApi: string, page?: string, size?: string, sort?: string, keyword?: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.url}/${pathApi}?page=${page}&size=${size}&sort=${sort}&keyword=${keyword}`);
    }

    getById<T>(id: string | null, pathApi: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${pathApi}/${id}`);
    }

    insert<T>(data: T, pathApi: string): Observable<T> {
        return this.httpClient.post<T>(`${this.url}/${pathApi}`, data);
    }

    update<T>(id: string | null | undefined, data: T, pathApi: string): Observable<T> {
        return this.httpClient.put<T>(`${this.url}/${pathApi}/${id}`, data);
    }

    delete<T>(id: string, pathApi: string): Observable<T> {
        return this.httpClient.delete<T>(`${this.url}/${pathApi}/${id}`);
    }
}
