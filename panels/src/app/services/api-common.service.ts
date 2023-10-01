import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseError} from "../models/ResponseError";
@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    url: string = "https://dev-api.phanmemvet.vn/api";

    constructor(private httpClient: HttpClient) {
    }

    getAll<T>(api: string, page?: number, size?: number, sort?: string | null, filter?: Array<{ key: string; value: string[] }> | null, keyword?: string | null): Observable<T> {
        let params = new HttpParams()
        .append("page", page ? page : 0)
        .append("size", size ? size : 10)
        .append("sort", sort ? sort : '')
        if (keyword) params = params.append("keyword", keyword);
        if (filter) {
            filter.filter(f => f.value.length > 0)
                .forEach(f => params = params.append("filter", f.value.join(",")));
        }
        return this.httpClient.get<T>(`${this.url}/${api}`, {params});
    }
    getAllUsersByType<T>(api: string, type: string, page?: number, size?: number, sort?: string | null, filter?: Array<{ key: string; value: string[] }> | null, keyword?: string | null): Observable<T> {
        return this.getAll(`${api}/${type}`, page, size, sort, filter, keyword);
    }

    getById<T>(id: number | string | null, api: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${api}/${id}`);
    }

    insert<T>(data: T, api: string): Observable<T | ResponseError> {
        return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, data);
    }

    update<T>(id: number | string | null | undefined, data: T, api: string): Observable<T | ResponseError> {
        return this.httpClient.put<T | ResponseError>(`${this.url}/${api}/${id}`, data);
    }

    delete<T>(id: number | string, api: string): Observable<T | ResponseError> {
        return this.httpClient.delete<T | ResponseError>(`${this.url}/${api}/${id}`);
    }
}
