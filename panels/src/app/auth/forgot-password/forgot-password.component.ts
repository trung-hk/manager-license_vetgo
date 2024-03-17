import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {
    CONFIRM_RESET_PASSWORD_FORM,
    ConfirmResetPasswordForm,
    FORGOT_PASSWORD_FORM,
    ForgotPasswordForm
} from "../../Constants/Form";
import {REALM, STATUS_FORGOT_PASSWORD} from "../../Constants/vg-constant";
import {ResponseError} from "../../models/ResponseError";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styles: [
        `.section {
          position: absolute;
          width: 100%;
          top: 15%;
        }
        `
    ]
})
export class ForgotPasswordComponent implements OnInit {
    protected readonly STATUS_FORGOT_PASSWORD = STATUS_FORGOT_PASSWORD;
    validateForgotPasswordForm!: UntypedFormGroup;
    validateConfirmResetPasswordForm!: UntypedFormGroup;
    realm: string = REALM();
    newPasswordVisible: boolean = false;
    reNewPasswordVisible: boolean = false;
    statusForgotPassword: string = STATUS_FORGOT_PASSWORD.INPUT_INFO;
    loading: boolean = false;
    isResendCodeConfirm: boolean = true;
    countDownResendCode: number = 60;
    emailForget!: string
    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                public scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder,) {
    }

    ngOnInit(): void {
        this.validateForgotPasswordForm = this.fb.group(FORGOT_PASSWORD_FORM);
        this.validateConfirmResetPasswordForm = this.fb.group(CONFIRM_RESET_PASSWORD_FORM);
        this.loadScript.addListScript([]).then();
      this.validateForgotPasswordForm.patchValue({
        realm: this.realm
      } as ForgotPasswordForm)
    }
    sendCodeConfirm(isResend: boolean) {
        this.loading = true;
        if (this.validateForgotPasswordForm.invalid) {
            Object.values(this.validateForgotPasswordForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            this.loading = false;
            return
        }
        const dataForm: ForgotPasswordForm = this.validateForgotPasswordForm.getRawValue();
        console.log(dataForm)
        this.api.resetPassword<{status: string, email: string}>(dataForm).subscribe(data => {
            if (this.scriptFC.validateResponseAPI(data.status)) {
                this.scriptFC.alertShowMessageError((data as ResponseError).message!);
            } else {
                this.statusForgotPassword = STATUS_FORGOT_PASSWORD.INPUT_PIN_CODE;
                this.validateConfirmResetPasswordForm.patchValue({
                    realm: dataForm.realm,
                    userName: dataForm.userName
                } as ConfirmResetPasswordForm);
                this.emailForget = (data as {status: string, email: string}).email;
                if (isResend) {
                    this.isResendCodeConfirm = false;
                    const interval = setInterval(() => {
                        if (this.countDownResendCode-- === 0) {
                            this.isResendCodeConfirm = true;
                            this.countDownResendCode = 60;
                            clearInterval(interval);
                        }
                    }, 1000)
                }
            }
            this.loading = false;
            console.log(data)
        })
    }
    confirmResetPassword() {
        this.loading = true;
        if (this.validateConfirmResetPasswordForm.invalid) {
            Object.values(this.validateConfirmResetPasswordForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            this.loading = false;
            return
        }
        const dataForm: ConfirmResetPasswordForm = this.validateConfirmResetPasswordForm.getRawValue();
        console.log(dataForm)
        this.api.confirmResetPassword<ResponseError>(dataForm).subscribe(data => {
            if (this.scriptFC.validateResponseAPI(data.status)) {
                this.scriptFC.alertShowMessageError(data.message!);
                this.loading = false;
            } else {
                this.statusForgotPassword = STATUS_FORGOT_PASSWORD.FINISH;
                window.location.href = window.location.origin;
            }
            console.log(data)
        })
    }
}
