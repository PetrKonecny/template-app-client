import {Injectable} from '@angular/core';
import {Element} from './element'
import {Font} from '../font/font'
import {TextElement} from './text-element'
import {TableElement, ClientState, Cell } from './table-element'
import {BehaviorSubject, Observable} from 'rxjs/Rx'
import { TemplateStore } from '../template/template.store'
import { TemplateHelper} from '../template/template.helper'
import { Template } from '../template/template'

@Injectable()
/*
store class for element used to share one element instance between one or more components 
*/
export class ElementStore {
  	
  	//subject of observation with default behaviour 
    private _element: BehaviorSubject<Element> = new BehaviorSubject(null);
    //observable observers are subscribing to
    public element: Observable<Element> = this._element.asObservable();  

    //if called changes the subject and all observers are notified
    changeElement(element: Element){
        this._element.next(element)
    }

}