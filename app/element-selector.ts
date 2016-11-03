import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'

@Injectable()
export class ElementSelector {
    
  
    public selectedElement: Element;
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore
    ){}
  
    public changeElement(element: Element){
        this.selectedElement = element;
    }
    
    public changeFont(font: Font) {
        (<TextElement>this.selectedElement).font = font;
    }
    
    public deleteElement(){
        this.templateInstanceStore.deleteElementFromTemplate(this.selectedElement);
    }
    
    changeTextAlign(align: string){
        (<TextElement>this.selectedElement).text_align = align;
    }
    
    changeTextAlignVertical(align: string){
        (<TextElement>this.selectedElement).text_align_vertical = align;
    }
    
}