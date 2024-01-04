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
export class EdithoursComponent implements OnInit{

    branchTimeRangeDTO : BranchTimeRangeDTO = {};
    branchTimeForm: FormGroup;
    selectedDays: string[] = [];

    days: string[] = Object.values(BranchTimeRangeDTO.DayOfWeekEnum).filter(day => day !== 'FESTIVO');
    constructor(private fb: FormBuilder,
                private _dataProvideService: DataproviderService) {}

    hours: number;
    minutes: number;

    ngOnInit(): void {
        this._dataProvideService?.branchTimeRangeDTO$?.subscribe((branchRange)=>{
            console.log("Working on day : " + branchRange?.dayOfWeek)
            this.branchTimeRangeDTO = branchRange;


            this.selectedDays.push(this.branchTimeRangeDTO.dayOfWeek);
            for (let i = 0; i < this.branchTimeRangeDTO.timeRanges.length; i++) {
                const timeRange = this.branchTimeRangeDTO.timeRanges[i];
                console.log(`Index: ${i}, startTime: ${timeRange.startTime}, endTime: ${timeRange.endTime}`);
                this.branchTimeForm.addControl('startTime'+i, this.fb.control(this.transform(timeRange?.startTime), Validators.required));
                this.branchTimeForm.addControl('endTime'+i, this.fb.control(this.transform(timeRange?.endTime), Validators.required));
            }
        });
    }

    transform(localTime: LocalTime): string {
        if (!localTime) {
            return '';
        }
        // Extract hours and minutes
        const hours = localTime.toString().split(':')[0];
        const minutes = localTime.toString().split(':')[1];


        return `${hours}:${minutes}`;
    }

    // Write value to the input
    writeValue(value: any): void {
        const [hours, minutes] = (value || '').split(':').map(Number);
        this.hours = hours;
        this.minutes = minutes;
    }

    saveConfiguration() {

        console.log(this.branchTimeForm);
        console.log(this.selectedDays);
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
            open: false,
        });
        console.log(this.branchTimeRangeDTO.timeRanges.length)
    }

    removeTimeRange(i: number) {

    }
}
