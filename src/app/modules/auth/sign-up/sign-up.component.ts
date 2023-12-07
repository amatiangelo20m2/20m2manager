import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup, ValidationErrors,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [
        RouterLink,
        NgIf,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(private _authService: AuthService,
                private _formBuilder: UntypedFormBuilder,
                private _router: Router) {}
    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.value;
        const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length <= 10 || password.length >= 20 || !specialCharacters.test(password)) {
            return { invalidPassword: true };
        }

        return null;
    }

    passwordConfirmationValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password').value;
        const confirmPassword = control.get('password_confirm').value;

        if (password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }


    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, this.passwordValidator]],
            password_confirm: ['', [Validators.required]],
            agreements: ['', Validators.requiredTrue],
        }, {
            validators: this.passwordConfirmationValidator,
        });
    }

    signUp(): void {
        console.log("ciaoje")
        if ( this.signUpForm.invalid ) {
            return;
        }
        this.signUpForm.disable();
        this.showAlert = false;

        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {
                    this._router.navigateByUrl('/confirmation-required');
                },
                (response) => {
                    this.signUpForm.enable();
                    // this.signUpNgForm.resetForm();
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.',
                    };
                    this.showAlert = true;
                },
            );
    }
}
