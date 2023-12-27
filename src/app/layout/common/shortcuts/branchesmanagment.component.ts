import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {catchError, Subject, throwError} from 'rxjs';
import {DataproviderService} from "../../../modules/admin/dashboard/dataprovider.service";
import {User} from "../../../core/user/user.types";
import {MatRadioModule} from "@angular/material/radio";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {BranchCreationEntity, BranchResponseEntity, DashboardControllerService} from "../../../core/dashboard";

@Component({
    selector       : 'branches-managment',
    templateUrl    : './branchesmanagment.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'shortcuts',
    standalone     : true,
    imports: [MatButtonModule,
        MatIconModule,
        NgIf,
        MatTooltipModule,
        NgFor,
        NgClass,
        NgTemplateOutlet,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatSnackBarModule],
})
export class BranchesmanagmentComponent implements OnInit, OnDestroy
{
    @ViewChild('shortcutsOrigin') private _shortcutsOrigin: MatButton;
    @ViewChild('shortcutsPanel') private _shortcutsPanel: TemplateRef<any>;
    @Input() tooltip: string;

    mode: 'view' | 'modify' | 'add' | 'edit' = 'view';
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    branchEntity : BranchCreationEntity;
    branchForm: UntypedFormGroup;

    currentBranch : BranchResponseEntity;
    currentBranchList : BranchResponseEntity[];
    user : User;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _dashboardService : DataproviderService,
        private _dashboardControllerService : DashboardControllerService,
        private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.user = this._dashboardService.user;

        this._dashboardService.branches$.subscribe((branches) => {
            this.currentBranchList = branches;
        });

        this._dashboardService.branch$.subscribe((branch) => {
            this.currentBranch = branch;
        });

        this.branchForm = this._formBuilder.group({
            name : ['', [Validators.required]],
            address : ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            type: ['RESTAURANT']
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._overlayRef ) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the shortcuts panel
     */
    openPanel(): void {
        if ( !this._shortcutsPanel || !this._shortcutsOrigin ) {
            return;
        }
        this.mode = 'view';

        if ( !this._overlayRef ) {
            this._createOverlay();
        }

        this._overlayRef.attach(new TemplatePortal(this._shortcutsPanel, this._viewContainerRef));
    }

    /**
     * Close the shortcuts panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Change the mode
     */
    changeMode(mode: 'view' | 'modify' | 'add' | 'edit'): void
    {
        // Change the mode
        this.mode = mode;
    }

    /**
     * Prepare for a new shortcut
     */
    newBranch(): void {
        // Reset the form
        this.branchForm.reset();

        // Enter the add mode
        this.mode = 'add';
    }

    /**
     * Edit a shortcut
     */
    editBranch(branch: BranchResponseEntity): void {
        // Reset the form with the shortcut
        this.branchForm.reset(branch);

        // Enter the edit mode
        this.mode = 'edit';
    }

    /**
     * Save shortcut
     */
    save(): void {

        if ( this.branchForm.invalid ) {
            return;
        }

        this.branchForm.disable();

        console.log("this.branchForm.get('type').value," + this.branchForm.get('type').value)
        this.branchEntity = {
            name: this.branchForm.get('name').value,
            address: this.branchForm.get('address').value,
            email: this.branchForm.get('email').value,
            phone: this.branchForm.get('phone').value,
            vat: this.branchForm.get('phone').value,
            type: this.branchForm.get('type').value ?? 'RESTAURANT',
            userCode: this.user.userCode,
        }

        this._dashboardControllerService.save(this.branchEntity).pipe(
            catchError((error) => {
                this._snackBar.open('error: ' + error.statusCode, 'Undo', {
                    duration: 3000
                });
                return throwError(error);
            })
        ).subscribe(
            (branchResponseEntity) => {
                this._snackBar.open('Attività creata con successo', 'Undo', {
                    duration: 3000,
                });

                console.log('valeria' + branchResponseEntity.branchCode);
                this._dashboardService.addBranch(branchResponseEntity);

            }
        );
        this.branchForm.enable();
        this.branchForm.reset();
        this.mode = 'view';
    }

    /**
     * Delete shortcut
     */
    delete(): void {
        const shortcut = this.branchForm.value;

        // Delete
        // this._shortcutsService.delete(shortcut.id).subscribe();

        // Go back the modify mode
        this.mode = 'modify';
    }

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
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._shortcutsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX : 'start',
                        originY : 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX : 'end',
                        originY : 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX : 'end',
                        originY : 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    selectBranch(branch: BranchResponseEntity) {
        this._dashboardService.selectBranch(branch);
        this.closePanel();
        this._snackBar.open('Ora stai lavorando su ' + branch.name , 'Undo', {
            duration: 3000,
        });
    }
}
