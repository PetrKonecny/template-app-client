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

export class FontListComponent {
     
    @Input()
    fonts : Font[] 
    @Output() onFontClicked = new EventEmitter<Font>();
        
    onSelect(font: Font) {
        this.onFontClicked.emit(font);
    }   
}