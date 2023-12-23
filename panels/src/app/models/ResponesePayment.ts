import {OrderService} from "./OrderService";

export interface ResponsePaymentMoMo{
    url?: string | null,
    status?: string | null
}
interface requestJsonObject {
    accountName: string,
    accountNo: string,
    acqId: string,
    addInfo: string,
    amount: string,
    format: string,
    template: string,
}
export interface ResponsePaymentVietQR{
    url?: string,
    status?: string | null,
    qrCode?: string,
    requestJson?: string,
    requestJsonObject?: requestJsonObject,
}

