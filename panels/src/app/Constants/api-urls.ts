export class URL {
    static readonly API_CATEGORY: string = "categories";
    static readonly API_CONFIG_APP: string = "config-apps";
    static readonly API_USER: string = "users";
    static readonly API_ITEM: string = "items";
    static readonly API_ITEM_BY_CODE: string = "items/code";
    static readonly API_USER_BY_TYPE: string = "users/type";
    static readonly API_CUSTOMER_BY_PHONE: string = "users/customer-phone";
    static readonly API_AGENT_PRODUCT: string = "agent-items";
    static readonly API_ORDER_SERVICE: string = "vg-order-service";
    static readonly API_COMMISSION: string = "commissions";
    static readonly API_PAYMENT: string = "payment-service";
    static readonly API_APPROVE_MANUAL_PAYMENT: string = "payment-service/callback/approve-manual";
    static readonly API_PAYMENT_CONFIRM: string = `${this.API_PAYMENT}/confirm/order-service/{0}/method/{1}`;
    static readonly API_UPDATE_CONFIG_ORDER: string = `vg-order-service/config-order`;
    static readonly API_PACKAGE_PURCHASED: string = `user-packages`;
    static readonly API_TRANSACTION_HISTORY_PAYMENT: string = `transaction-log-payments`;
}