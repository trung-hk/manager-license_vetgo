import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseError} from "../models/ResponseError";
import {URL} from "../Constants/api-urls";
import {User} from "../models/User";
import {ObjectSelectAll} from "../models/ObjectSelectAll";
import {isEnvironmentPro} from "../Constants/vg-constant";
import {PayloadApprovePayment} from "../models/PayloadApprovePayment";
import {ConfirmCommissionApproveRequest} from "../models/ConfirmCommissionApproveRequest";
import {ObjectSelectReport} from "../models/ObjectSelectReport";
import {ChangePasswordForm} from "../Constants/Form";

@Injectable({
    providedIn: 'root'
})

export class ApiCommonService {
    URL_DEV: string = "https://api.moonpet.vn/api";
    URL_PRO: string = "https://api.phanmemvet.vn/api";
    url: string = isEnvironmentPro() ? this.URL_PRO: this.URL_DEV;
    regex = /^(?!\s*$).+/;
    constructor(private httpClient: HttpClient) {
    }

    getAll<T>(api: string, objectSelect?: ObjectSelectAll): Observable<T> {
        console.log(objectSelect)
        let params = new HttpParams();
        if (objectSelect) {
            Object.keys(objectSelect).forEach(key => {
                let value = Reflect.get(objectSelect, key);
                if (this.regex.test(value) && value != undefined) {
                    if (key === 'filter') {
                        Reflect.get(objectSelect, key)?.filter(f => f.value.length > 0)
                            .forEach(f => {
                                const v = f.value.join(",");
                                if (v != "") {
                                    params = params.append("filter", `${f.key},${v}`)
                                }
                            });
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
    getByCode<T>(code: string | null, api: string): Observable<T> {
        return this.httpClient.get<T>(`${this.url}/${api}/${code}`);
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
    updateProfileUser<T>(data: T): Observable<T | ResponseError> {
        return this.httpClient.put<T | ResponseError>(`${this.url}/${URL.API_UPDATE_PROFILE_USER}`, data);
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
    approvePayment<T>(api: string, payload: PayloadApprovePayment): Observable<T | ResponseError> {
        return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, payload);
    }
    confirmCommissionApprove<T>(api: string, payload: ConfirmCommissionApproveRequest): Observable<T | ResponseError> {
        return this.httpClient.post<T | ResponseError>(`${this.url}/${api}`, payload);
    }
    getDataReport<T>(api: string, typeReport: string, objectData: ObjectSelectReport): Observable<T> {
        let params = new HttpParams();
        if (objectData.from) params = params.append("from", objectData.from);
        if (objectData.to) params = params.append("to", objectData.to);
        return this.httpClient.get<T>(`${this.url}/${api}/${typeReport}`, {params});
    }
    changePassword<T>(dataRequest: ChangePasswordForm): Observable<T | ResponseError> {
        return this.httpClient.post<T | ResponseError>(`${this.url}/${URL.API_CHANGE_PASSWORD_USER}`, dataRequest);
    }
}
