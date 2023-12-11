import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {inject} from "@angular/core";
import {DashboardService} from "./dashboard.service";

export default [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            branchList: () => inject(DashboardService).getBranches(),
            data: () => inject(DashboardService).getData(),
        },
    },
] as Routes;
