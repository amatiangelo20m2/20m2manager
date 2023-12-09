import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {inject} from "@angular/core";
import {ProjectService} from "./project.service";

export default [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            data: () => inject(ProjectService).getData(),
        },
    },
] as Routes;
