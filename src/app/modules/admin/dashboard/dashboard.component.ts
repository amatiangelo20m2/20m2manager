import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {ApexOptions, NgApexchartsModule} from "ng-apexcharts";
import {MatMenuModule} from "@angular/material/menu";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {DashboardService} from "./dashboard.service";
import {MatTableModule} from "@angular/material/table";
import {CurrencyPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslocoModule} from "@ngneat/transloco";
import {MatDialog} from "@angular/material/dialog";
import {CreateBranchComponent} from "./create_branch/create-branch.component";
import {ViewportRuler} from "@angular/cdk/overlay";
import {UserService} from "../../../core/user/user.service";
import {User} from "../../../core/user/user.types";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BranchControllerService, BranchResponseEntity} from "../../../core/dashboard/branch";
import {MatTooltipModule} from "@angular/material/tooltip";

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
        CreateBranchComponent,
        MatSnackBarModule,
        MatTooltipModule
    ],
    standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};

    chartYearlyExpenses: ApexOptions = {};
    data: any;

    user : User;
    _branches : BranchResponseEntity[];
    _currentBranch : BranchResponseEntity = null;
    /**
     * Constructor
     */
    constructor(
        private _dashboardService: DashboardService,
        private _router: Router,
        private _branchControllerService: BranchControllerService,
        private _userService: UserService,
        private _dialog: MatDialog,
        private viewportRuler: ViewportRuler) {
    }

    ngOnInit(): void {

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
                this._userService.user$.pipe(
                    (takeUntil(this._unsubscribeAll)))
                    .subscribe((user: User) => {
                        console.log("Retrieve branches with code : " + user.userCode)
                        this._branchControllerService.branchResponseEntityList(user.userCode).subscribe(
                            value => {
                                this._branches = value;
                                if(this._branches){
                                    let branchCodeRetrieved = localStorage.getItem("branchCode") ?? '';

                                    if(branchCodeRetrieved == ''){
                                        this.selectBranch(value[0]);
                                    }else{
                                        this.selectBranch(
                                            this._branches.find(branch => branch.branchCode === branchCodeRetrieved) ?? value[0]
                                        );
                                    }
                                }
                            }
                        );
                    });
            });

        this._dashboardService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) =>
            {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0,
                },
            },
            grid       : {
                borderColor: 'var(--fuse-border)',
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: [3, 0],
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            xaxis      : {
                axisBorder: {
                    show: false,
                },
                axisTicks : {
                    color: 'var(--fuse-border)',
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip   : {
                    enabled: false,
                },
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'polarArea',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            labels     : this.data.taskDistribution.labels,
            legend     : {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings : {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.taskDistribution.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke     : {
                width: 2,
            },
            theme      : {
                monochrome: {
                    enabled       : true,
                    color         : '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo       : 'dark',
                },
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark',
            },
            yaxis      : {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'radar',
                sparkline : {
                    enabled: true,
                },
            },
            colors     : ['#811CF8'],
            dataLabels : {
                enabled   : true,
                formatter : (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style     : {
                    fontSize  : '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding    : 4,
                },
                offsetY   : -15,
            },
            markers    : {
                strokeColors: '#811CF8',
                strokeWidth : 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors   : 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series     : this.data.budgetDistribution.series,
            stroke     : {
                width: 2,
            },
            tooltip    : {
                theme: 'dark',
                y    : {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis      : {
                labels    : {
                    show : true,
                    style: {
                        fontSize  : '12px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budgetDistribution.categories,
            },
            yaxis      : {
                max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#22D3EE'],
            series : this.data.weeklyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.weeklyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#4ADE80'],
            series : this.data.monthlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.monthlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart  : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#FB7185'],
            series : this.data.yearlyExpenses.series,
            stroke : {
                curve: 'smooth',
            },
            tooltip: {
                theme: 'dark',
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.yearlyExpenses.labels,
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`,
                },
            },
        };
    }

    openModalCreateActivity() {
        const screenWidth = this.viewportRuler.getViewportSize().width;

        // Calculate the modal width (one-third of the screen width)
        const modalWidth = Math.floor(screenWidth / 2);

        // Open the modal with the calculated width
        const dialogRef = this._dialog.open(CreateBranchComponent, {
            width: `${modalWidth}px`,
        });


        dialogRef.afterClosed().subscribe(branch => {
            if (branch) {
                this.addBranch(branch);
            }
        });

    }


    selectBranch(branch: BranchResponseEntity) {
        localStorage.setItem('branchCode', branch.branchCode);
        this._currentBranch = branch;
    }

    private addBranch(branch: BranchResponseEntity) {
        this._branches.push(branch);
        if(this._branches.length == 1){
            this.selectBranch(this._branches[0]);
        }
    }
}
