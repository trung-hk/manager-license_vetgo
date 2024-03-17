import {AbstractModel} from "./AbstractModel";

export class User extends AbstractModel{
    id?: string | null;
    name?: string | null;
    email?: string | null;
    code?: string | null;
    phone?: string | null;
    address?: string | null;
    avatar?: string | null;
    type?: string | null;
    keycloakId?: string | null;
    parentId?: string | null;
    commissionId?: string | null;
    wifiMarketingDTOs?: string | null;
}

