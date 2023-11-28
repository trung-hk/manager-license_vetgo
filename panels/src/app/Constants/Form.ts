import {Validators} from "@angular/forms";
import {TYPE_EXPIRED_PACKAGE, TYPE_PACKAGE} from "./vg-constant";

export const CONFIG_APP_FORM = {
    id: [null],
    sheetName: [null, [Validators.required, Validators.maxLength(500)]],
    firebase: [null, [Validators.required, Validators.maxLength(4000)]],
    codeAppVetgo: [null],
    sheetId: [null, [Validators.required, Validators.maxLength(500)]],
    customer: [null],
    status: [null, [Validators.required]]
}

export const USER_FORM_FOR_AGENT = {
    id: [null],
    realm: [{value: [null], disabled: false}, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
    code: [{value: [null], disabled: false}, [Validators.required, Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    phone: [null, [Validators.required, Validators.maxLength(15)]],
    address: [null, [Validators.maxLength(500)]],
    status: [null, [Validators.required]],
    commissionId: [null],
}
export const USER_FORM = {
    id: [null],
    code: [null, [Validators.required, Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    phone: [null, [Validators.required, Validators.maxLength(15)]],
    address: [null, [Validators.maxLength(500)]],
    status: [null, [Validators.required]],
    commissionId: [null],
}
export const PRODUCT_SERVICE_FORM = {
    id: [null],
    code: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    name: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
    description: [null, [Validators.maxLength(4000)]],
    status: [null, [Validators.required]],
    usingConfig: [null, [Validators.required]],
}

export const PACKAGE_PRODUCT_SERVICE_FORM = {
    id: [null],
    name: [null],
    price: [null],
    typePackage: [TYPE_PACKAGE.PAYMENT.value],
    typeExpired: [TYPE_EXPIRED_PACKAGE.DAY],
    expired: [null]
}
export const ORDER_SERVICE_FORM = {
    id: [null],
    code: [null],
    customerId: [null],
    itemId: [{value: [null], disabled: false}, [Validators.required]],
    packageId: [null, [Validators.required]]
}
export const COMMISSION_FORM = {
    id: [null],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    commissionType: [null, [Validators.required]],
    rate: [null],
}
export const COMMISSION_ACCUMULATE_FORM = {
    revenueFrom: [null],
    rate: [null],
}
export const CONFIG_VET_APP_FORM = {
    codeApp: [null, [Validators.required]],
}
export const CONFIG_POS_FORM = {
    codeApp: [null, [Validators.required]],
}
export const CONFIG_SPA_FORM = {
    codeApp: [null, [Validators.required]],
}
export const CONFIG_CS_ZALO_FORM = {
    phone: [null, [Validators.required, Validators.maxLength(15)]],
}
export const CONFIG_ADMIN_ONLINE_SHOP_FORM = {
    name: [null, [Validators.required]],
    customDomain: [null],
    phone: [null, [Validators.required, Validators.maxLength(15)]],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    address: [null, [Validators.maxLength(500)]],
}
export const CONFIG_WIFI_MARKETING_FORM = {
    cloudId: [null, [Validators.required]],
    userName: [null, [Validators.required]],
    password: [null, [Validators.required]],
}

export const CONFIG_LICENSE_ZALO_FORM = {
    name: [null],
    id: [null, [Validators.required]],
    phone: [null],
    email: [null, [Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    expiryDate: [null],
    license: [null],
}
export const CONFIG_LICENSE_ZALO_SYSTEM_FORM = {
    id: [null],
    data: [null],
}