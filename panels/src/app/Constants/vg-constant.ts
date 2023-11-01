export enum STATUS_CONFIG {
    IN_ACTIVE_LABEL = "Chưa kích hoạt",
    IN_ACTIVE_VALUE = "IN_ACTIVE",
    PENDING_ACTIVE_LABEL = "Chờ kích hoạt",
    PENDING_ACTIVE_VALUE = "PENDING_ACTIVE",
    ACTIVATED_LABEL = "Đã kích hoạt",
    ACTIVATED_VALUE = "ACTIVATED",
}
export enum USER_TYPE {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    DISTRIBUTOR = "DISTRIBUTOR",
    PARTNER = "PARTNER",
    CUSTOMER = "CUSTOMER"
}

export enum STATUS_AGENT {
    IN_ACTIVE_LABEL = "Ngừng hoạt động",
    IN_ACTIVE_VALUE = "IN_ACTIVE",
    ACTIVATED_LABEL = "Đang hoạt động",
    ACTIVATED_VALUE = "ACTIVATED",
}
export enum STATUS_DISTRIBUTOR {
    IN_ACTIVE_LABEL = "Ngừng hoạt động",
    IN_ACTIVE_VALUE = "IN_ACTIVE",
    ACTIVATED_LABEL = "Đang hoạt động",
    ACTIVATED_VALUE = "ACTIVATED",
}
export enum STATUS_PARTNER {
    IN_ACTIVE_LABEL = "Ngừng hoạt động",
    IN_ACTIVE_VALUE = "IN_ACTIVE",
    ACTIVATED_LABEL = "Đang hoạt động",
    ACTIVATED_VALUE = "ACTIVATED",
}
export enum STATUS_CUSTOMER {
    IN_ACTIVE_LABEL = "Ngừng hoạt động",
    IN_ACTIVE_VALUE = "IN_ACTIVE",
    ACTIVATED_LABEL = "Đang hoạt động",
    ACTIVATED_VALUE = "ACTIVATED",
}
export enum ROLES {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    DISTRIBUTOR = "DISTRIBUTOR",
    PARTNER = "PARTNER",
    CUSTOMER = "CUSTOMER"
}

export enum STATUS_PRODUCT_SERVICE {
    UN_DEPLOYED_LABEL = "Chưa triển khai",
    UN_DEPLOYED_VALUE = "UN_DEPLOYED",
    DEPLOYED_LABEL = "Đã triển khai",
    DEPLOYED_VALUE = "DEPLOYED"
}

export enum TYPE_PRODUCT {
    SERVICE_PRODUCT = "SERVICE_PRODUCT",
    SALES_PRODUCT = "SALES_PRODUCT"
}

export enum STATUS_AGENT_PRODUCT {
    UN_REGISTERED_LABEL = "Chưa đăng ký",
    UN_REGISTERED_VALUE = "UN_REGISTERED",
    REGISTERED_LABEL = "Đã đăng ký",
    REGISTERED_VALUE = "REGISTERED",
}
export enum STATUS_PAYMENT {
    UN_PAID_LABEL = "Chưa thanh toán",
    UN_PAID_VALUE = "UNPAID",
    PAID_LABEL = "Đã thanh toán",
    PAID_VALUE = "PAID",

}
export enum STATUS_ORDER {
    IN_PROCESS_LABEL = "Đang tiến hành",
    IN_PROCESS_VALUE = "IN_PROCESS",
    FINISHED_LABEL = "Đã hoàn thành",
    FINISHED_VALUE = "FINISHED",
    CANCEL_ORDER_LABEL = "Đã hủy đơn",
    CANCEL_ORDER_VALUE = "CANCEL_ORDER",
}
export enum TYPE_EXPIRED_PACKAGE {
    DAY = "day",
    MONTH = "month",
    YEAR = "year"
}
export enum TYPE_PACKAGE {
    FREE_LABEL = "Không trả phí",
    FREE_VALUE = "FREE",
    PAYMENT_LABEL = "Trả phí",
    PAYMENT_VALUE = "PAYMENT",
}
export enum MODE_DISPLAY {
    PC = "PC",
    MOBILE = "MOBILE"
}
export enum CONFIG {
    NOT_USING_LABEL = "Không sử dụng",
    NOT_USING_VALUE = "NOT_USING",
    USING_LABEL = "Sử dụng",
    USING_VALUE = "USING",
}
export enum TYPE_COMMISSION {
    DEFAULT_LABEL = "Theo sản phẩm",
    DEFAULT_VALUE = "DEFAULT",
    REVENUE_LABEL = "Theo doanh thu",
    REVENUE_VALUE = "REVENUE",
}
export enum STATUS_CODE_ERROR {
    ERROR_400 = '400',
    ERROR_404 = '404',
    ERROR_409 = '409'
}
export const ERROR_LIST: string[] = [STATUS_CODE_ERROR.ERROR_400,
    STATUS_CODE_ERROR.ERROR_404,
    STATUS_CODE_ERROR.ERROR_409]
export enum TYPE_PRODUCT_SERVICE {
    VETAPP = "VETAPP",
    CS_ZALO = "CS-ZALO",
    ADMIN_ONLINE_SHOP = "ADMIN-ONLINE-SHOP",
    WIFI_MARKETING = "WIFI-MARKETING",
    POS = "POS",
    SPA = "SPA",
}
export const TYPE_PRODUCT_SERVICE_LIST: string[] = [
    TYPE_PRODUCT_SERVICE.VETAPP,
    TYPE_PRODUCT_SERVICE.CS_ZALO,
    TYPE_PRODUCT_SERVICE.ADMIN_ONLINE_SHOP,
    TYPE_PRODUCT_SERVICE.WIFI_MARKETING,
    TYPE_PRODUCT_SERVICE.POS,
    TYPE_PRODUCT_SERVICE.SPA
]