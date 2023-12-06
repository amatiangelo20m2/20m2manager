import { Component, ViewEncapsulation } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatCardModule,
        MatDatepickerModule,
        MatInputModule,
        FormsModule
    ]
})
export class ExampleComponent
{
    selectedDate: any;
    /**
     * Constructor
     */
    constructor() {
    }

    onSelect($event: any) {

    }
}
