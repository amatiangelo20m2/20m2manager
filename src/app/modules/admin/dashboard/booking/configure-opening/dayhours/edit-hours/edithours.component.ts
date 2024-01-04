import {Component, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import {DataproviderService} from "../../../../dataprovider.service";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {
    BookingControllerService,
    BranchTimeRangeDTO,
    LocalTime,
    TimeRange,
    TimeRangeUpdateRequest
} from "../../../../../../../core/booking";

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
    standalone: true
})
export class EdithoursComponent implements OnInit {
    branchTimeRangeDTO: BranchTimeRangeDTO = {};
    branchTimeForm: FormGroup;
    selectedDays: string[] = [];
    days: string[] = Object.values(BranchTimeRangeDTO.DayOfWeekEnum).filter(day => day !== 'FESTIVO');

    constructor(private fb: FormBuilder,
                private _dataProvideService: DataproviderService) {

    }

    ngOnInit(): void {
        this._dataProvideService?.branchTimeRangeDTO$?.subscribe((branchRange) => {
            console.log("Working on day: " + branchRange?.dayOfWeek);
            this.branchTimeRangeDTO = branchRange;
            this.selectedDays.push(this.branchTimeRangeDTO.dayOfWeek);

            this.initializeForm();

        });
    }

    initializeForm() {
        const formControls = {};

        for (let i = 0; i < this.branchTimeRangeDTO.timeRanges.length; i++) {
            console.log(this.branchTimeRangeDTO.timeRanges[i].startTime);
            console.log(this.branchTimeRangeDTO.timeRanges[i].endTime);
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
            const closingTime = control.value;

            // Check if both openingTime and closingTime have valid values
            if (openingTime && closingTime) {
                const openingDateTime = new Date(`2022-01-01T${openingTime}`);
                const closingDateTime = new Date(`2022-01-01T${closingTime}`);

                // Check if closingTime is smaller than openingTime
                if (closingDateTime < openingDateTime) {
                    return { invalidClosingTime: true, message: 'Ora chiusura deve essere successiva a ora apertura.' };
                }

                // Calculate the time difference in minutes
                const timeDifference = (closingDateTime.getTime() - openingDateTime.getTime()) / (1000 * 60);

                // Check if time difference is less than 60 minutes
                if (timeDifference <= 60) {
                    return { invalidTimeRange: true, message: 'L\'intervallo di tempo deve essere almeno di 60 minuti.' };
                    }
                }
            }

            return null;
        }
    validateTimeRangesOverlap(control: AbstractControl): ValidationErrors | null {
        const timeRanges = control.value;

        if (timeRanges && timeRanges.length > 1) {
            for (let i = 0; i < timeRanges.length - 1; i++) {
                const currentRange = timeRanges[i];

                for (let j = i + 1; j < timeRanges.length; j++) {
                    const otherRange = timeRanges[j];

                    const currentStart = this.convertTimeToMinutes(currentRange.startTime);
                    const currentEnd = this.convertTimeToMinutes(currentRange.endTime);

                    const otherStart = this.convertTimeToMinutes(otherRange.startTime);
                    const otherEnd = this.convertTimeToMinutes(otherRange.endTime);

                    // Check for overlap
                    if (
                        (currentStart <= otherStart && otherStart < currentEnd) ||
                        (otherStart <= currentStart && currentStart < otherEnd)
                    ) {
                        return { overlappingTimeRanges: true, message: 'Time ranges cannot overlap.' };
                    }
                }
            }
        }

        return null;
    }

    convertTimeToMinutes(time: LocalTime): number {
        return time.hour * 60 + time.minute;
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

        this._dataProvideService.branch$.subscribe((branch)=>{
            this._dataProvideService.updateTimeRange({
                branchCode : branch.branchCode,
                listConfIds : this._dataProvideService.fromCurrentTimeRangeListRetrieveIdsByDaysSelected(this.selectedDays),
                timeRanges: this.buildTimeRangesFromFormData()
            })
        });
    }

    private buildTimeRangesFromFormData() : Array<TimeRangeUpdateRequest>{

        let timeRanges: TimeRangeUpdateRequest[] = [];

        //TODO put the hours and minutes into the request
        for (let i = 0; i < this.branchTimeRangeDTO.timeRanges.length; i++) {
            const openingTimeValue = this.branchTimeForm.get(`openingTime${i}`).value;
            const closingTimeValue = this.branchTimeForm.get(`closingTime${i}`).value;

            console.log(`Time Range ${i + 1} - Opening Time: ${openingTimeValue}, Closing Time: ${closingTimeValue}`);
            timeRanges.push({
                startTimeHour: openingTimeValue.charAt(0)+openingTimeValue.charAt(1),
                startTimeMinutes: openingTimeValue.charAt(3)+openingTimeValue.charAt(4),
                endTimeHour: closingTimeValue.charAt(0)+closingTimeValue.charAt(1),
                endTimeMinutes: closingTimeValue.charAt(3)+closingTimeValue.charAt(4),
            });
        }

        return timeRanges;
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
        if (i >= 0 && i < this.branchTimeRangeDTO.timeRanges.length) {
            this.branchTimeRangeDTO.timeRanges.splice(i, 1);

            // Clear the form array
            const timeRangesFormArray = this.branchTimeForm.get('timeRanges') as FormArray;
            timeRangesFormArray?.clear();

            // Rebuild the form array based on the updated timeRanges
            for (let j = 0; j < this.branchTimeRangeDTO.timeRanges.length; j++) {
                const timeRange = this.branchTimeRangeDTO.timeRanges[j];
                timeRangesFormArray.push(
                    this.fb.group({
                        openingTime: [this.transform(timeRange.startTime), Validators.required],
                        closingTime: [this.transform(timeRange.endTime), [Validators.required, (control) => this.validateClosingTime(control, j)]],
                    })
                );
            }
        }
    }
}
