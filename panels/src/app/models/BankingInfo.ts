import {AbstractModel} from "./AbstractModel";

export class BankingInfo extends AbstractModel {
    id?: string | null ;
    name?: string | null;
    bin?: string | null;
    code?: string | null;
    logo?: string | null;
    lookupSupported?: string | null;
    shortName?: string | null;
    transferSupported?: string | null;
}

