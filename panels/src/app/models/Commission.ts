export class Commission {
    id?: string | null;
    name?: string | null;
    commissionType?: string | null;
    rate?: string | null;
    commissionAccumulates?: CommissionAccumulates[] | [];
    status?: string | null;
    createdBy?: string | null;
    createdDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    seqNo?: string | null;
    deleted?: boolean | null;
}
export interface CommissionAccumulates {
    id?: string | null;
    commissionId?: string | null;
    revenueFrom?: string | null;
    rate?: string | null;
    status?: string | null;
    createdBy?: string | null;
    createdDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    seqNo?: string | null;
    deleted?: boolean | null;
}


