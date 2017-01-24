import { Injectable } from '@angular/core';
import { NewPageComponent } from './new-page.component'
import { Element } from '../element/element' 
import { TableElement } from '../element/table-element'
import { TableContent, CellContent, RowContent } from '../content/table-content'
import { ElementDimensions, Border} from '../resizable.directive'
import { Guide } from '../guide/guide'
import { Page } from './page'
import { PageService } from './page.service'

 
@Injectable()
export class NewPageRemote {
   
    component: NewPageComponent

    constructor(private service: PageService){}
      
    moveSimple(element: Element, dimensions: ElementDimensions){
        this.service.moveSimple(element,dimensions)
    }
    
    move(element: Element, dimensions: ElementDimensions){
        this.service.move(element,dimensions,this.component.page, this.component.guides)
    }   
    
    resizeSimple(element: Element, dimensions: ElementDimensions){
        this.service.resizeSimple(element,dimensions)
    }
    
    resize(element: Element,dimensions: ElementDimensions){
       this.service.resize(element,dimensions,this.component.page,this.component.guides)
    }
          
    resizeTableElement(element: TableElement, dimensions: ElementDimensions){
       this.service.resizeTableElement(element,dimensions)
    }

    onMouseUp(){}
    
    onMouseDown(){
        this.service.resetState
    }
       
}
