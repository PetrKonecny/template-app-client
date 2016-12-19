import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Element} from './element'
import {NewTextElementComponent} from './new-text-element.component'
import {Font} from './font'
import {TextElement} from './text-element'
import {TemplateInstanceStore} from './template-instance.store'
import {TableElement, ClientState} from './table-element'
import {StepSelector, FunctionStep} from './step-selector'
import {Page} from './page'
import {TextContent} from './text-content'
import {ImageContent} from './image-content'
import {TableContent} from './table-content'
import {ImageElement} from './image-element'
import {ArrayStepPush} from './step-selector'
import {PageSelectorComponent} from './page-selector.component'

@Injectable()
export class PageSelector {
    
  
    component: PageSelectorComponent
    
    
    selectPage(page: Page){
        this.component.page = page
    }
}