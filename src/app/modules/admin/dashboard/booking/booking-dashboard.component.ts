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
import {NgIf} from "@angular/common";
import {MatStepperModule} from "@angular/material/stepper";
import {WaApiConfigDTO, WaapiControllerService} from "../../../../core/booking";

@Component({
    selector       : 'booking-dashboard',
    templateUrl    : './booking-dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatProgressSpinnerModule, NgIf, MatStepperModule],
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
        });
    }


    buttonConfigurationClick : boolean = false;
    showQr : boolean = false;

    configureNumber() {
        this.buttonConfigurationClick = true;
        this.showQr=false;
        this._waapiControllerService
            .configureNumberForWhatsAppMessaging(this.currentBranch.branchCode).subscribe((waApiConfigDTO) =>{
                this.waapiConf = waApiConfigDTO;
                this.qrCodeImage = waApiConfigDTO.lastQrCode;

                this.showQr=true;
                console.log('Delayed action executed!');
            this.buttonConfigurationClick = false;
            this.cdr.detectChanges();
            }
        );



    }

}
