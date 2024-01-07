import {AbstractModel} from "./AbstractModel";

export class Commission extends AbstractModel{
    id?: string | null;
    name?: string | null;
    commissionType?: string | null;
    rate?: string | null;
    commissionAccumulates?: CommissionAccumulates[] | [];
}
export interface CommissionAccumulates extends AbstractModel{
    id?: string | null;
    commissionId?: string | null;
    revenueFrom?: string | null;
    rate?: string | null;
}


