import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule, RouterModule, UiButtonComponent],
    templateUrl: './services.component.html'
})
export class ServicesComponent { }
