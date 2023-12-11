import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {ApexOptions, NgApexchartsModule} from "ng-apexcharts";
import {MatMenuModule} from "@angular/material/menu";
import {Subject, takeUntil} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {DashboardService} from "./dashboard.service";
import {MatTableModule} from "@angular/material/table";
import {CurrencyPipe, NgClass, NgFor, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslocoModule} from "@ngneat/transloco";
import {MatDialog} from "@angular/material/dialog";
import {CreateBranchComponent} from "./create_branch/create-branch.component";
import {ViewportRuler} from "@angular/cdk/overlay";
import {UserService} from "../../../core/user/user.service";
import {User} from "../../../core/user/user.types";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {BranchResponseEntity} from "../../../core/dashboard/branch";
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
        MatSnackBarModule
    ],
  standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
  chartGithubIssues: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  data: any;
  selectedProject: string = '20m2 Cisternino';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user : User;
  branchList : BranchResponseEntity[] = [];

  /**
   * Constructor
   */
  constructor(
      private _dashboardService: DashboardService,
      private _router: Router,
      private _service: AuthService,
      private _userService: UserService,
      private _dialog: MatDialog,
      private viewportRuler: ViewportRuler)
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    console.log('access token;- ' + this._service.accessToken);

    this.qrCodeData = "data:image/png;base64,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";
      // Subscribe to the user service
      this._userService.user$
          .pipe((takeUntil(this._unsubscribeAll)))
          .subscribe((user: User) => {
              this.user = user;
          });

    this._dashboardService.data$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
          // Store the data
          this.data = data;

          console.log("this : " + this.data)
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
    qrCodeData: any;

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


        dialogRef.afterClosed().subscribe(result => {
        });

    }
}
