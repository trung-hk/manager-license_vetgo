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
    static readonly FORMAT_MONEY_SEPARATOR = "separator";
    static readonly FORMAT_MONEY_CONFIG = {thousandSeparator:',', suffix: ' VNĐ'};
    static readonly FORMAT_DEFAULT_CONFIG = {suffix: ''};
    static readonly FORMAT_PHONE: string = "(000) 000-0000";
    static readonly EXTENSION_DOMAIN_PRO = 'phanmemvet.vn';
    static readonly EXTENSION_DOMAIN_DEV = 'moonpet.vn';
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
    static readonly IN_PAYMENT: Enum = {text: "Đang thanh toán", value: "IN_PAYMENT"};
    static readonly PAID: Enum = {text: "Đã thanh toán", value: "PAID"};
    static readonly LIST: Enum[] = [this.UN_PAID, this.PAID, this.IN_PAYMENT];
}
export class STATUS_ORDER {
    static readonly IN_PROCESS: Enum = {text: "Đang tiến hành", value: "IN_PROCESS"};
    static readonly FINISHED: Enum = {text: "Đã hoàn thành", value: "FINISHED"};
    static readonly CANCEL_ORDER: Enum = {text: "Đã hủy đơn", value: "CANCEL_ORDER"};
    static readonly LIST: Enum[] = [this.IN_PROCESS, this.FINISHED, this.CANCEL_ORDER];
}
export class TYPE_PACKAGE {
    static readonly DAY: Enum = {text: "Ngày", value: "day"};
    static readonly MONTH: Enum = {text: "Tháng", value: "month"};
    static readonly YEAR: Enum = {text: "Năm", value: "year"};
    static readonly LIST: Enum[] = [this.DAY, this.MONTH, this.YEAR];
}
export class TYPE_PAYMENT_PACKAGE {
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
    static readonly CS_ZALO_EXPAND: Enum = {text: "Thêm tài khoản ZALO", value: "CS_ZALO_EXPAND"};
    static readonly CONFIG_LIST: Enum[] = [
        this.NOT_USING,
        this.VET_APP,
        this.CS_ZALO,
        this.ADMIN_ONLINE_SHOP,
        this.WIFI_MARKETING,
        this.POS,
        this.SPA,
        this.CS_ZALO_EXPAND,
    ];
    static readonly CONFIG_LIST_DIRECT_SALES: string[] = [
        this.CS_ZALO_EXPAND.value,
    ]
}
export enum MODE_ORDER {
    FROM_CUSTOMER = "FROM_CUSTOMER",
    FROM_CUSTOMER_CS_ZALO = "FROM_CUSTOMER_CS_ZALO",
    FROM_CUSTOMER_CS_ZALO_EXPAND = "FROM_CUSTOMER_CS_ZALO_EXPAND",
}
export class TYPE_COMMISSION {
    static readonly DEFAULT: Enum = {text: "Cố định", value: "DEFAULT"};
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
    ADD_CONFIG = "ADD_CONFIG",
    CUSTOMER_ORDER = "CUSTOMER_ORDER"
}
export class TYPE_LICENSE {
    static readonly TRIAL: Enum = {text: "Bản dùng thử", value: "Trial"};
    static readonly PRO: Enum = {text: "Bản Pro", value: "Pro"};
    static readonly LIST: Enum[] = [this.TRIAL, this.PRO];
}
export const REALM = (): string => {
    const fullURL = window.location.origin;
    const domainRegex = new RegExp('(.phanmemvet.vn(.*)|.moonpet.vn(.*))', 'g');
    const  storedCorporate = fullURL.replace(domainRegex, '')
        .replace(/localhost(.*)/g, '')
        .replace(/^http(.*):\/\//g, '')
        .replace(/\./g, '');
    console.log( "brand id: " +  storedCorporate);
    let realm = 'portal';
    if (storedCorporate) {
        realm = storedCorporate;
    }
    if (fullURL.startsWith('https://phanmemvet.vn') || fullURL.startsWith('https://moonpet.vn')) {
        realm = 'portal';
    }
    return realm;
}
export enum TYPE_ORDER_SERVICE {
    PARTNER_ORDER = "PARTNER_ORDER",
    RENEW_PACKAGE = "RENEW_PACKAGE",
    CUSTOMER_ORDER = "CUSTOMER_ORDER",
}
export class TYPE_REFERENCE_PAYMENT {
    static readonly PAYMENT_ORDER_PRODUCT: Enum = {text: "Thanh toán sản phẩm", value: "PAYMENT_ORDER_PRODUCT"};
    static readonly PAYMENT_ORDER_SERVICE: Enum = {text: "Thanh toán dịch vụ", value: "PAYMENT_ORDER_SERVICE"};
    static readonly REFUND_COMMISSION_APPROVE: Enum = {text: "Hoàn tiền chiết khấu", value: "REFUND_COMMISSION_APPROVE"};
    static readonly LIST: Enum[] = [this.PAYMENT_ORDER_PRODUCT, this.PAYMENT_ORDER_SERVICE, this.REFUND_COMMISSION_APPROVE];
}
export class STATUS_SETTING_BANKING_INFO {
    static readonly IN_ACTIVE: Enum = {text: "Ngừng hoạt động", value: "IN_ACTIVE"};
    static readonly ACTIVATED: Enum = {text: "Đang hoạt động", value: "ACTIVATED"};
    static readonly LIST: Enum[] = [this.IN_ACTIVE, this.ACTIVATED];
}
export enum TEMPLATE_VIET_QR {
    TEMPLATE_1 = 'fkGutv8',
}
export class STATUS_COMMISSION_APPROVE_PENDING {
    static readonly PENDING: Enum = {text: "Chờ duyệt", value: "PENDING"};
    static readonly APPROVE: Enum = {text: "Đã duyệt", value: "APPROVE"};
    static readonly LIST: Enum[] = [this.PENDING, this.APPROVE];
}
export enum TYPE_PAYMENT {
    ORDER_SERVICE = "ORDER_SERVICE",
    COMMISSION = "COMMISSION",
}
export const isEnvironmentPro = (): boolean => {
    return window.location.origin.endsWith(Constant.EXTENSION_DOMAIN_PRO);
}
export const isEnvironmentDev = (): boolean => {
    return !isEnvironmentPro();
}

export enum TYPE_REPORT {
    CUSTOMER = "CUSTOMER",
    REVENUE = "REVENUE",
    REFUND = "REFUND",
    TOTAL_ORDER = "TOTAL_ORDER",
}
export class MODE_DATE_FILTER {
    static readonly RANGE: Enum = {text: "From-To", value: ""};
    static readonly DATE: Enum = {text: "Ngày", value: "date"};
    static readonly WEEK: Enum = {text: "Tuần", value: "week"};
    static readonly MONTH: Enum = {text: "Tháng", value: "month"};
    static readonly YEAR: Enum = {text: "Năm", value: "year"};
    static readonly LIST: Enum[] = [this.RANGE, this.DATE, this.WEEK, this.MONTH, this.YEAR];
}
export class STATUS_REPORT {
    static readonly DECREASE: Enum = {text: "Giảm", value: "DECREASE"};
    static readonly INCREASE: Enum = {text: "Tăng", value: "INCREASE"};
}
export enum STATUS_FORGOT_PASSWORD {
    INPUT_INFO = "INPUT_INFO",
    INPUT_PIN_CODE = "INPUT_PIN_CODE",
    FINISH = "FINISH",
}