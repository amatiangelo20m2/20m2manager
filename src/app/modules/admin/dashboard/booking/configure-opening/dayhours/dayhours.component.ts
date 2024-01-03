import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DataproviderService} from "../../../dataprovider.service";
import {BranchResponseEntity} from "../../../../../../core/dashboard";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {BranchTimeRangeDTO, LocalTime, RestaurantConfigurationDTO, TimeRange} from "../../../../../../core/booking";
import MealTypeEnum = TimeRange.MealTypeEnum;
import {EdithoursComponent} from "./edit-hours/edithours.component";

@Component({
    selector: 'app-dayhours',
    templateUrl: './dayhours.component.html',
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatGridListModule,
        MatIconModule,
        NgForOf,
        MatTableModule,
    ],
    standalone: true
})
export class DayhoursComponent implements OnInit{

    currentBranch : BranchResponseEntity;
    restaurantConfigurationDTO: RestaurantConfigurationDTO;

    displayedColumns: string[] = ['day', 'lunch', 'dinner', 'edit'];
    dataSource : BranchTimeRangeDTO[] = [];

    constructor(private _dataProvideService: DataproviderService,
                private cdr: ChangeDetectorRef,
                private _matDialog: MatDialog,) {

    }

    ngOnInit(): void {

        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
            this.cdr.detectChanges();
        });

        this._dataProvideService.restaurantConfiguration$.subscribe((restaurantConfiguration)=>{
            this.restaurantConfigurationDTO = restaurantConfiguration;


            this.dataSource = this.restaurantConfigurationDTO?.branchTimeRanges.map((branchTime: BranchTimeRangeDTO) => {
                return branchTime;
            }) || [];


            this.cdr.detectChanges();
        });
    }

    getLunchTime(timeRanges: Array<TimeRange>) {

        if(timeRanges.find(timeRange=> MealTypeEnum.PRANZO == timeRange.mealType)?.open == true){
            return timeRanges.find(timeRange=> MealTypeEnum.PRANZO == timeRange.mealType)?.startTime + '  - ' + timeRanges.find(timeRange=> MealTypeEnum.PRANZO == timeRange.mealType).endTime;
        }else{
            return 'CHIUSO';
        }
    }

    getDinnerTime(timeRanges: Array<TimeRange>) {
        if(timeRanges.find(timeRange=> MealTypeEnum.CENA == timeRange.mealType)?.open == true){
            return this.transform(timeRanges.find(timeRange=> MealTypeEnum.CENA == timeRange.mealType)?.startTime)
                + ' - ' + this.transform(timeRanges.find(timeRange=> MealTypeEnum.CENA == timeRange.mealType).endTime);
        }else{
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

    editHour(timeRange: BranchTimeRangeDTO) {
        this._dataProvideService.setBranchTimeRangeDTOToUpdate(timeRange)
        this._matDialog.open(EdithoursComponent, {autoFocus: false});
    }
}
