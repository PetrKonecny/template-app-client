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
    
    public selectedComponent: any
  
    private _selectedElement: BehaviorSubject<Element> = new BehaviorSubject(new Element());
    public selectedElement: Observable<Element> = this._selectedElement.asObservable();
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore
    ){}
  
    public changeElement(element: Element, elementComponent: any){
        this.selectedComponent = elementComponent;
        this._selectedElement.next(element);
    }
    
    public changeFont(font: Font) {
        (<TextElement> this._selectedElement.value).font = font;
        (<NewTextElementComponent>this.selectedComponent).refreshFont(font);
    }
    
    public deleteElement(){
        this.templateInstanceStore.deleteElementFromTemplate(this._selectedElement.value);
    }
    
    changeTextAlign(align: string){
        (<NewTextElementComponent>this.selectedComponent).changeTextAlign(align)
    }
    
    changeTextAlignVertical(align: string){
        (<NewTextElementComponent>this.selectedComponent).changeTextAlignVertical(align)
    }
    
}