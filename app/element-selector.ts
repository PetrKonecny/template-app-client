import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewElementComponent} from './new-element.component'
import {Font} from './font'
import {TextElement} from './text-element'

export interface FontRefreshable{
    refreshFont(font:Font)
}
@Injectable()
export class ElementSelector {
    
    public selectedComponent: NewElementComponent
  
    private _selectedElement: BehaviorSubject<Element> = new BehaviorSubject(new Element());
    public selectedElement: Observable<Element> = this._selectedElement.asObservable();
    
    public changeElement(element: Element, elementComponent: NewElementComponent){
        this.selectedComponent = elementComponent;
        this._selectedElement.next(element);
    }
    
    public changeFont(font: Font) {
        (<TextElement> this._selectedElement.value).font = font;
        (<FontRefreshable>this.selectedComponent).refreshFont(font);
    }
    
}