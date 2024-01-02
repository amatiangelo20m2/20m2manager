import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Subject, takeUntil} from "rxjs";
import {DataproviderService} from "./dataprovider.service";
import {NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {User} from "../../../core/user/user.types";
import {BranchResponseEntity} from "../../../core/dashboard";
import {MatDrawer, MatSidenavModule} from "@angular/material/sidenav";
import {FuseMediaWatcherService} from "../../../../@fuse/services/media-watcher";
import {BookingDashboardComponent} from "./booking/booking-dashboard.component";
import {SettingsSecurityComponent} from "./security/security.component";
import {SettingsPlanBillingComponent} from "../../pages/settings/plan-billing/plan-billing.component";
import {SettingsNotificationsComponent} from "./notifications/notifications.component";
import {SettingsTeamComponent} from "./team/team.component";
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone     : true,
    imports: [MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        BookingDashboardComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent, NgIf],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('drawer') drawer: MatDrawer;

    data: any;
    user : User;
    currentBranch : BranchResponseEntity;

    currentBranchList : BranchResponseEntity[];
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'booking';

    /**
     * Constructor
     */
    constructor(private _dataProvideService: DataproviderService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _fuseMediaWatcherService: FuseMediaWatcherService,) {
    }

    ngOnInit(): void {
        this.panels = [
            {
                id         : 'booking',
                icon       : 'heroicons_outline:calendar-days',
                title      : 'Prenotazioni',
                description: 'Booking',
            },
            {
                id         : 'advertising',
                icon       : 'heroicons_outline:device-phone-mobile',
                title      : 'Campagne Pubblicitarie',
                description: 'Advertising Campaigns',
            },
            {
                id         : 'catering',
                icon       : 'mat_outline:local_bar',
                title      : 'Catering',
                description: 'Catering and Events',
            },
            {
                id         : 'team',
                icon       : 'heroicons_outline:user-group',
                title      : 'Team',
                description: 'Manage your existing team and change roles/permissions',
            },
        ];

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.user = this._dataProvideService.user;

        this._dataProvideService.branches$.subscribe((branches) => {
            this.currentBranchList = branches;
        });

        this._dataProvideService.branch$.subscribe((branch) => {
           this.currentBranch = branch;
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
    }

    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

}
