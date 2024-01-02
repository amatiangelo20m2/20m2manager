import {TextFieldModule} from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {DataproviderService} from "../dataprovider.service";
import {BranchResponseEntity} from "../../../../core/dashboard";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {I18nPluralPipe, NgIf} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {interval, takeWhile} from "rxjs";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ConfigureOpeningComponent} from "./configure-opening/configure-opening.component";
import {BookingConfigurationDTO, BookingControllerService} from "../../../../core/booking";

@Component({
    selector       : 'booking-dashboard',
    templateUrl    : './booking-dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgIf,
        MatStepperModule,
        I18nPluralPipe,
        MatButtonToggleModule,
        MatExpansionModule,
        MatDatepickerModule,
        ConfigureOpeningComponent],
})
export class BookingDashboardComponent implements OnInit {

    currentBranch : BranchResponseEntity;
    qrCodeImage: String = '';

    bookingConfigurationDTO : BookingConfigurationDTO;

    constructor(private _dataProvideService: DataproviderService,
                private _bookingControllerService: BookingControllerService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {


        this._dataProvideService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
            this.cdr.detectChanges();
        });

        this._bookingControllerService.checkWaApiStatus(this.currentBranch.branchCode)
            .subscribe((bookingConfDTO) =>{
                this.bookingConfigurationDTO = bookingConfDTO;
                this.cdr.detectChanges();
            });
    }


    buttonConfigurationClick : boolean = false;
    remainingSeconds: number = 0;
    panelOpenState: boolean = true;

    configureNumber() {
        this.buttonConfigurationClick = true;
        this._bookingControllerService
            .configureNumberForWhatsAppMessaging(this.currentBranch.branchCode)
            .subscribe((bookingConfDTO) =>{
                    this.bookingConfigurationDTO = bookingConfDTO;
                    this.qrCodeImage = bookingConfDTO?.waApiConfigDTO.lastQrCode;
                    this.buttonConfigurationClick = false;
                    this.remainingSeconds = 60;

                    interval(5000)
                        .pipe(takeWhile(() => this.loopConditionMet())) // Maximum 75 seconds
                        .subscribe(() => {


                            this._bookingControllerService.checkWaApiStatus(this.currentBranch.branchCode)
                                .subscribe((bookingConfDTO)=>{
                                    this.bookingConfigurationDTO = bookingConfDTO;
                                    console.log('Current status: ' + this.bookingConfigurationDTO?.waApiConfigDTO?.instanceStatus)
                                    if (this.bookingConfigurationDTO != null
                                        && this.bookingConfigurationDTO?.waApiConfigDTO != null
                                        && this.bookingConfigurationDTO?.waApiConfigDTO?.instanceStatus === 'OK') {
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
        return this.remainingSeconds > 0;
    }

}
