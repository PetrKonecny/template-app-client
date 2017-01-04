import {Injectable} from '@angular/core';
import {Page} from './page'
import {PageSelectorComponent} from './page-selector.component'

@Injectable()
export class PageSelector {
    
  
    component: PageSelectorComponent
    
    
    selectPage(page: Page){
        this.component.page = page
    }
}