import {AbstractModel} from "./AbstractModel";

export class ConfigApp extends AbstractModel{
    id?: string | null ;
    sheetName?: string | null;
    firebase?: string | null;
    sheetId?: string | null;
    customerId?: string | null;
    userName?: string | null;
    avatar?: string | null;
    codeAppVetgo?: string | null;
}

