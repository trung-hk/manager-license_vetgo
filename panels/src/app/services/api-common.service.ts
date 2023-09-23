import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    url: string = "https://dev-api.phanmemvet.vn/api";

    constructor(private httpClient: HttpClient) {
    }

    getAll<T>(api: string, page?: number, size?: number, sort?: string, keyword?: string): Observable<T> {
        let params = new HttpParams()
        .append("page", page ? page : 0)
        .append("size", size ? size : 10)
        .append("sort", sort ? sort : '')
        .append("keyword", keyword ? keyword : "")
        return this.httpClient.get<T>(`${this.url}/${api}`, {params});
    }
    getAllUsersByType<T>(api: string, type: string, page?: number, size?: number, sort?: string, keyword?: string): Observable<T> {
        return this.getAll(`${api}/${type}`, page, size, sort, keyword);
    }

    getById<T>(id: number | string | null, api: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${api}/${id}`);
    }

    insert<T>(data: T, api: string): Observable<T> {
        return this.httpClient.post<T>(`${this.url}/${api}`, data);
    }

    update<T>(id: number | string | null | undefined, data: T, api: string): Observable<T> {
        return this.httpClient.put<T>(`${this.url}/${api}/${id}`, data);
    }

    delete<T>(id: number | string, api: string): Observable<T> {
        return this.httpClient.delete<T>(`${this.url}/${api}/${id}`);
    }
}
