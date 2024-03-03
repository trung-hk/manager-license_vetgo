
export class ObjectSelectAll{
    page?: number | null;
    size?: number | null;
    sort?: string | null;
    filter?: Array<{ key: string; value: string[]}> | null;
    keyword?: string | null;
    type?: string;
    userId? : string | null;
    fromCreatedDate? : string;
    toCreatedDate? : string;
    referenceType? : string;
}

