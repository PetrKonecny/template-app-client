import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Font } from './font';
import { Router } from '@angular/router'
import { DisplayFontComponent } from './display-font.component' 

@Component({
    selector: 'font-list',
    template: `
            <div>
                <div *ngFor="let font of fonts">
                    <font-display [font] = "font" (click)="onSelect(font)"></font-display>
                </div>
            </div> `,
    styles: [`        
            
            `]
})
//displays list of the fonts
export class FontListComponent {
     
    @Input()
    //fonts to be displayed
    fonts : Font[] 
    @Output() onFontClicked = new EventEmitter<Font>();
        
    //triggered when font is clicked
    onSelect(font: Font) {
        this.onFontClicked.emit(font);
    }   
}