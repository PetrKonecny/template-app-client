import { Component, Input, ViewChildren, QueryList, Injectable, HostListener} from '@angular/core';
import { Page} from './page';
import { NewPageComponent } from './new-page.component'
import { Element } from './element' 
import { TableElement } from './table-element'
import { TableContent, CellContent, RowContent } from './table-content'
import { ElementDimensions } from './resizable.directive'

@Injectable()
export class NewPage {
   
    component: NewPageComponent
    widths: Array<number>
    heights: Array<number>
    counter: number
    activeElement : Element
    bufferVertical: number = 0

    
    move(element: Element, dimensions: ElementDimensions){
        if (!this.activeElement){
            this.widths = this.component.page.elements.filter(elmnt => elmnt != element).map((elmnt) => elmnt.width + elmnt.positionX)
            this.heights = this.component.page.elements.filter(elmnt => elmnt != element).map((elmnt) => elmnt.height + elmnt.positionY)
            console.log(this.widths)
            this.activeElement = element
        }
        for (var width of this.widths){
            var pos = element.positionX +element.width + dimensions.left
            if (pos < width + 10 && pos > width - 10){
                this.bufferVertical += dimensions.left
                if (Math.abs(this.bufferVertical) < 100){
                    element.positionX = width - element.width
                }else{
                    console.log(this.bufferVertical)
                    element.positionX += this.bufferVertical
                }
                return
            }
        }
        element.positionX += dimensions.left
        element.positionY += dimensions.top
        this.bufferVertical = 0      
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

