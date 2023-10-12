import {Validators} from "@angular/forms";
import {TYPE_EXPIRED_PACKAGE, TYPE_PACKAGE} from "./vg-constant";

export const CONFIG_APP_FORM= {
    id: [null],
    sheetName: [null, [Validators.required, Validators.maxLength(500)]],
    firebase: [null, [Validators.required, Validators.maxLength(4000)]],
    codeAppVetgo: [null],
    sheetId: [null, [Validators.required, Validators.maxLength(500)]],
    customer: [null],
    status: [null, [Validators.required]]
}

export const USER_FORM_FOR_AGENT= {
    id: [null],
    realm: [{value: [null], disabled: false}, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\-]+$/)]],
    code: [{value: [null], disabled: false}, [Validators.required, Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    phone: [null, [Validators.required, Validators.maxLength(15)]],
    address: [null, [Validators.maxLength(500)]],
    status: [null, [Validators.required]],
}
export const USER_FORM= {
    id: [null],
    code: [null, [Validators.required, Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(255)]],
    email: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255), Validators.email]],
    phone: [null, [Validators.required, Validators.maxLength(15)]],
    address: [null, [Validators.maxLength(500)]],
    status: [null, [Validators.required]],
}
export const PRODUCT_SERVICE_FORM= {
    id: [null],
    code: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    name: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
    description: [null, [Validators.maxLength(4000)]],
    status: [null, [Validators.required]],
}

export const PACKAGE_PRODUCT_SERVICE_FORM= {
    id: [null],
    name: [null],
    price: [null],
    typePackage: [TYPE_PACKAGE.PAYMENT_VALUE],
    typeExpired: [TYPE_EXPIRED_PACKAGE.DAY],
    expired: [null]
}
export const ORDER_SERVICE_FORM= {
    id: [null],
    code: [null],
    itemId: [null, [Validators.required]],
    packageId: [null, [Validators.required]],
    totalAmount: [null],
}