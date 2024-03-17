import {AbstractModel} from "./AbstractModel";

export interface Attribute{
    status: string,
    infoHardware: InfoHardware
}
export interface InfoHardware{
    "write-sect-total": string | null,
    "board-name": string | null,
    "free-memory": string | null,
    "write-sect-since-reboot": string | null,
    "cpu": string | null,
    "cpu-load": string | null,
    "version": string | null,
    "platform": string | null,
    "uptime": string | null,
    "factory-software": string | null,
    "cpu-count": string | null,
    "cpu-frequency": string | null,
    "bad-blocks": string | null,
    "free-hdd-space": string | null,
    "total-hdd-space": string | null,
    "architecture-name": string | null,
    "build-time": string | null,
    "total-memory": string | null
}
export class WifiMarketing extends AbstractModel{
    id?: string | null;
    customerId?: string | null;
    cloudId?: string | null;
    userName?: string | null;
    password?: string | null;
    attributes?: string | null;
    attributesObject?: Attribute | null;
}

