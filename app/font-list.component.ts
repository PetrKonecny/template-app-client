import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Font } from './font';
import { Router } from '@angular/router'
import { DomSanitizationService } from '@angular/platform-browser';
import { DisplayFontComponent } from './display-font.component' 

@Component({
    selector: 'font-list',
    template: `
            <div>
                <div *ngFor="let font of fonts" (click)="onSelect(font)">
                    <font-display [font] = "font"></font-display>
                </div>
            </div> `,
    styles: [`        
            
            `],
    directives: [DisplayFontComponent]
})

export class FontListComponent {
     
    @Input()
    fonts : Font[] 
    @Output() onFontClicked = new EventEmitter<Font>();
    
    constructor(private router: Router,private sanitizer: DomSanitizationService){}
    
    onSelect(font: Font) {
        this.onFontClicked.emit(font);
    }
    
    desanitize(){
        return this.sanitizer.bypassSecurityTrustStyle(this.fonts[1].name);
    }
    
}