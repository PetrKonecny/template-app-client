import { Injectable } from '@angular/core';
import { NewPageComponent } from './new-page.component'
import { Element } from '../element/element' 
import { TableElement } from '../element/table-element'
import { TableContent, CellContent, RowContent } from '../content/table-content'
import { Border } from '../element/element'
import { Guide } from '../guide/guide'
import { Page } from './page'

@Injectable()
/* Service that provides functionality for page. This funcionality includes moving and 
resizing elements, displaying and managing guides and sticky behaviour
*/
export class PageService {
   
    horizontals: Array<Break>
    verticals: Array<Break>
    element: Element
    moving = false
    resizing = false
    
    constructor(){}
    
    /** Initiates Guide objects for the element and page for each element edge 
    @param element that is skipped
    @param page for which to take elements
    */
    private initGuides(element: Element, page: Page){
        if(page.elements){
            page.elements.filter(elmnt => elmnt != element).forEach(elmnt => { 
                this.verticals.push({positionX: elmnt.width + elmnt.positionX, guide: null, active: false, buffer:{value:0}, priority : 0})
                this.verticals.push({positionX: elmnt.positionX, guide: null , active: false, buffer:{value:0}, priority : 0})
                this.horizontals.push({positionY: elmnt.height + elmnt.positionY, guide: null, active: false, buffer:{value:0}, priority : 0 })
                this.horizontals.push({positionY: elmnt.positionY, guide: null , active: false, buffer:{value:0}, priority : 0})              
            })
        }
        if(page.rulers){
            page.rulers.forEach(ruler => {
                if (ruler.positionX !== undefined){
                    this.verticals.push({ positionX: ruler.positionX, guide: null, active: false, buffer:{value:0}, priority : 0})
                } else if (ruler.positionY !== undefined){
                    this.horizontals.push({ positionY: ruler.positionY, guide: null, active: false, buffer:{value:0}, priority : 0})
                }
            })
        }     
    }

    //Ckears service state
    private init(){
        this.horizontals = new Array
        this.verticals = new Array 
    }
    

   /**  Move transformation of the element on the page, taking into consideration all guides
   and other page behaviour
   @param element to move
   @param dimensions dimensions by which the element is moving
   @param guides array of guide objects to which the guides that are displayed will be added
   @return transformation of the element
   */
    move(element: Element, dimensions: any, page: Page, guides: Guide[]){
        if(!element || !dimensions || !page || !guides){
            throw new TypeError("params must be defined")
        }

        if (this.element != element || this.resizing){
            this.element = element
            this.init()
            if(page.elements || page.rulers){
                this.initGuides(element, page)
            }
            this.resizing = false
            this.moving = true
        }

        this.resolveBreaks(this.horizontals, element, dimensions, 'top', 'positionY', 'height',guides)
        this.resolveBreaks(this.verticals, element, dimensions, 'left', 'positionX', 'width', guides)
        return {left: dimensions.left, top: dimensions.top, width: null, height: null, border: null}
    }

    moveWithoutGuides(dimensions: any){
        return {left: dimensions.left, top: dimensions.top, width: null, height: null, border: null}
    }
    
    /** Resolves if the element should or should not move and which guides should be displayed by 
    altering given dimensions and controls guide display by adding or removing guides from the guide array 
    @param breaks array of break objects that contain positions where the element should be stoped
    @param element that is manipulated
    @param dimensions dimensions that should be processed
    @param oaranVector name of param in dimensions which should be used (left,top)
    @param paramPosition name of param in guide and element which should be used (oositionX, positionY)
    @param param Dimension name of param in element that should be used (width,height)
    */
    private resolveBreaks(breaks: Array<Break>,element: Element, dimensions , paramVector: string,paramPosition: string, paramDimension: string, guides: Guide[]){
        let resultVector = dimensions[paramVector]
        let finalBreak 
        for (var guideBreak of breaks){

            if(guideBreak.priority > 0){
                guideBreak.priority--
            }

            if(!guideBreak.active){
                var edge2 = (element[paramPosition] + dimensions[paramVector]  + element[paramDimension] <= guideBreak[paramPosition] + 10 && element[paramPosition]  + dimensions[paramVector] + element[paramDimension] > guideBreak[paramPosition] - 10)
                var edge1 = (element[paramPosition] + dimensions[paramVector] > guideBreak[paramPosition] -10 && element[paramPosition] + dimensions[paramVector] < guideBreak[paramPosition] + 10)
                if (edge1 || edge2){
                    if(!finalBreak || finalBreak.priority > guideBreak.priority){
                        finalBreak = guideBreak
                    }
                    if(edge1 && !edge2){
                       resultVector = guideBreak[paramPosition] - element[paramPosition]
                    }
                    if(edge2 && !edge1){
                       resultVector = guideBreak[paramPosition] - element[paramDimension] - element[paramPosition]
                    }
                }
            }
            else {
                guideBreak.buffer.value += dimensions[paramVector]
                if (Math.abs(guideBreak.buffer.value) < 20){                   
                    resultVector = 0
                }else{
                    resultVector = guideBreak.buffer.value
                    guides.splice(guides.indexOf(guideBreak.guide),1)
                    guideBreak.guide = null
                    guideBreak.active = false
                    guideBreak.buffer.value = 0
                    guideBreak.priority = 100
                }
                finalBreak = null
                break
            }
        }
        if(finalBreak){
            var guide = new Guide()
            guide[paramPosition] = finalBreak[paramPosition]
            finalBreak.guide = guide
            guides.push(guide)
            finalBreak.active = true
        }
        dimensions[paramVector] = resultVector
    }
    
    
    /** Resize transformation of the element on the page, taking into consideration all guides and other page
    behaviour
    @param element element that should be resized
    @param dimensions original transformation
    @param page page to which the element belongs
    @param guides array of guide objects to which the guides that are displayed will be added
    @options array of aditional options 
        reverseWidth: boolean set true if resizing from left
        reverseHeight:  boolean set true if resiying from top
        filterThesePositions: array{x: number, y: number}  positions of guides that are skipped in 
        calculations
    */
    resize(element: Element,dimensions, page: Page, guides: Guide[], options?: any){
        if(!element || !dimensions || !page || !guides){
            throw new TypeError("params must be defined")
        }

        if (this.element != element || this.moving){
            this.element = element
            this.init()
            if(page.elements || page.rulers){
                this.initGuides(element, page)
            }
            this.moving = false
            this.resizing = true                 
        }

        if(options && options.filterThesePositions && options.filterThesePositions.length > 0){
            this.verticals = this.verticals.filter(guideBreak =>{ return !options.filterThesePositions.some(position => position.x == guideBreak.positionX)
            })
            this.horizontals = this.horizontals.filter(guideBreak =>{return !options.filterThesePositions.some(position => position.y == guideBreak.positionY)
            })
        }   

        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions, 'height', 'positionY', 'height', guides)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions, 'width', 'positionX', 'width', guides)

        if(options && options.reverseWidth){
            dimensions.left = dimensions.width
            dimensions.width = -1*dimensions.width
        }
        if(options && options.reverseHeight){
            dimensions.top = dimensions.height
            dimensions.height = -1*dimensions.height
        }
        return dimensions       
    }

    getPageWidth(page: Page){
        if(page.width){
            return page.width
        }else{
            return Page.defaultWidth
        }
    }
      
}

interface Vector{
    x: number
    y: number
}

interface Break{
    positionX?:number
    positionY?:number
    guide: Guide
    priority: number
    active: boolean
    buffer: Buffer
}

interface Buffer{
    value: number
}

