import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiCommonService } from 'src/app/services/api-common.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit {
  total = 0;
  data: any[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterGender = [];
  isVisible = false;
  isVisibleDelete = false;
  isConfirmLoading = false;
  isHorizontal = false;
  validateForm!: UntypedFormGroup;
  agentId = -1;
  http = inject(HttpClient)
  api = inject(ApiCommonService);

  constructor(private fb: UntypedFormBuilder) {

  }
  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.http.get<any>(`https://dev-api.phanmemvet.vn/api/users?pageSize=${pageSize}&pageNumber=${pageIndex}`).subscribe(data => {
      this.loading = false;
      this.total = data.totalElements; // mock the total data here
      this.data = data.content;
      console.log(data);
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }


  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);

    this.validateForm = this.fb.group({
      id: [null],
      realm: [null, [Validators.required]],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^\+?[0-9]{9,13}$/)]],
      status: [null, [Validators.required]],
      address: [null],
    });
  }

  transferShortName(name: string): string {
    const result = name.split(' ');

    return result ? `${result[0].charAt(0).toUpperCase()}${result[1] ? result[1].charAt(0).toUpperCase() : result[0].charAt(1).toUpperCase()}` : '';
  }

  showModal(agent?: any): void {
    this.isVisible = true;

    if (agent) {
      this.validateForm.setValue({
        id: agent.id,
        realm: agent.realm,
        code: agent.code,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        address: agent.address,
        status: agent.status,
      });
    }
  }

  handleOk(): void {
    this.isConfirmLoading = true;

    if (this.validateForm.valid) {
      const data = { ...this.validateForm.value, type: 'AGENT' }
      if (data.id) {
        this.api.update(data.id, data, 'users').subscribe(() => {
          this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        })
      } else {
        this.api.insert('users', data).subscribe(() => {
          this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        })
      }
      
      this.isVisible = false;
      this.validateForm.reset();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteModal(id: number) {
    this.isVisibleDelete = true;
    this.agentId = id;
  }

  handleCancelDeletePopup(): void {
    this.isVisibleDelete = false;
    this.agentId = -1;
  }

  handleConfirmToDelete() {
    this.api.delete(this.agentId, 'users').subscribe(() => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
      this.handleCancelDeletePopup();
    })
  }
}
