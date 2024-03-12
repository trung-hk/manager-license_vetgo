import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCommonService} from "../../services/api-common.service";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {SettingBankingInfo} from "../../models/SettingBankingInfo";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {User} from "../../models/User";
import {BankingInfo} from "../../models/BankingInfo";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean = false;
  constructor(private api: ApiCommonService,) {
  }
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.init();
  }
  init(): void {
    this.loadDataFromServer();
  }
   loadDataFromServer(): void {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    let loading_success_3 = false;
    // const objectSelect: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    // this.api.getAll<ResponseDataGetAll<SettingBankingInfo>>(URL.API_SETTING_BANK_INFO, objectSelect).subscribe(data => {
    //   this.dataList = data.content;
    //   this.total = data.totalElements;
    //   loading_success_1 = true;
    //   this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    // }, error => {
    //   console.log(error);
    //   this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //   this.loading = false;
    // });
    // if (this.isLoadFirstData) {
    //   const userType = await this.getUserType();
    //   this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, userType).subscribe((data) => {
    //     console.log(data)
    //     this.userList = data.content;
    //     this.userMap = new Map<string, User>(this.userList.map(user => [user.id!, user]));
    //     loading_success_2 = true;
    //     this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    //   }, error => {
    //     console.log(error);
    //     this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //     this.loading = false;
    //   });
    //   this.api.getAll<ResponseDataGetAll<BankingInfo>>(URL.API_BANK_INFO).subscribe((data) => {
    //     console.log(data)
    //     this.bankingInfo = data.content;
    //     this.bankingInfoMap = new Map<string, BankingInfo>(this.bankingInfo.map(banking => [banking.bin!, banking]));
    //     loading_success_3 = true;
    //     this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    //   }, error => {
    //     console.log(error);
    //     this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
    //     this.loading = false;
    //   });
    //   this.isLoadFirstData = false;
    // } else {
    //   loading_success_2 = true;
    //   loading_success_3 = true;
    //   this.loading = !(loading_success_1 && loading_success_2 && loading_success_3);
    // }

  }
}
