
export class LicenseZalo {
    id?: string | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    license?: string | null;
    status?: string | null;
    createdBy?: string | null;
    createdDate?: string | null;
    lastModifiedBy?: string | null;
    lastModifiedDate?: string | null;
    seqNo?: string | null;
    deleted?: string | null;
    accountList?: AccountInfo[];
}
export interface AccountInfo {
    phone: string,
    expiredDate: string,
}

