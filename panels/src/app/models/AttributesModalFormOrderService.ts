import {Item} from "./Item";
import {OrderService} from "./OrderService";

export interface AttributesModalFormOrderService {
    modeOpen: string,
    customerId?: string,
    productInfo: Item[],
    idProductSelect?: string,
    order?: OrderService,
    packageId?: string,
    phoneList?: string[],
    phoneSelect?: string[],
    fromOrderMode?: string,
}

