import { Injectable } from '@angular/core';
import { NewPageComponent } from './new-page.component'
import { Element } from '../element/element' 
import { TableElement } from '../element/table-element'
import { TableContent, CellContent, RowContent } from '../content/table-content'
import { Guide } from '../guide/guide'
import { Page } from './page'
import { PageService } from './page.service'
import { AppComponentRef } from '../app.ref'

 
@Injectable()
//reference used for moving the elements
export class NewPageReference {
   
    //reference to the component
    component: NewPageComponent
    ctrlPressed: boolean

    /**
	@param service - injects service used to calculate element movements
    */
    constructor(private service: PageService,private appRef: AppComponentRef){
        this.appRef.ctrilPRess.subscribe((pressed)=>this.ctrlPressed = pressed)
    }
      
    
    /** moves the element
	@param element - element to be moved
	@param dimensions - dimensions to move it by
    */
    move(element: Element, dimensions){
        if(this.ctrlPressed){
            return this.service.moveWithoutGuides(dimensions)
        }else{
            return this.service.move(element,dimensions, this.component.elements, this.component.guides)    
        }
    }   
    
    /** resizes the element
	@param element - element to be moved
	@param dimensions - dimensions to move it by
	@param options - additional options
    */
    resize(element: Element,dimensions, options?){
       return this.service.resize(element,dimensions,this.component.elements, this.component.guides,options)
    }
   
    
}
