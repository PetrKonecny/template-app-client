import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'
import {TableElement, ClientState} from './table-element'
import {StepSelector, ArrayStepSplice, BasicStep, CompositeStep} from './step-selector'

@Injectable()
export class TextSelector {
    
  
    public selectedElement: Element;
    
    constructor(
    ){}
  
}