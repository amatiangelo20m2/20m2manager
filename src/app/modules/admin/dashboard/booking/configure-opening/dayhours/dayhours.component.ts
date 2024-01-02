import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {DataproviderService} from "../../../dataprovider.service";
import {BranchResponseEntity} from "../../../../../../core/dashboard";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";

export interface OpeningTime {
    day: string;
    lunch: number;
    symbol: string;
}
const OPENING_DATA: OpeningTime[] = [
    {day: 'Lunedi', lunch: 1.0079, symbol: 'H'},
    {day: 'Martedi', lunch: 4.0026, symbol: 'He'},
    {day: 'Mercoledi', lunch: 6.941, symbol: 'Li'},
    {day: 'Giovedi', lunch: 9.0122, symbol: 'Be'},
    {day: 'Venerdi', lunch: 10.811, symbol: 'B'},
    {day: 'Sabato', lunch: 12.0107, symbol: 'C'},
    {day: 'Domenica', lunch: 14.0067, symbol: 'N'},
];


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
    displayedColumns: string[] = ['giorno', 'weight', 'symbol'];
    currentBranch : BranchResponseEntity;
    days : any;
    dataSource = OPENING_DATA;
    editDay(day: any): void {
        // Implement edit logic for the selected day
        console.log('Edit day:', day);
    }

    constructor(private _dataProvideService: DataproviderService,
                private cdr: ChangeDetectorRef) {

    }


    ngOnInit(): void {
        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
            this.cdr.detectChanges();
        });
        this.days = [
            { name: 'Lunedi', icon: 'edit' },
            { name: 'Martedi', icon: 'edit' },
            { name: 'Mercoledi', icon: 'edit' },
            { name: 'Giovedi', icon: 'edit' },
            { name: 'Venerdi', icon: 'edit' },
            { name: 'Sabato', icon: 'edit' },
            { name: 'Domenica', icon: 'edit' }
        ];

    }


}
