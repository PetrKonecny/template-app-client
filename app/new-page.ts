import { Injectable } from '@angular/core';
import { NewPageComponent } from './new-page.component'
import { Element } from './element' 
import { TableElement } from './table-element'
import { TableContent, CellContent, RowContent } from './table-content'
import { ElementDimensions, Border} from './resizable.directive'
import { Guide } from './guide'
import { BasicStep, StepSelector } from './step-selector'


/*
 * Extension of NewPage component that can be injected by any other component under it
 * NewPage is responsible for any state change of element relative to page
 * such as resizing, moving, deleting
 */
 
@Injectable()
export class NewPage {
   
    component: NewPageComponent
    horizontals: Array<Break>
    verticals: Array<Break>
    counter: number
    activeElement : Element
    bufferVertical: Buffer
    bufferHorizontal: Buffer
    startState: any
    finalStep: any
    
    constructor(private stepSelector: StepSelector){}
    
    initGuides(){
        this.horizontals = new Array
        this.verticals = new Array 
        this.component.page.elements.filter(elmnt => elmnt != this.activeElement).forEach(elmnt => { 
            this.verticals.push({positionX: elmnt.width + elmnt.positionX, guide: null, active: false})
            this.verticals.push({positionX: elmnt.positionX, guide: null , active: false})
            this.horizontals.push({positionY: elmnt.height + elmnt.positionY, guide: null, active: false })
            this.horizontals.push({positionY: elmnt.positionY, guide: null , active: false})              
        })
        this.component.page.rulers.forEach(ruler => {
            if (ruler.positionX){
                this.verticals.push({ positionX: ruler.positionX, guide: null, active: false})
            } else if (ruler.positionY){
                this.horizontals.push({ positionY: ruler.positionY, guide: null, active: false})
            }
        })
        this.bufferVertical = {value: 0}
        this.bufferHorizontal = {value: 0}      
    }
    
    moveSimple(element: Element, dimensions: ElementDimensions){
        element.positionX += dimensions.left
        element.positionY += dimensions.top
    }
    
    move(element: Element, dimensions: ElementDimensions){
        if (!this.activeElement){
            this.startState = { positionX: element.positionX, positionY: element.positionY}
            this.activeElement = element
            this.initGuides()
        }
        let edge2FuncHorizontal = function(guideBreak: Break){element["positionY"] = guideBreak["positionY"] - element["height"]}
        let edge1FuncHorizontal = function(guideBreak: Break){element["positionY"] = guideBreak["positionY"]}
        let edge2FuncVertical = function(guideBreak: Break){element["positionX"] = guideBreak["positionX"] - element["width"]}
        let edge1FuncVertical = function(guideBreak: Break){element["positionX"] = guideBreak["positionX"]}
        let releaseFuncVert = () => { element.positionX += this.bufferVertical.value }
        let releaseFuncHor = () => { element.positionY += this.bufferHorizontal.value }
        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.top, 'positionY', 'height', this.bufferHorizontal, edge1FuncHorizontal, edge2FuncHorizontal, releaseFuncHor)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.left, 'positionX', 'width', this.bufferVertical,edge1FuncVertical,edge2FuncVertical,releaseFuncVert)
        
        if (!verticalBreak && horizontalBreak) {
            element.positionX += dimensions.left
        }else if(verticalBreak && !horizontalBreak){
            element.positionY += dimensions.top
        }else if(!horizontalBreak && !verticalBreak){
            element.positionX += dimensions.left
            element.positionY += dimensions.top
        }  
              
        this.finalStep = this.stepSelector.makePosition(element, this.startState.positionX, element.positionX, this.startState.positionY, element.positionY)    
    }
    
    private resolveBreaks(breaks: Array<Break>,element: Element, deltaPos: number ,paramPosition: string, paramDimension: string, buffer: Buffer, edge1Func: (guideBreak: Break)=>void, edge2Func: (guideBreak: Break)=>void, releaseFunc: ()=>void){
        for (var guideBreak of breaks){
            var edge2 = element[paramPosition] + element[paramDimension] <= guideBreak[paramPosition] + 10 && element[paramPosition] + element[paramDimension] > guideBreak[paramPosition] - 10
            var edge1 = element[paramPosition] > guideBreak[paramPosition] -10 && element[paramPosition] < guideBreak[paramPosition] + 10
            if (edge1 || edge2){
                if (!guideBreak.active){
                    var guide = new Guide()
                    guide[paramPosition] = guideBreak[paramPosition]
                    guideBreak.guide = guide
                    this.component.guides.push(guide)                
                }
                buffer.value += deltaPos
                if (Math.abs(buffer.value) < 20){
                    if (edge1  && !edge2){
                        edge1Func(guideBreak)
                    }else if(!edge1 && edge2){
                        edge2Func(guideBreak)
                    }
                    guideBreak.active = true                    
                }else{
                    releaseFunc()
                    this.component.guides.splice(this.component.guides.indexOf(guideBreak.guide),1)
                    guideBreak.guide = null
                    guideBreak.active = false
                    buffer.value = 0                    
                }
                return true
            }
        }
        return false     
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
            }
        }
    }
    
    resizeSimple(element: Element, dimensions: ElementDimensions){
        if (dimensions.width){
            element.width += dimensions.width
        } else if (dimensions.height){
            element.height += dimensions.height
        }
    }
    
    resize(element: Element,dimensions: ElementDimensions){
        if (!this.activeElement){
            this.activeElement = element
            this.startState = { width: element.width, height: element.height}
            this.initGuides()
            this.verticals = this.verticals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
            this.horizontals = this.horizontals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
        }
        
        let edge2FuncHorizontal = function(guideBreak: Break) { element.height = guideBreak.positionY - element.positionY}
        let edge2FuncVertical = function(guideBreak: Break) { element.width = guideBreak.positionX - element.positionX}
        let emptyFunc = function (guideBreak: Break) {}
        let releaseFuncVert = () => { element.width += this.bufferVertical.value }
        let releaseFuncHor = () => { element.height += this.bufferHorizontal.value }
        if (dimensions.height){
            var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.height, 'positionY', 'height', this.bufferHorizontal,emptyFunc, edge2FuncHorizontal, releaseFuncHor)
            if(!horizontalBreak){
                element.height += dimensions.height
            }
        } else if (dimensions.width){
            var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.width, 'positionX', 'width', this.bufferVertical, emptyFunc, edge2FuncVertical, releaseFuncVert)
            if(!verticalBreak){
                element.width += dimensions.width
            }
        }
                
        this.finalStep = this.stepSelector.makeDimensions(element, this.startState.width, element.width, this.startState.height, element.height)    
    }
    
    mouseDown(){
        this.counter = 0
        this.activeElement = null
        
    }
    
    mouseUp(){
        if (this.finalStep){
            this.stepSelector.makeStep(this.finalStep)        
            this.finalStep = null
        }
        this.activeElement = null
        this.component.guides = new Array
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
            row.addCells(element.rows[0].cells.length)
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
        if (!this.activeElement){
            this.activeElement = element
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
        this.finalStep = new BasicStep(element,"rows",this.startState,JSON.parse(JSON.stringify(element.rows)))
    }
       
}

interface Break{
    positionX?:number
    positionY?:number
    guide: Guide
    active: boolean
}

interface Buffer{
    value: number
}

