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