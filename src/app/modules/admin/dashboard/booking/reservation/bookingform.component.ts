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
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCardModule} from "@angular/material/card";
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
        MatButtonToggleModule,
        NgClass,
        NgForOf,
        NgIf,
        MatDatepickerModule,
        MatCardModule,
        DatePipe,
    ],
    standalone: true
})
export class    BookingformComponent implements OnInit{

    branchCode: string;

    ngOnInit(): void {

        this.route.queryParams.subscribe((params) => {
            this.branchCode = params['branchCode'];
            console.log('Branch Code from URL:', this.branchCode);
        });
    }


    reservationForm: UntypedFormGroup;
    numbers$ = Array.from({ length: 24 }, (_, index) => index + 1);
    selectedNumber: any;


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

    selectNumber(number: any) {
        this.selectedNumber = number;
    }

    selectedToggle: string = "date";
    selectedDate: Date = null;


    selectToggle(value: string): void {
        this.selectedToggle = value;
    }

    onSelect(event){
        this.selectedDate = event;
        this.selectedToggle = 'pax';
    }

    transform(value: any, format: string = 'yyyy-MM-dd'): any {

        if (value) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(value, format);
        }
        return null;
    }

}
