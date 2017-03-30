import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'color-pxicker',
    template: `
            <div
              [(colorPicker)]="color"     
              [style.background]="color"
              [cpDialogDisplay]="'inline'"
              [cpToggle]="true">
            >
            </div>            
             `,
    providers: [],
    styles: [``],
})

export class ColorPickerComponent {

    color = '#ce5050'
       
    
}