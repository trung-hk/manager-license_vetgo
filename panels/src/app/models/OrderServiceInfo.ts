import {User} from "./User";
import {OrderService} from "./OrderService";

export interface OrderServiceInfo {
    customer: User;
    orderService: OrderService;
}

