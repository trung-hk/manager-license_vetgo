export class RouteURL {
    static readonly PAGE_DASHBOARD: string = "dashboard";
    static readonly PAGE_AGENTS: string = "agents";
    static readonly PAGE_AGENT_PRODUCT: string = "agent-product";
    static readonly PAGE_MANAGER_CONFIG_APP: string = "manager-config-app";
    static readonly PAGE_PRODUCT: string = "product";
    static readonly PAGE_PROFILE: string = "profile";
    static readonly PAGE_PRODUCT_SERVICE: string = "product-service";
    static readonly PAGE_DISTRIBUTORS: string = "distributors";
    static readonly PAGE_PARTNERS: string = "partners";
    static readonly PAGE_ORDER_SERVICE: string = "order-service";
    static readonly PAGE_ORDERS: string = "orders";
    static readonly PAGE_COMMISSIONS: string = "commissions";
    static readonly PAGE_PAYMENT_BANK_TRANSFER: string = "payment-bank-transfer/:id";
    static readonly PAGE_CUSTOMERS: string = "customers";
    static readonly PAGE_PAYMENT_COMPLETE_DETAILS: string = "payment-complete-details/:id";
    static readonly PAGE_LICENSE_ZALO: string = "license-zalo";
    static readonly PAGE_PACKAGE_PURCHASED: string = "package-purchased";
    static readonly PAGE_PACKAGE_RENEWAL: string = "package-renewal/:id";
    static readonly PAGE_APPROVE_MANUAL_PAYMENT: string = "approve-manual-payment";
    static readonly PAGE_TRANSACTION_HISTORY_PAYMENT: string = "transaction-history-payment";
    static readonly PAGE_SETTING_BANKING: string = "setting-banking";
    static readonly PAGE_COMMISSION_APPROVE: string = "commission-approve";
    static readonly PAGE_COMMISSION_APPROVE_PENDING: string = "commission-approve-pending";
    static readonly PAGE_APPROVE_MANUAL_PAYMENT_COMMISSION: string = "approve-manual-payment-commission";
    //Page error
    static readonly PAGE_ERROR: string = "error";
    static readonly PAGE_403: string = "403";
    static readonly PAGE_404: string = "404";
    static readonly PAGE_ERROR_403: string = `${this.PAGE_ERROR}/${this.PAGE_403}`;
    static readonly PAGE_ERROR_404: string = `${this.PAGE_ERROR}/${this.PAGE_404}`;
    //Page auth
    static readonly PAGE_AUTH: string = "auth";
    static readonly PAGE_FORGOT_PASSWORD: string = "forgot-password";
    static readonly PAGE_AUTH_FORGOT_PASSWORD: string = `${this.PAGE_AUTH}/${this.PAGE_FORGOT_PASSWORD}`;
    static nextToPage(page: string) {
        return `/${page}`;
    }
    static nextToPageWithId(page: string, id: string) {
        return `/${page}`.replace(":id", id);
    }
}