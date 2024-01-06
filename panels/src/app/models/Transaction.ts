import {AbstractModel} from "./AbstractModel";

export class Transaction extends AbstractModel{
    id?: string | null ;
    note?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
    action?: string | null;
    totalAmount?: string | null;
    code?: string | null;
    method?: string | null;
}

