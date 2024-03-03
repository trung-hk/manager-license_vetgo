import {NzTableQueryParams} from "ng-zorro-antd/table";
import {CallbackLoadDataServer} from "./CallbackLoadDataServer";

export abstract class CommonParamComponent {
    total: number = 1;
    loading: boolean = true;
    pageSize: number = 10;
    pageIndex: number = 1;
    sort: string | null = "last_modified_date,desc";
    changeFirst: boolean = true;
    filter: Array<{ key: string; value: string[] }> | null = null;
    callbackReloadData: CallbackLoadDataServer = {
        reloadData: (from?: string, to?: string, keyWork?: string) => {
            // Gọi phương thức từ class đã định nghĩa ở đây
            this.loadDataFromServer(from, to, keyWork);
        }
    };
    onQueryParamsChange(params: NzTableQueryParams): void {
        if (this.changeFirst) {
            this.changeFirst = false;
            return;
        }
        const {pageSize, pageIndex, sort, filter} = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.filter = filter;
        if (!sortField) {
            this.sort = "last_modified_date,desc";
        } else {
            let sortOrder = (currentSort && currentSort.value) || null;
            sortOrder = sortOrder && sortOrder === 'ascend' ? 'asc' : 'desc';
            this.sort = `${sortField},${sortOrder}`;
        }
        this.loadDataFromServer();
    }
    abstract loadDataFromServer(from?: string, to?: string, keyWork?: string): void;
}