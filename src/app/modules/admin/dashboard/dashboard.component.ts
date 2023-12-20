import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatMenuModule} from "@angular/material/menu";
import {Subject} from "rxjs";
import {DataproviderService} from "./dataprovider.service";
import {MatTableModule} from "@angular/material/table";
import {CurrencyPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslocoModule} from "@ngneat/transloco";
import {User} from "../../../core/user/user.types";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SettingsComponent} from "../../pages/settings/settings.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {BookingformComponent} from "./booking/reservation/bookingform.component";
import {BranchResponseEntity} from "../../../core/dashboard";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        NgFor,
        NgIf,
        MatTableModule,
        NgClass,
        CurrencyPipe,
        MatSnackBarModule,
        MatTooltipModule,
        SettingsComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        BookingformComponent
    ],
    standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    data: any;
    user : User;
    currentBranch : BranchResponseEntity;
    currentBranchList : BranchResponseEntity[];

    /**
     * Constructor
     */
    constructor(private _dashboardService: DataproviderService) {
    }

    ngOnInit(): void {
        this.user = this._dashboardService.user;

        this._dashboardService.branches$.subscribe((branches) => {
            this.currentBranchList = branches;
        });

        this._dashboardService.branch$.subscribe((branch) => {
           this.currentBranch = branch;
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
