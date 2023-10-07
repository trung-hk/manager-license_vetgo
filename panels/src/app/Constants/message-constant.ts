export const MESSAGE_SAVE_SUCCESS = "Lưu thành công";
export const MESSAGE_SAVE_FAILED = "Lưu thất bại";
export const MESSAGE_CONNECT_FAILED = "Lưu thất bại, kiểm tra lại đường truyền";
export const MESSAGE_DELETE_SUCCESS = "Xóa thành công";
export const MESSAGE_DELETE_FAILED = "Xóa thất bại";
export const MESSAGE_REGISTER_SUCCESS = "Đăng ký thành công";
export const MESSAGE_REGISTER_FAILED = "Đăng ký thất bại";
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