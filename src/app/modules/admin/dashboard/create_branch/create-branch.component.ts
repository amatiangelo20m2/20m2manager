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
        ReactiveFormsModule
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

    constructor(private dialogRef: MatDialogRef<CreateBranchComponent>,
                private _formBuilder: UntypedFormBuilder,) {
    }

    ngOnInit(): void {
        this.showAlert = false;
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

        this.dialogRef.close();
    }
}
