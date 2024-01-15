import {AbstractModel} from "./AbstractModel";

export class CommissionApprovePending extends AbstractModel {
    id?: string | null ;
    code?: string | null;
    commissionAmount?: string | null;
    totalAmount?: string | null;
    commissionId?: string | null;
    pathTree?: string | null;
    rate?: string | null;
    userId?: string | null;
    userCode?: string | null;
    userType?: string | null;

}

