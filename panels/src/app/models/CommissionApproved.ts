import {AbstractModel} from "./AbstractModel";

export class CommissionApproved extends AbstractModel {
    id?: string | null ;
    userName?: string | null;
    userId?: string | null;
    userType?: string | null;
    commissionId?: string | null;
    commissionRate?: string | null;
    totalOrder?: string | null;
    totalOrderAmount?: string | null;
    totalCommissionAmount?: string | null;
    urlDownload?: string | null;
    urlView?: string | null;
    commissionResultIds?: string | null;

}

