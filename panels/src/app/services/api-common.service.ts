import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseError} from "../models/ResponseError";
import {URL} from "../Constants/api-urls";
import {User} from "../models/User";
import {ObjectSelectAll} from "../models/ObjectSelectAll";

@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    url: string = "https://dev-api.phanmemvet.vn/api";

    constructor(private httpClient: HttpClient) {
    }

    // getAll<T>(api: string, page?: number | null, size?: number | null, sort?: string | null, filter?: Array<{
    //     key: string;
    //     value: string[]
    // }> | null, keyword?: string | null, type?: string): Observable<T> {
    //     let params = new HttpParams();
    //     if (page) params = params.append("page", page);
    //     if (size) params = params.append("size", size);
    //     if (sort) params = params.append("sort", sort);
    //     if (keyword) params = params.append("keyword", keyword);
    //     if (filter) {
    //         filter.filter(f => f.value.length > 0)
    //             .forEach(f => params = params.append("filter", `${f.key},${f.value.join(",")}`));
    //     }
    //     if (type) params = params.append("type", type);
    //     return this.httpClient.get<T>(`${this.url}/${api}`, {params});
    // }
    getAll<T>(api: string, objectSelect?: ObjectSelectAll): Observable<T> {
        let params = new HttpParams();
        if (objectSelect) {
            Object.keys(objectSelect).forEach(key => {
                let value = Reflect.get(objectSelect, key);
                if (value || !isNaN(value)) {
                    if (key === 'filter') {
                        Reflect.get(objectSelect, key)?.filter(f => f.value.length > 0)
                            .forEach(f => params = params.append("filter", `${f.key},${f.value.join(",")}`));
                    } else {
                        params = params.append(key, value);
                    }
                }
            })
        }
        return this.httpClient.get<T>(`${this.url}/${api}`, {params});
    }

    getAllUsersByType<T>(api: string, type: string, objectSelect?: ObjectSelectAll): Observable<T> {
        return this.getAll(`${api}/${type}`, objectSelect);
    }

    getById<T>(id: number | string | null, api: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${api}/${id}`);
    }
    getCustomerByPhone(phone: number | string | null): Observable<User | ResponseError> {
        return this.httpClient.get<User | ResponseError>(`${this.url}/${URL.API_CUSTOMER_BY_PHONE}/${phone}`);
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
    payment<T>(api: string, returnURL?: string, prod?: string): Observable<T | ResponseError> {
        let params = new HttpParams();
        if (returnURL) params = params.append("returnURL", returnURL);
        if (prod) params = params.append("prod", prod);
        return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, null, {params});
    }
}
