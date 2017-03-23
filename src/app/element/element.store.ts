import {Injectable} from '@angular/core';
import {Element} from './element'
import {Font} from '../font/font'
import {TextElement} from './text-element'
import {TableElement, ClientState, Cell, TableElementCommands} from './table-element'
import {BehaviorSubject, Observable} from 'rxjs/Rx'
import { TemplateStore } from '../template/template.store'
import { TemplateHelper} from '../template/template.helper'
import { Template } from '../template/template'

@Injectable()
export class ElementStore {
    
    private _element: BehaviorSubject<Element> = new BehaviorSubject(null);
    public element: Observable<Element> = this._element.asObservable();  

    changeElement(element: Element){
        this._element.next(element)
    }

}