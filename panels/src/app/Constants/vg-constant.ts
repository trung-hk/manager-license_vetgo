export interface Enum {
    text: string;
    value: string;
}
export class STATUS_CONFIG {
    static readonly IN_ACTIVE: Enum = {text: "Chưa kích hoạt", value: "IN_ACTIVE"};
    static readonly PENDING_ACTIVE: Enum = {text: "Chờ kích hoạt", value: "PENDING_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đã kích hoạt", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.PENDING_ACTIVE, this.ACTIVATED]
}
export enum USER_TYPE {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    DISTRIBUTOR = "DISTRIBUTOR",
    PARTNER = "PARTNER",
    CUSTOMER = "CUSTOMER"
}

export class Constant {
    static readonly API_CONFIG_SYSTEM_LIST: string[] = ["TIME_ACTIVE", "CONFIG_BROWSER"];
}
export class STATUS_AGENT {
    static readonly IN_ACTIVE: Enum = {text: "Ngừng hoạt động", value: "IN_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đang hoạt động", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.ACTIVATED];
}

export class STATUS_DISTRIBUTOR {
    static readonly IN_ACTIVE: Enum = {text: "Ngừng hoạt động", value: "IN_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đang hoạt động", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.ACTIVATED];
}
export class STATUS_PARTNER {
    static readonly IN_ACTIVE: Enum = {text: "Ngừng hoạt động", value: "IN_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đang hoạt động", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.ACTIVATED];
}
export class STATUS_CUSTOMER {
    static readonly IN_ACTIVE: Enum = {text: "Ngừng hoạt động", value: "IN_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đang hoạt động", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.ACTIVATED];
}
export enum ROLES {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    DISTRIBUTOR = "DISTRIBUTOR",
    PARTNER = "PARTNER",
    CUSTOMER = "CUSTOMER"
}

export class STATUS_PRODUCT_SERVICE {
    static readonly UN_DEPLOYED: Enum = {text: "Chưa triển khai", value: "UN_DEPLOYED"};
    static readonly DEPLOYED: Enum = {text: "Đã triển khai", value: "DEPLOYED"};
    static readonly LIST: Enum[] = [this.UN_DEPLOYED, this.DEPLOYED];
}

export enum TYPE_PRODUCT {
    SERVICE_PRODUCT = "SERVICE_PRODUCT",
    SALES_PRODUCT = "SALES_PRODUCT"
}

export class STATUS_AGENT_PRODUCT {
    static readonly UN_REGISTERED: Enum = {text: "Chưa đăng ký", value: "UN_REGISTERED"};
    static readonly REGISTERED: Enum = {text: "Đã đăng ký", value: "REGISTERED"};
    static readonly LIST: Enum[] = [this.UN_REGISTERED, this.REGISTERED];
}
export class STATUS_PAYMENT {
    static readonly UN_PAID: Enum = {text: "Chưa thanh toán", value: "UNPAID"};
    static readonly PAID: Enum = {text: "Đã thanh toán", value: "PAID"};
    static readonly LIST: Enum[] = [this.UN_PAID, this.PAID];
}
export class STATUS_ORDER {
    static readonly IN_PROCESS: Enum = {text: "Đang tiến hành", value: "IN_PROCESS"};
    static readonly FINISHED: Enum = {text: "Đã hoàn thành", value: "FINISHED"};
    static readonly CANCEL_ORDER: Enum = {text: "Đã hủy đơn", value: "CANCEL_ORDER"};
    static readonly LIST: Enum[] = [this.IN_PROCESS, this.FINISHED, this.CANCEL_ORDER];
}
export class TYPE_EXPIRED_PACKAGE {
    static readonly DAY: Enum = {text: "Ngày", value: "day"};
    static readonly MONTH: Enum = {text: "Tháng", value: "month"};
    static readonly YEAR: Enum = {text: "Năm", value: "year"};
    static readonly LIST: Enum[] = [this.DAY, this.MONTH, this.YEAR];
}
export class TYPE_PACKAGE {
    static readonly FREE: Enum = {text: "Không trả phí", value: "FREE"};
    static readonly PAYMENT: Enum = {text: "Trả phí", value: "PAYMENT"};
    static readonly LIST: Enum[] = [this.FREE, this.PAYMENT];
}
export enum MODE_DISPLAY {
    PC = "PC",
    MOBILE = "MOBILE"
}
export class CONFIG {
    static readonly NOT_USING: Enum = {text: "Không sử dụng", value: "NOT_USING"};
    static readonly VET_APP: Enum = {text: "VET-APP", value: "VET_APP"};
    static readonly CS_ZALO: Enum = {text: "CS-ZALO", value: "CS_ZALO"};
    static readonly ADMIN_ONLINE_SHOP: Enum = {text: "ADMIN-ONLINE-SHOP", value: "ADMIN_ONLINE_SHOP"};
    static readonly WIFI_MARKETING: Enum = {text: "WIFI-MARKETING", value: "WIFI_MARKETING"};
    static readonly POS: Enum = {text: "POS", value: "POS"};
    static readonly SPA: Enum = {text: "SPA", value: "SPA"};
    static readonly CONFIG_LIST: Enum[] = [
        this.NOT_USING,
        this.VET_APP,
        this.CS_ZALO,
        this.ADMIN_ONLINE_SHOP,
        this.WIFI_MARKETING,
        this.POS,
        this.SPA]
}
export class TYPE_COMMISSION {
    static readonly DEFAULT: Enum = {text: "Theo sản phẩm", value: "DEFAULT"};
    static readonly REVENUE: Enum = {text: "Theo doanh thu", value: "REVENUE"};
    static readonly LIST: Enum[] = [this.DEFAULT, this.REVENUE];
}
export enum STATUS_CODE_ERROR {
    ERROR_400 = '400',
    ERROR_404 = '404',
    ERROR_409 = '409'
}
export const ERROR_LIST: string[] = [STATUS_CODE_ERROR.ERROR_400,
    STATUS_CODE_ERROR.ERROR_404,
    STATUS_CODE_ERROR.ERROR_409]
export enum MODE_OPEN_MODAL_FORM_ORDER_SERVICE {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    ADD_CONFIG = "ADD_CONFIG"
}
export class TYPE_LICENSE {
    static readonly TRIAL: Enum = {text: "Bản dùng thử", value: "Trial"};
    static readonly PRO: Enum = {text: "Bản Pro", value: "Pro"};
    static readonly LIST: Enum[] = [this.TRIAL, this.PRO];
}