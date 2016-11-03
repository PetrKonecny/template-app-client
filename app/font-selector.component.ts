import { Component, OnInit, Injectable} from '@angular/core';
import { ImageListComponent} from './image-list.component';
import { ImageService } from './image.service';
import { Image} from './image';
import { ImageSelector} from './image-selector';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {FontListComponent} from './font-list.component'
import {Font} from './font'
import {ElementSelector} from './element-selector'
import {FontSelector} from './font-selector'
import {FontService} from './font.service'
import {Element} from './element'

@Component({
    selector: 'font-selector',
    template: `
                <font-list [fonts] = "fonts" (onFontClicked) = "onFontClicked($event)"></font-list>
            `,
    directives: [FontListComponent],
    providers: [FontService]
})

@Injectable()
export class FontSelectorComponent implements OnInit {
    
    private fonts: Font[];
    
    constructor(private elementSelector: ElementSelector, private fontSelector: FontSelector,  private fontService: FontService){}
     
    ngOnInit(){
        this.fontService.getFonts().subscribe(fonts => this.fonts = fonts);
    }
    
    onFontClicked(font: Font){
        this.elementSelector.changeFont(font);
        this.fontSelector.closeSelectorWindow();
    }
  
}