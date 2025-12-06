import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
    selector: 'app-ui-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiInputComponent),
            multi: true
        }
    ],
    host: {
        class: 'block w-full'
    },
    templateUrl: './ui-input.component.html'
})
export class UiInputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() id = '';
    @Input() error = '';
    @Input() hint = '';

    value = '';
    disabled = false;
    touched = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
    }

    onBlur(): void {
        this.touched = true;
        this.onTouched();
    }
}
