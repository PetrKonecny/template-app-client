import { Component, Input, ViewChildren, QueryList, Injectable, HostListener} from '@angular/core';
import { Page} from './page';
import { NewPageComponent } from './new-page.component'
import { Element } from './element' 
import { TableElement } from './table-element'
import { TableContent, CellContent, RowContent } from './table-content'
import { ElementDimensions } from './resizable.directive'
import { Guide } from './guide'
import { BasicStep, StepSelector , ArrayStepPop, ArrayStepPush, FunctionStep, CompositeStep} from './step-selector'

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
        this.component.rulers.forEach(ruler => {
            if (ruler.positionX){
                this.verticals.push({ positionX: ruler.positionX, guide: null, active: false})
            } else if (ruler.positionY){
                this.horizontals.push({ positionY: ruler.positionY, guide: null, active: false})
            }
        })
        this.horizontals.sort((n1,n2) => n2.positionY - n1.positionY)
        this.verticals.sort((n1,n2) => n2.positionX - n1.positionX)
        this.bufferVertical = {value: 0}
        this.bufferHorizontal = {value: 0}      
    }
    
    move(element: Element, dimensions: ElementDimensions){
        if (!this.activeElement){
            this.startState = { positionX: element.positionX, positionY: element.positionY}
            this.activeElement = element
            this.initGuides()
        }
        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.top, 'positionY', 'height', this.bufferHorizontal)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.left, 'positionX', 'width', this.bufferVertical)
        
        if(horizontalBreak){
            element.positionX += dimensions.left
        }else if(verticalBreak){
            element.positionY += dimensions.top
        }else{
            element.positionX += dimensions.left
            element.positionY += dimensions.top
            this.bufferVertical.value = 0
            this.bufferHorizontal.value = 0
        }
        this.finalStep = this.stepSelector.makePosition(element, this.startState.positionX, element.positionX, this.startState.positionY, element.positionY)    
    }
    
    resolveBreaks(breaks: Array<Break>,element: Element, deltaPos: number ,paramPosition: string, paramDimension: string, buffer: Buffer){
        for (var guideBreak of breaks){
            var edge1 = element[paramPosition] + element[paramDimension] <= guideBreak[paramPosition] && element[paramPosition] + element[paramDimension] > guideBreak[paramPosition] - 10
            var edge2 = element[paramPosition] >= guideBreak[paramPosition] && element[paramPosition] < guideBreak[paramPosition] + 10
            if (edge1 || edge2){
                console.log(edge1,edge2)
                if (!guideBreak.active){
                    var guide = new Guide()
                    guide[paramPosition] = guideBreak[paramPosition]
                    guideBreak.guide = guide
                    this.component.guides.push(guide)                
                }
                buffer.value += deltaPos
                if (Math.abs(buffer.value) < 20){
                    if (edge1){
                        element[paramPosition]= guideBreak[paramPosition] - element[paramDimension]
                    }else if(edge2){
                        element[paramPosition] = guideBreak[paramPosition]
                    }
                    guideBreak.active = true                    
                }else{
                    this.component.guides.splice(this.component.guides.indexOf(guideBreak.guide))
                    guideBreak.guide = null
                    element[paramPosition] += buffer.value
                    guideBreak.active = false                    
                }
                return true
            }
        }
        return false     
    }
    
    resize(element: Element,dimensions: ElementDimensions){
        if (!this.activeElement){
            this.activeElement = element
            this.initGuides()
        }
        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.height, 'positionY', 'height', this.bufferHorizontal)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.width, 'positionX', 'width', this.bufferVertical)
        if (dimensions.width){
            if (!verticalBreak){
                element.width += dimensions.width
            }
        } else if (dimensions.height){
            if (!horizontalBreak){
                element.height += dimensions.height
            }
        }
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
        
    resizeTableElement(element: TableElement, dimensions: ElementDimensions){
        if (!this.activeElement){
            this.activeElement = element
            this.startState = JSON.parse(JSON.stringify(element.rows))
        }
        
        if (dimensions.width){
            this.counter += dimensions.width
            if (this.counter > TableElement.default_cell_width){
                for (var row of (<TableContent>element.content).rows){
                    row.cells.push(new CellContent)
                }
                TableElement.addCellToRows(element)
                this.counter = 0
                this.finalStep = new BasicStep(element,"rows",this.startState,JSON.parse(JSON.stringify(element.rows)))
            } else if (this.counter < -TableElement.default_cell_width){
                if (element.rows[0].cells.length > 1){
                    for (var row of (<TableContent>element.content).rows){
                        row.cells.pop
                    }
                    TableElement.removeCellFromRows(element)
                }
                this.counter = 0
                this.finalStep = new BasicStep(element,"rows",this.startState,JSON.parse(JSON.stringify(element.rows)))
            }
        } else if (dimensions.height){
            var content = <TableContent> element.content
            this.counter += dimensions.height
            if (this.counter > TableElement.default_row_height){
                var row = new RowContent;
                content.rows.push(row)
                row.addCells(element.rows[0].cells.length)
                TableElement.addRows(element,1, element.rows[0].cells.length)
                this.counter = 0
                this.finalStep = new BasicStep(element,"rows",this.startState,JSON.parse(JSON.stringify(element.rows)))
            } else if (this.counter < -TableElement.default_row_height){
                if (element.rows.length > 1){
                    element.rows.pop()
                    content.rows.pop()
                }
                this.counter = 0
                this.finalStep = new BasicStep(element,"rows",this.startState,JSON.parse(JSON.stringify(element.rows)))
            }
        }
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

