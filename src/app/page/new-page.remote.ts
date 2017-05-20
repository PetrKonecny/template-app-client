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
//reference used for moving the elements
export class NewPageRemote {
   
    //reference to the component
    component: NewPageComponent

    /**
	@param service - injects service used to calculate element movements
    */
    constructor(private service: PageService){}
      
    
    /** moves the element
	@param element - element to be moved
	@param dimensions - dimensions to move it by
    */
    move(element: Element, dimensions: ElementDimensions){
        return this.service.move(element,dimensions,this.component.page, this.component.guides)
    }   
    
    /** resizes the element
	@param element - element to be moved
	@param dimensions - dimensions to move it by
	@param options - additional options
    */
    resize(element: Element,dimensions, options?){
       return this.service.resize(element,dimensions,this.component.page,this.component.guides,options)
    }
   
    
}
