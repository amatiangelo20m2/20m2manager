import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatListModule} from "@angular/material/list";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {DayhoursComponent} from "./dayhours/dayhours.component";
import {BranchResponseEntity} from "../../../../../core/dashboard";
import {DataproviderService} from "../../dataprovider.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {BookingControllerService, RestaurantConfigurationDTO} from "../../../../../core/booking";

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
        NgIf
    ],
    standalone: true
})
export class ConfigureOpeningComponent implements OnInit{

    currentBranch : BranchResponseEntity;

    protected readonly url = "url";
    buttonConfigurationClick: boolean = false;
    restaurantConfigurationDTO : RestaurantConfigurationDTO;

    ngOnInit() {
        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
            this.cdr.detectChanges();
        });

        this._bookingControllerService.checkWaApiStatus(this.currentBranch.branchCode)
            .subscribe((bookingConfDTO : RestaurantConfigurationDTO) =>{
                this.restaurantConfigurationDTO = bookingConfDTO;
                this.cdr.detectChanges();
            });
    }


    constructor(private _matDialog: MatDialog,
                private _dataProvideService: DataproviderService,
                private _bookingControllerService: BookingControllerService,
                private cdr: ChangeDetectorRef) {
    }


    openEditLabelsDialog() {
        this._matDialog.open(DayhoursComponent, {autoFocus: false});
    }

}
