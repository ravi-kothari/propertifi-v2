import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OwnerService } from '../../../../core/services/owner.service';
import { SavedCalculation, SavedCalculationsResponse } from '../../../../core/models/owner.model';
import { RoiInput, RoiResult, MortgageInput, MortgageResult } from '../../../../core/models/calculator.model';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Pipe({ name: 'asRoiResult', standalone: true })
export class AsRoiResultPipe implements PipeTransform {
    transform(value: any): RoiResult {
        return value as RoiResult;
    }
}

@Pipe({ name: 'asMortgageResult', standalone: true })
export class AsMortgageResultPipe implements PipeTransform {
    transform(value: any): MortgageResult {
        return value as MortgageResult;
    }
}

@Pipe({ name: 'asMortgageInput', standalone: true })
export class AsMortgageInputPipe implements PipeTransform {
    transform(value: any): MortgageInput {
        return value as MortgageInput;
    }
}

@Component({
    selector: 'app-saved-calculations',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        UiButtonComponent,
        AsRoiResultPipe,
        AsMortgageResultPipe,
        AsMortgageInputPipe
    ],
    templateUrl: './saved-calculations.component.html'
})
export class SavedCalculationsComponent implements OnInit {
    calculations: SavedCalculation[] = [];
    loading = true;

    constructor(private ownerService: OwnerService) { }

    ngOnInit() {
        this.loadCalculations();
    }

    loadCalculations() {
        this.ownerService.getSavedCalculations().subscribe({
            next: (response: SavedCalculationsResponse) => {
                this.calculations = response.data;
                this.loading = false;
            },
            error: (err: unknown) => {
                console.error('Error fetching calculations', err);
                this.loading = false;
            }
        });
    }

    deleteCalculation(id: number) {
        if (confirm('Are you sure you want to delete this calculation?')) {
            this.ownerService.deleteCalculation(id).subscribe({
                next: () => {
                    this.calculations = this.calculations.filter(c => c.id !== id);
                },
                error: (err: unknown) => {
                    console.error('Error deleting calculation', err);
                }
            });
        }
    }
}
