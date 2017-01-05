import { Component, OnInit, Injectable, Output, EventEmitter} from '@angular/core';
import {Font} from './font'
import {FontSelector} from './font-selector'
import {FontService} from './font.service'

@Component({
    selector: 'font-selector',
    template: `
                <font-list [fonts] = "fonts" (onFontClicked) = "onFontClicked($event)"></font-list>
            `,
    providers: [FontService]
})

@Injectable()
export class FontSelectorComponent implements OnInit {
    
    private fonts: Font[];
   
    constructor(private fontSelector: FontSelector,  private fontService: FontService){}
     
    ngOnInit(){
        this.fontService.getFonts().subscribe(fonts => this.fonts = fonts);
    }
    
    onFontClicked(font: Font){
        this.fontSelector.selectFont(font)
        this.fontSelector.closeSelectorWindow()
    }
  
}