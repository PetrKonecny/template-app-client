import {Injectable} from '@angular/core';
import { RulerSelectorComponent } from './ruler-selector.component'
import { Guide } from './guide'

@Injectable()
export class RulerSelector {
    
  
    component: RulerSelectorComponent
    
    
    selectRuler(ruler: Guide){
        this.component.ruler = ruler
    }
}