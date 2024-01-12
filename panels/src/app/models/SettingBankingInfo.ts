import {AbstractModel} from "./AbstractModel";

export class SettingBankingInfo extends AbstractModel {
    id?: string | null ;
    userId?: string | null;
    acqId?: string | null;
    accountName?: string | null;
    accountNo?: string | null;
    template?: string | null;
}

