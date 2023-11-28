
export interface BodyDataScript {
    id?: string;
    actionType?: string;
    sheetId?: string | null;
    phone?: string | null;
}
export class CallScriptObject {
    actionType?: string;
    table?: string;
    data?: BodyDataScript | Object;
    id?: string;
    csrfToken?: string;
}

