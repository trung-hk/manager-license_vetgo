import {AttributeOrderProductService} from "./AttributeOrderProductService";
import {AbstractModel} from "./AbstractModel";

export class OrderService extends AbstractModel{
    id?: string | null;
    code?: string | null;
    partnerId?: string | null;
    customerId?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    customerAddress?: string | null;
    packageId?: string | null;
    attributes?: string | null;
    totalAmount?: string | null;
    paymentStatus?: string | null;
    toreId?: string | null;
    type?: string | null;
    itemId?: string | null;
    expiredDate?: string | null;
    attributesObject?: AttributeOrderProductService | null;
    paymentCode?: string | null;
    paymentMethod?: string | null;
}

