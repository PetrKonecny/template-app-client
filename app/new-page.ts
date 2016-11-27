import { Component, Input, ViewChildren, QueryList, Injectable, HostListener} from '@angular/core';
import { Page} from './page';
import { NewPageComponent } from './new-page.component'
import { Element } from './element' 
import { TableElement } from './table-element'
import { TableContent, CellContent, RowContent } from './table-content'
import { ElementDimensions } from './resizable.directive'
import { Guide } from './guide'
@Injectable()
export class NewPage {
   
    component: NewPageComponent
    horizontals: Array<Break>
    verticals: Array<Break>
    counter: number
    activeElement : Element
    bufferVertical: Buffer
    bufferHorizontal: Buffer

    
    move(element: Element, dimensions: ElementDimensions){
        if (!this.activeElement){
            this.horizontals = new Array
            this.verticals = new Array 
            this.component.page.elements.filter(elmnt => elmnt != element).forEach(elmnt => { 
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
            this.activeElement = element
            this.bufferVertical = {value: 0}
            this.bufferHorizontal = {value: 0}
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
    }
    
    resolveBreaks(breaks: Array<Break>,element: Element, deltaPos: number ,paramPosition: string, paramDimension: string, buffer: Buffer){
        for (var guideBreak of breaks){
            var edge1 = element[paramPosition] + element[paramDimension] <= guideBreak[paramPosition] && element[paramPosition] + element[paramDimension] > guideBreak[paramPosition] - 10
            var edge2 = element[paramPosition] >= guideBreak[paramPosition] && element[paramPosition] < guideBreak[paramPosition] + 10
            if (edge1 || edge2){
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
        if (dimensions.width){
            element.width += dimensions.width
        } else if (dimensions.height){
            element.height += dimensions.height
        }
    }
    
    mouseDown(){
        this.counter = 0
        delete this.activeElement
        
    }
    
    mouseUp(){
        delete this.activeElement
        this.component.guides = new Array
    }
        
    resizeTableElement(element: TableElement, dimensions: ElementDimensions){
        if (dimensions.width){
            this.counter += dimensions.width
            if (this.counter > TableElement.default_cell_width){
                for (var row of (<TableContent>element.content).rows){
                    row.cells.push(new CellContent)
                }
                TableElement.addCellToRows(element)
                this.counter = 0
            } else if (this.counter < -TableElement.default_cell_width){
                if (element.rows[0].cells.length > 1){
                    for (var row of (<TableContent>element.content).rows){
                        row.cells.pop
                    }
                    TableElement.removeCellFromRows(element)
                }
                this.counter = 0
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
            } else if (this.counter < -TableElement.default_row_height){
                if (element.rows.length > 1){
                    element.rows.pop()
                    content.rows.pop()
                }
                this.counter = 0
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

