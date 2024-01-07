import {PackageProduct} from "./PackageProduct";
import {AbstractModel} from "./AbstractModel";

export class DataConfig {
    codeApp?: string;
    phones?: ConfigPhoneCsZalo[];
    name?: string;
    customDomain?: string;
    phone?: string;
    email?: string;
    address?: string;
    cloudId?: string;
    userName?: string;
    password?: string;
}
export interface ConfigPhoneCsZalo{
    phone: string;
    expiredDate: string;
    quantityDateUsing: number;
}
export class AttributePackagePurchased {
    usingConfig?: string | null;
    itemName?: string | null;
    packages?: PackageProduct[] | null;
    packagesMap?: Map<string, PackageProduct>| null;
    data?: DataConfig
}
export class PackagePurchased extends AbstractModel{
    id?: string | null ;
    customerId?: string | null;
    itemId?: string | null;
    itemType?: string | null;
    packageId?: string | null;
    attributes?: string | null;
    expiredDate?: string | null;
    attributeObject?: AttributePackagePurchased;
    quantityDateUsing?: number;
    quantityRegisterPhone?: number;
    quantityNotExpiredPhone?: number;
}

