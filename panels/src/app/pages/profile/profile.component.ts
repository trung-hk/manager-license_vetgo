import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {User} from "../../models/User";
import {ScriptCommonService} from "../../services/script-common.service";
import {RouteURL} from "../../Constants/route-url";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Constant} from "../../Constants/vg-constant";
import {CHANGE_PASSWORD_FORM, PROFILE_FORM, ProfileForm} from "../../Constants/Form";
import {Message} from "../../Constants/message-constant";
import {DataService} from "../../services/data.service";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ResponseError} from "../../models/ResponseError";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    loadScriptList: string[] = []
    protected readonly RouteURL = RouteURL;
    protected readonly Constant = Constant;
    loading: boolean = false;
    user?: User;
    validateForm!: UntypedFormGroup;
    validateChangePasswordForm!: UntypedFormGroup;
    oldPasswordVisible: boolean = false;
    newPasswordVisible: boolean = false;
    reNewPasswordVisible: boolean = false;



    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                public scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder,
                private dataService: DataService) {
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.loadScriptList).then();
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group(PROFILE_FORM);
        this.validateChangePasswordForm = this.fb.group(CHANGE_PASSWORD_FORM);
        this.init();
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(): void {
        this.loading = true;
        this.api.getById<User>(this.scriptFC.getUserIdLogin(), URL.API_USER).subscribe(data => {
            if (!this.scriptFC.validateResponseAPI(data.status)) {
                this.user = data;
                this.setProfileForm(this.user);
            } else {
            }
            console.log(data);

            this.loading = false;
        })
    }

    setProfileForm(user: User) {
        this.validateForm.setValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        } as ProfileForm)
    }

    saveData() {
        if (this.validateForm.invalid) {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            return
        }
        const data: User = this.validateForm.value;
        data.id = this.user?.id;
        this.api.updateProfileUser(data).subscribe(data => {
            if (this.scriptFC.validateResponseAPI(data?.status)) {
                this.scriptFC.alertShowMessageError(Message.MESSAGE_SAVE_FAILED);
            } else {
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                this.loadDataFromServer();
                this.dataService.getReLoadDataFunc().reloadData();
            }
        })
    }
    saveChangePassword() {
        if (this.validateForm.invalid) {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            return
        }
        this.api.changePassword<{status: string}>(this.validateChangePasswordForm.getRawValue()).subscribe(data => {
            console.log(data)
            if (this.scriptFC.validateResponseAPI(data.status)) {
                data = data as ResponseError;
                this.scriptFC.alertShowMessageError(data.message!);
            } else {
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_CHANGE_PASSWORD_SUCCESS);
                this.validateChangePasswordForm.clearValidators();
                this.validateChangePasswordForm.reset()
            }
        })
    }
}
