import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {DataproviderService} from "../../../../dataprovider.service";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BranchTimeRangeDTO} from "../../../../../../../core/booking";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import DayOfWeekEnum = BranchTimeRangeDTO.DayOfWeekEnum;


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
    ],
    standalone: true
})
export class EdithoursComponent implements OnInit{

    branchTimeRangeDTO : BranchTimeRangeDTO = {};
    branchTimeForm: FormGroup;
    selectedDays: string[] = [];

    days: string[] = Object.values(BranchTimeRangeDTO.DayOfWeekEnum).filter(day => day !== 'FESTIVO');
    constructor(private fb: FormBuilder,
                private _dataProvideService: DataproviderService) {


    }

    hours: number;
    minutes: number;

    // Function to call when the value changes
    onChange: any = () => {};

    // Function to call when the input is touched
    onTouched: any = () => {};

    ngOnInit(): void {

        this.days
        this.branchTimeRangeDTO = this._dataProvideService.branchTimeRangeDTO;
        console.log("Set this day as default: {}", this.branchTimeRangeDTO.dayOfWeek);
        this.selectedDays.push(this.branchTimeRangeDTO.dayOfWeek);
        this.branchTimeForm = this.fb.group({
            openingTimePranzo: [this.branchTimeRangeDTO.timeRanges[0].startTime, Validators.required],
            closingTimePranzo: [this.branchTimeRangeDTO.timeRanges[0].endTime, Validators.required],
            openingTimeCena: [this.branchTimeRangeDTO.timeRanges[1].startTime, Validators.required],
            closingTimeCena: [this.branchTimeRangeDTO.timeRanges[1].endTime, Validators.required],
        });
    }

    // Write value to the input
    writeValue(value: any): void {
        const [hours, minutes] = (value || '').split(':').map(Number);
        this.hours = hours;
        this.minutes = minutes;
    }

    // Register function to be called when the value changes
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // Register function to be called when the input is touched
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    saveConfiguration() {

        console.log(this.branchTimeForm);
        console.log(this.selectedDays);
    }
}
