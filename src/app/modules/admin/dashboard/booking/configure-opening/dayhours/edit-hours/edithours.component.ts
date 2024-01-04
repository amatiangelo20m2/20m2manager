import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { DataproviderService } from "../../../../dataprovider.service";
import { BranchTimeRangeDTO, LocalTime } from "../../../../../../../core/booking";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'edithours',
    templateUrl: './edithours.component.html',
    imports: [
        MatInputModule,
        MatIconModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        NgIf,
        NgForOf
    ],
    // Add any required styles
    standalone: true
})
export class EdithoursComponent implements OnInit {
    branchTimeRangeDTO: BranchTimeRangeDTO = {};
    branchTimeForm: FormGroup;
    selectedDays: string[] = [];
    days: string[] = Object.values(BranchTimeRangeDTO.DayOfWeekEnum).filter(day => day !== 'FESTIVO');

    constructor(private fb: FormBuilder, private _dataProvideService: DataproviderService) {}

    ngOnInit(): void {
        this._dataProvideService?.branchTimeRangeDTO$?.subscribe((branchRange) => {
            console.log("Working on day: " + branchRange?.dayOfWeek);
            this.branchTimeRangeDTO = branchRange;
            this.selectedDays.push(this.branchTimeRangeDTO.dayOfWeek);

            // Initialize the form
            this.initializeForm();
        });
    }

    initializeForm() {
        const formControls = {};

        for (let i = 0; i < this.branchTimeRangeDTO.timeRanges.length; i++) {
            const timeRange = this.branchTimeRangeDTO.timeRanges[i];
            formControls[`openingTime${i}`] = [this.transform(timeRange?.startTime), Validators.required];
            formControls[`closingTime${i}`] = [this.transform(timeRange?.endTime), [Validators.required, (control) => this.validateClosingTime(control, i)]];
        }

        this.branchTimeForm = this.fb.group(formControls);
    }

    validateClosingTime(control, index) {
        const parentGroup = control?.parent;

        if (parentGroup) {
            const openingTime = parentGroup.get(`openingTime${index}`).value;

            if (openingTime && control.value < openingTime) {
                return { invalidClosingTime: true };
            }
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
        this.initializeForm();
    }

    removeTimeRange(i) {

    }
}
