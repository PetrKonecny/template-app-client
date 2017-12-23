import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { Element} from './element/element';

@Component({
    selector: 'color-picker',
    template: `
            <button md-icon-button [mdTooltip]="tooltip" [mdMenuTriggerFor]="colorMenu"><md-icon  [style.color]="color">fiber_manual_record</md-icon></button>
            <md-menu #colorMenu>
                <div *ngIf="showToggle" (click)="$event.stopPropagation()" md-menu-item style="overflow: hidden; display: flex; width: 210px;">
                    Viditelné <md-checkbox #checkbox [checked]="color" (change)="toggle(checkbox.checked)" style="position: relative; z-index: 1000; margin-left: auto"></md-checkbox>
                </div>
                <div style="padding: 0 6px 6px 6px;" (click)="$event.stopPropagation()">
                    <div *ngIf="color" [colorPicker]="color ? color : lastColor" style="height: 0; padding-top: 12px;" [cpPresetLabel]="'Použité barvy'" [cpPresetColors]="presetColors" [cpOutputFormat]="hex" (colorPickerChange)="colorChange($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                    </div>
                </div>
            </md-menu>            
             `
})

export class ColorPickerComponent {

    @Input()
    color;

    @Input()
    showToggle = false;

    @Input()
    presetColors;

    @Input()
    tooltip = "TOOLTIP"

    @Output()
    onChange = new EventEmitter;

    lastColor = Element.defaultBackgroundColor;

    colorChange(color){
      this.lastColor = color;
      this.onChange.emit(color);
    }

    toggle(value){
      if(value){
        this.onChange.emit(this.lastColor)
      }else{
        this.onChange.emit(null)
      }
    }    
}