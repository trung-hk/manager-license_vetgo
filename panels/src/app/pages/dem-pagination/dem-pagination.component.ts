import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzTableQueryParams} from "ng-zorro-antd/table";

@Component({
  selector: 'app-dem-pagination',
  templateUrl: './dem-pagination.component.html',
  styleUrls: ['./dem-pagination.component.scss']
})
export class DemPaginationComponent {
  total = 1;
  listOfRandomUser: any[] = [];
  loading = true;
  pageSize = 2;
  pageIndex = 1;
  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' }
  ];

  http = inject(HttpClient)
  constructor() {

  }
  loadDataFromServer(
      pageIndex: number,
      pageSize: number,
      sortField: string | null,
      sortOrder: string | null,
      filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    console.log(this.pageIndex , this.pageSize, sortField, sortOrder, filter);
    this.http.get<any>(`https://dev-api.phanmemvet.vn/api/categories?pageSize=${pageSize}&pageNumber=${pageIndex}`).subscribe( data => {
      this.loading = false;
      this.total = data.totalElements; // mock the total data here
      this.listOfRandomUser = data.content;
      console.log(data);
    })
    // this.randomUserService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
    //
    // });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }


  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }
}
