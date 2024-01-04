import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {DataproviderService} from "../../../../dataprovider.service";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {NgxMaskDirective} from "ngx-mask";
import {BranchTimeRangeDTO, LocalTime} from "../../../../../../../core/booking";


@Component({
    selector: 'edithours',
    templateUrl: './edithours.component.html',
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatGridListModule,
        MatIconModule,
        NgForOf,
        MatTableModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonToggleModule,
        NgxMaskDirective,
        NgIf,
    ],
    standalone: true
})
export class EdithoursComponent implements OnInit {

    branchTimeRangeDTO: BranchTimeRangeDTO = {};

    branchTimeForm: FormGroup;

    selectedDays: string[] = [];
    days: string[] = Object.values(BranchTimeRangeDTO.DayOfWeekEnum).filter(day => day !== 'FESTIVO');

    constructor(private fb: FormBuilder, private _dataProvideService: DataproviderService) {

    }

    ngOnInit(): void {
        this._dataProvideService?.branchTimeRangeDTO$?.subscribe((branchRange) => {
            console.log("Working on day: " + branchRange?.dayOfWeek);

            this.branchTimeForm = this.fb.group({
                openingTime: ['', Validators.required],
                closingTime: ['', [Validators.required, this.validateClosingTime]],
            });

            this.branchTimeRangeDTO = branchRange;
            this.selectedDays.push(this.branchTimeRangeDTO.dayOfWeek);

        });
    }

    validateClosingTime(control) {
        const openingTime = control?.parent?.get('openingTime').value;

        if (openingTime && control.value < openingTime) {
            return { invalidClosingTime: true };
        }

        return null;
    }

    transform(localTime: LocalTime): string {
        if (!localTime) {
            return '';
        }
        const hours = localTime.toString().split(':')[0];
        const minutes = localTime.toString().split(':')[1];
        return `${hours}:${minutes}`;
    }

    saveConfiguration() {
        console.log(this.branchTimeForm);
        console.log(this.selectedDays);
        if (this.branchTimeForm.valid) {
            // Do something with the form values
            console.log(this.branchTimeForm.value);
        } else {
            // Handle invalid form
            console.log('Form is invalid');
        }
    }

    addTimeRange() {
        this.branchTimeRangeDTO.timeRanges.push({
            startTime: {
                hour: 0,
                minute: 0,
            },
            endTime: {
                hour: 0,
                minute: 0,
            },
        });
        //
        // console.log(this.branchTimeRangeDTO.timeRanges);
    }

}
