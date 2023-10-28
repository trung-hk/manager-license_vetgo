import {PackageProduct} from "./PackageProduct";

export class Item{
    id?: string | null ;
    name?: string | null;
    code?: string | null;
    images?: string | null;
    description?: string | null;
    categoryId?: string | null;
    attributes?: string | null;
    orgPrice?: string | null;
    sellingPrice?: string | null;
    type?: string | null;
    status?: string | null;
    createBy?: string | null;
    createDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    seqNo?: string | null;
    deleted?: boolean | null;
    storeId?: string | null;
    usingConfig?: string | null;
    packages?: PackageProduct[] | [];
}

