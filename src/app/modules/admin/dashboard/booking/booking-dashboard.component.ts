import { TextFieldModule } from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {DataproviderService} from "../dataprovider.service";
import {BranchResponseEntity} from "../../../../core/dashboard";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {I18nPluralPipe, NgIf} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {WaApiConfigDTO, WaapiControllerService} from "../../../../core/booking";
import {interval, take, takeWhile, timer} from "rxjs";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ConfigureOpeningComponent} from "./configure-opening/configure-opening.component";

@Component({
    selector       : 'booking-dashboard',
    templateUrl    : './booking-dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgIf,
        MatStepperModule, I18nPluralPipe, MatButtonToggleModule, MatExpansionModule, MatDatepickerModule, ConfigureOpeningComponent],
})
export class BookingDashboardComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    currentBranch : BranchResponseEntity;
    qrCodeImage: String = '';

    waapiConf : WaApiConfigDTO;

    constructor(private _formBuilder: UntypedFormBuilder,
                private _dataProvideService: DataproviderService,
                private _waapiControllerService: WaapiControllerService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {

        this.accountForm = this._formBuilder.group({
            name    : ['Brian Hughes'],
            username: ['brianh'],
            title   : ['Senior Frontend Developer'],
            company : ['YXZ Software'],
            about   : ['Hey! This is Brian; husband, father and gamer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
            email   : ['hughes.brian@mail.com', Validators.email],
            phone   : ['121-490-33-12'],
            country : ['usa'],
            language: ['english'],
        });

        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
            this.cdr.detectChanges();
        });

        this._waapiControllerService.checkWaApiStatus(this.currentBranch.branchCode).subscribe((waApiStatusConf) =>{
            this.waapiConf = waApiStatusConf;
            this.cdr.detectChanges();
        });


    }


    buttonConfigurationClick : boolean = false;
    remainingSeconds: number = 0;
    panelOpenState: boolean = true;

    configureNumber() {
        this.buttonConfigurationClick = true;
        this._waapiControllerService
            .configureNumberForWhatsAppMessaging(this.currentBranch.branchCode).subscribe((waApiConfigDTO) =>{
                this.waapiConf = waApiConfigDTO;
                this.qrCodeImage = waApiConfigDTO.lastQrCode;
                this.buttonConfigurationClick = false;
                this.remainingSeconds = 60;

                interval(5000)
                    .pipe(takeWhile(() => this.loopConditionMet())) // Maximum 75 seconds
                    .subscribe(() => {


                        this._waapiControllerService.checkWaApiStatus(this.currentBranch.branchCode)
                            .subscribe((waApiConfigDTO)=>{
                                this.waapiConf = waApiConfigDTO;
                                console.log('Current status: ' + this.waapiConf?.instanceStatus)
                                if (this.waapiConf != null && this.waapiConf.instanceStatus === 'OK') {
                                    console.log('Loop condition met. Stopping the loop.');
                                    this.remainingSeconds = 0;
                                }
                        });

                        this.remainingSeconds -= 5;
                        if (!this.loopConditionMet()) {
                            console.log('Error - Cannot configure it. Retry');
                        }
                        this.cdr.detectChanges();
                    });


            }
        );
    }

    loopConditionMet(): boolean {
        // Define your loop condition here
        // For example, perform the loop for a maximum of 25 iterations (75 seconds)
        return this.remainingSeconds > 0;
    }

}
