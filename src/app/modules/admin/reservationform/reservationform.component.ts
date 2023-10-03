import {Component, ViewEncapsulation} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
@Component({
    selector: 'app-reservationform',
    standalone   : true,
    templateUrl: './reservationform.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule]
})
export class ReservationformComponent {
    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    branchname: string;

    constructor(private _formBuilder: UntypedFormBuilder) {
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
        this.branchname = '20m2 Cisternino';
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email   : ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]]
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                requests    : [''],
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),

        });

        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email   : ['', [Validators.required, Validators.email]],
                country : ['', Validators.required],
                language: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                about    : [''],
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }
}
