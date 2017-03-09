import { Injectable } from '@angular/core';
import { NewPageComponent } from './new-page.component'
import { Element } from '../element/element' 
import { TableElement } from '../element/table-element'
import { TableContent, CellContent, RowContent } from '../content/table-content'
import { ElementDimensions, Border} from '../resizable.directive'
import { Guide } from '../guide/guide'
import { Page } from './page'

@Injectable()
export class PageService {
   
    horizontals: Array<Break>
    verticals: Array<Break>
    counter: number = 0
    startState: any
    finalStep: any
    element: Element
    
    constructor(){}
    
    private initGuides(element: Element, page: Page){
        if(page.elements){
            page.elements.filter(elmnt => elmnt != element).forEach(elmnt => { 
                this.verticals.push({positionX: elmnt.width + elmnt.positionX, guide: null, active: false, buffer:{value:0}})
                this.verticals.push({positionX: elmnt.positionX, guide: null , active: false, buffer:{value:0}})
                this.horizontals.push({positionY: elmnt.height + elmnt.positionY, guide: null, active: false, buffer:{value:0} })
                this.horizontals.push({positionY: elmnt.positionY, guide: null , active: false, buffer:{value:0}})              
            })
        }
        if(page.rulers){
            page.rulers.forEach(ruler => {
                if (ruler.positionX){
                    this.verticals.push({ positionX: ruler.positionX, guide: null, active: false, buffer:{value:0}})
                } else if (ruler.positionY){
                    this.horizontals.push({ positionY: ruler.positionY, guide: null, active: false, buffer:{value:0}})
                }
            })
        }     
    }

    private init(){
        console.log('init')
        this.horizontals = new Array
        this.verticals = new Array 
    }
    
    moveSimple(element: Element, dimensions: ElementDimensions){
        element.positionX += dimensions.left
        element.positionY += dimensions.top
    }
    

    move(element: Element, dimensions: any, page: Page, guides: Guide[]): ElementDimensions{
        if(!element || !dimensions || !page || !guides){
            throw new TypeError("params must be defined")
        }

        if (this.element != element){
            this.element = element
            this.init()
            if(page.elements || page.rulers){
                this.initGuides(element, page)
            }
        }

        let edge2FuncHorizontal = function(guideBreak: Break){dimensions.top = guideBreak.positionY - element.height - element.positionY}
        let edge1FuncHorizontal = function(guideBreak: Break){dimensions.top = guideBreak.positionY - element.positionY}
        let edge2FuncVertical = function(guideBreak: Break){dimensions.left = guideBreak.positionX - element.width - element.positionX}
        let edge1FuncVertical = function(guideBreak: Break){dimensions.left = guideBreak.positionX - element.positionX}
        let releaseFuncVert = (guideBreak: Break) => { dimensions.left += guideBreak.buffer.value }
        let releaseFuncHor = (guideBreak: Break) => { dimensions.top += guideBreak.buffer.value }
        this.resolveBreaks(this.horizontals, element, dimensions, 'top', 'positionY', 'height', edge1FuncHorizontal, edge2FuncHorizontal, releaseFuncHor,guides)
        this.resolveBreaks(this.verticals, element, dimensions, 'left', 'positionX', 'width',edge1FuncVertical,edge2FuncVertical,releaseFuncVert,guides)
        return {left: dimensions.left, top: dimensions.top, width: null, height: null, border: null}

        /*
        if (!verticalBreak && horizontalBreak) {
            //element.positionX += dimensions.left
            return {left: dimensions.left, top: 0, width:null, height: null, border: null}
        }else if(verticalBreak && !horizontalBreak){
            //element.positionY += dimensions.top
            return {top: dimensions.top, left: 0, width: null, height: null, border: null}
        }else if(!horizontalBreak && !verticalBreak){
            return {left: dimensions.left, top: dimensions.top, width: null, height: null, border: null}
            //element.positionY += dimensions.top
            //element.positionX += dimensions.left
        }else{
            return {left: 0, top: 0, width: null, height: null, border: null}
        }*/
              
        //this.finalStep = this.stepSelector.makePosition(element, this.startState.positionX, element.positionX, this.startState.positionY, element.positionY)    
    }
    
    private resolveBreaks(breaks: Array<Break>,element: Element, dimensions , paramVector: string,paramPosition: string, paramDimension: string, edge1Func: (guideBreak: Break)=>void, edge2Func: (guideBreak: Break)=>void, releaseFunc: (guideBreak: Break)=>void, guides: Guide[]){
        let resultVector = dimensions[paramVector]
        for (var guideBreak of breaks){           
            if(!guideBreak.active){
                var edge2 = element[paramPosition] + dimensions[paramVector]  + element[paramDimension] <= guideBreak[paramPosition] + 10 && element[paramPosition]  + dimensions[paramVector] + element[paramDimension] > guideBreak[paramPosition] - 10
                var edge1 = element[paramPosition] + dimensions[paramVector] > guideBreak[paramPosition] -10 && element[paramPosition] + dimensions[paramVector] < guideBreak[paramPosition] + 10
                console.log(element[paramPosition] , dimensions[paramVector] , guideBreak[paramPosition])
                if (edge1 || edge2){
                    var guide = new Guide()
                    guide[paramPosition] = guideBreak[paramPosition]
                    guideBreak.guide = guide
                    guides.push(guide)
                    guideBreak.active = true
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
                }
            }
        }
        dimensions[paramVector] = resultVector
    }
    
    private filterOpositeBorder(guideBreak: Break, dimensions: ElementDimensions, element: Element){
        switch (dimensions.border){
            case Border.left :{
                return guideBreak.positionX != element.width + element.positionX
            }
            case Border.right :{
                return guideBreak.positionX != element.positionX
            }
            case Border.top :{
                return guideBreak.positionY != element.positionY + element.height
            }
            case Border.bottom :{
                return guideBreak.positionY != element.positionY
            }default{
                return true
            }
        }
    }
    
    resizeSimple(element: Element, dimensions: ElementDimensions){
        if (dimensions.width){
            element.width += dimensions.width
        }
        if (dimensions.height){
            element.height += dimensions.height
        }
    }
    
    resize(element: Element,dimensions, page: Page, guides: Guide[], border?: Border): ElementDimensions{
        if(!element || !dimensions || !page || !guides){
            throw new TypeError("params must be defined")
        }

        if (this.element != element){
            this.element = element
            this.init()
            if(page.elements || page.rulers){
                this.initGuides(element, page)
            }
        }

        this.verticals = this.verticals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
        this.horizontals = this.horizontals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
        
        let edge2FuncHorizontal = function(guideBreak: Break) { element.height = guideBreak.positionY - element.positionY}
        let edge2FuncVertical = function(guideBreak: Break) { element.width = guideBreak.positionX - element.positionX}
        let emptyFunc = function (guideBreak: Break) {}
        let releaseFuncVert = (guideBreak: Break) => { element.width += guideBreak.buffer.value }
        let releaseFuncHor = (guideBreak: Break) => { element.height += guideBreak.buffer.value }
        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions, 'height', 'positionY', 'height',emptyFunc, edge2FuncHorizontal, releaseFuncHor, guides)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions, 'width', 'positionX', 'width', emptyFunc, edge2FuncVertical, releaseFuncVert,guides)
        if(border == Border.left){
            dimensions.left = dimensions.width
            dimensions.width = -1*dimensions.width
        }
        if(border == Border.left){
            dimensions.top = dimensions.height
            dimensions.height = -1*dimensions.height
        }
        return dimensions       
    }
    
    save(){
        if(this.finalStep){
            //this.stepSelector.makeStep(this.finalStep)
        }
    }

    resetState(){
        /*this.counter = 0
        this.finalStep = null
        this.startState = null*/
        this.element = null
    }
    
    private resizeTableVertical(element: TableElement, dimensions: ElementDimensions){
        this.counter += dimensions.width
        if (this.counter > TableElement.default_cell_width){
            for (var row of (<TableContent>element.content).rows){
                row.cells.push(new CellContent)
            }
            TableElement.addCellToRows(element)
            this.rowsChanged(element)                              
        } else if (this.counter < -TableElement.default_cell_width){
            if (element.rows[0].cells.length > 1){
                for (var row of (<TableContent>element.content).rows){
                    row.cells.pop
                }
                TableElement.removeCellFromRows(element)
                this.rowsChanged(element)               
            }               
        }
    }
    
    private resizeTableHorizontal(element: TableElement, dimensions: ElementDimensions){
        var content = <TableContent> element.content
        this.counter += dimensions.height
        if (this.counter > TableElement.default_row_height){
            var row = new RowContent;
            content.rows.push(row)
            RowContent.addCells(row,element.rows[0].cells.length)
            TableElement.addRows(element,1, element.rows[0].cells.length)
            this.rowsChanged(element)               
        } else if (this.counter < -TableElement.default_row_height){
            if (element.rows.length > 1){
                element.rows.pop()
                content.rows.pop()
                this.rowsChanged(element)               
            }              
        }
    }
        
    resizeTableElement(element: TableElement, dimensions: ElementDimensions){
        if (!this.startState){
            this.startState = JSON.parse(JSON.stringify(element.rows))
        }
        
        if (dimensions.width){
            this.resizeTableVertical(element,dimensions)
        } else if (dimensions.height){
            this.resizeTableHorizontal(element,dimensions)
        }
    }
    
    private rowsChanged(element: TableElement){
        this.counter = 0
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
    active: boolean
    buffer: Buffer
}

interface Buffer{
    value: number
}

