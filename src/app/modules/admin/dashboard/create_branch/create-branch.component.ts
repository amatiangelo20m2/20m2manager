import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {FuseAlertComponent, FuseAlertType} from "../../../../../@fuse/components/alert";
import {BranchControllerService, BranchCreationEntity} from "../../../../core/dashboard/branch";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {catchError, throwError} from "rxjs";
import {UserService} from "../../../../core/user/user.service";
import {User} from "../../../../core/user/user.types";

interface BranchForm {
    name: string;
    address: string;
    email: string;
    phone: string;
    type: 'RESTAURANT' | 'SUPPLIER';
}

@Component({
    selector: 'app-create-branch',
    templateUrl: './create-branch.component.html',
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        NgIf,
        FuseAlertComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
    ],
    standalone: true
})
export class CreateBranchComponent implements OnInit{

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    branchForm: UntypedFormGroup;
    showAlert: boolean = false;
    user : User;

    branchEntity : BranchCreationEntity;

    constructor(private dialogRef: MatDialogRef<CreateBranchComponent>,
                private _formBuilder: UntypedFormBuilder,
                private _branchService: BranchControllerService,
                private _userService: UserService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.showAlert = false;
        this.branchEntity = {};

        this._userService.user$.subscribe((user) => {
            this.user = user;
        });

        this.branchForm = this._formBuilder.group({
            name : ['', [Validators.required]],
            address : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            type: ['RESTAURANT']
        });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onSaveClick(): void {
        console.log('Form Data:', this.branchForm.value);

        if ( this.branchForm.invalid ) {
            return;
        }

        this.branchForm.disable();
        this.showAlert = false;



        this.branchEntity = {
            name: this.branchForm.get('name').value,
            address: this.branchForm.get('address').value,
            email: this.branchForm.get('email').value,
            phone: this.branchForm.get('phone').value,
            vat: this.branchForm.get('phone').value,
            type: this.branchForm.get('type').value,
            userCode: this.user.userCode,
        }

        this._branchService.save(this.branchEntity).pipe(
            catchError((error) => {
                this._snackBar.open('error: ' + error.statusCode, 'Undo', {
                    duration: 3000
                });
                return throwError(error);
            })
        ).subscribe(
            (branchResponseEntity) => {
                this._snackBar.open('Attività creata con successo', 'Undo', {
                    duration: 3000,
                });

                console.log('valeria' + branchResponseEntity.branchCode)

                this.dialogRef.close({
                    resultData: branchResponseEntity
                });
            }
        );


    }
}
