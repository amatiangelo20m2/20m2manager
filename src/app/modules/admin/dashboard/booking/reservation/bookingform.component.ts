import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {BranchControllerService} from "../../../../../core/dashboard/branch";
import {ActivatedRoute} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'bookingform',
    templateUrl: './bookingform.component.html',
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatButtonModule,
    ],
    standalone: true
})
export class    BookingformComponent implements OnInit{

    branchCode: string;

    ngOnInit(): void {

        this.route.queryParams.subscribe((params) => {
            // Get the branchCode from the query parameter
            this.branchCode = params['branchCode'];
            // You can use this.branchCode as needed, e.g., to update the form
            console.log('Branch Code from URL:', this.branchCode);
        });
    }


    reservationForm: UntypedFormGroup;
    unlockSessionForm: UntypedFormGroup;
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private branchController : BranchControllerService
        ) {
        this.reservationForm = this.fb.group({
            phone: ['', Validators.required],
            phonePrefix: ['', Validators.required],
        });

        this.reservationForm.get('phone').valueChanges.subscribe((value: string) => {
            if (value.length === 10) {
                console.log('trigger e method', value);
            }
        });

    }

    unlock() {

    }
}
