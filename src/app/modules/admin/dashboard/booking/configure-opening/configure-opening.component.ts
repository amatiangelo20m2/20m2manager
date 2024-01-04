import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatListModule} from "@angular/material/list";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {DayhoursComponent} from "./dayhours/dayhours.component";
import {BranchResponseEntity} from "../../../../../core/dashboard";
import {DataproviderService} from "../../dataprovider.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
    BookingControllerService,
    BranchTimeRangeDTO, LocalTime,
    RestaurantConfigurationDTO,
    TimeRange
} from "../../../../../core/booking";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTabsModule} from "@angular/material/tabs";
import {EdithoursComponent} from "./dayhours/edit-hours/edithours.component";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";


@Component({
    selector: 'configure-opening',
    templateUrl: './configure-opening.component.html',
    styleUrls: ['./configure-opening.component.css'],
    imports: [
        MatDatepickerModule,
        MatListModule,
        MatButtonToggleModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatSlideToggleModule,
        FormsModule,
        NgForOf,
        MatProgressSpinnerModule,
        NgIf,
        MatTableModule,
        MatTooltipModule,
        MatTabsModule,
        MatSelectModule,
        MatCheckboxModule
    ],
    standalone: true
})
export class ConfigureOpeningComponent implements OnInit{

    currentBranch : BranchResponseEntity;
    url = "";
    restaurantConfigurationDTO : RestaurantConfigurationDTO;
    dataSource : BranchTimeRangeDTO[] = [];
    urlform: FormGroup;

    restaurantConfigForm: FormGroup;
    restaurantConfigDTO: RestaurantConfigurationDTO;

    ngOnInit() {
        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;

            this.url = 'http://localhost:4200/reservation?branchCode=' + this.currentBranch.branchCode;
            this.urlform = this.fb.group({
                url: [this.url, /* Other Validators if needed */],
                iframe: [`<iframe src="${this.url}" width="600" height="400" frameborder="0" allowfullscreen></iframe>\n`]
            });
            // this.cdr.detectChanges();
        });

        this._bookingControllerService.checkWaApiStatus(this.currentBranch.branchCode)
            .subscribe((bookingConfDTO : RestaurantConfigurationDTO) =>{
                this.restaurantConfigurationDTO = bookingConfDTO;
                this.restaurantConfigForm = this.fb.group({
                    guests: [this.restaurantConfigDTO?.guests ?? 0, Validators.required],
                    allowOverbooking: [this.restaurantConfigDTO?.allowOverbooking ?? false],
                    confirmReservation: [this.restaurantConfigDTO?.confirmReservation ?? false],
                    bookingSlotInMinutes: [this.restaurantConfigDTO?.bookingSlotInMinutes ?? 0, Validators.required],
                    recoveryNumber: [this.restaurantConfigDTO?.recoveryNumber ?? '', Validators.required]
                });
                // this.cdr.detectChanges();
            });

        this._dataProvideService?.restaurantConfiguration$.subscribe((restaurantConfiguration)=>{
            this.restaurantConfigurationDTO = restaurantConfiguration;


            this.dataSource = this.restaurantConfigurationDTO?.branchTimeRanges.map((branchTime: BranchTimeRangeDTO) => {
                return branchTime;
            }) || [];

            // this.cdr.detectChanges();
        });
    }

    saveConfiguration(): void {
        // Check if the form is valid
        if (this.restaurantConfigForm.valid) {
            // Update the instance with the form values
            this.restaurantConfigDTO = { ...this.restaurantConfigForm.value };

            // Call your API to save the modified object
            // Example: this.apiService.updateConfiguration(this.restaurantConfigDTO);
        } else {
            // Handle invalid form
            console.log('Invalid form. Please check the entered values.');
        }
    }

    constructor(private _matDialog: MatDialog,
                private _dataProvideService: DataproviderService,
                private _bookingControllerService: BookingControllerService,
                // private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                // private clipboard: Clipboard,
                // private snackBar: MatSnackBar
    ) {
    }


    openEditLabelsDialog() {
        this._matDialog.open(DayhoursComponent, {autoFocus: false});
    }
    getTime(timeRanges: Array<TimeRange>) {
        var timeSlotToShow = '';
        if(timeRanges.length > 0){
            timeRanges.forEach((timeRange)=>{
                    timeSlotToShow = timeSlotToShow + '[' +this.transform(timeRange?.startTime) + '-' + this.transform(timeRange.endTime) + '] ';
                }

            );
            return timeSlotToShow;
        }else {
            return 'CHIUSO';
        }
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

    copyUrl() {
        // this.clipboard.writeText(this.url);
        // this.snackBar.open('Copied to clipboard', 'Close', {
        //     duration: 2000,
        // });
    }

    editHour(timeRange: BranchTimeRangeDTO) {
        this._dataProvideService.setBranchTimeRangeDTOToUpdate(timeRange)
        this._matDialog.open(EdithoursComponent, {autoFocus: false});
    }
}
