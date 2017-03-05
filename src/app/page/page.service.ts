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
    bufferVertical: Buffer
    bufferHorizontal: Buffer
    startState: any
    finalStep: any
    element: Element
    
    constructor(){}
    
    private initGuides(element: Element, page: Page){
        this.horizontals = new Array
        this.verticals = new Array 
        page.elements.filter(elmnt => elmnt != element).forEach(elmnt => { 
            this.verticals.push({positionX: elmnt.width + elmnt.positionX, guide: null, active: false})
            this.verticals.push({positionX: elmnt.positionX, guide: null , active: false})
            this.horizontals.push({positionY: elmnt.height + elmnt.positionY, guide: null, active: false })
            this.horizontals.push({positionY: elmnt.positionY, guide: null , active: false})              
        })
        page.rulers.forEach(ruler => {
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
    
    move(element: Element, dimensions: ElementDimensions, page: Page, guides: Guide[]): ElementDimensions{
        if (this.element != element){
            this.element = element
            //this.startState = { positionX: element.positionX, positionY: element.positionY}
            this.initGuides(element, page)
        }
        let edge2FuncHorizontal = function(guideBreak: Break){element["positionY"] = guideBreak["positionY"] - element["height"]}
        let edge1FuncHorizontal = function(guideBreak: Break){element["positionY"] = guideBreak["positionY"]}
        let edge2FuncVertical = function(guideBreak: Break){element["positionX"] = guideBreak["positionX"] - element["width"]}
        let edge1FuncVertical = function(guideBreak: Break){element["positionX"] = guideBreak["positionX"]}
        let releaseFuncVert = () => { dimensions.left += this.bufferVertical.value }
        let releaseFuncHor = () => { dimensions.top += this.bufferHorizontal.value }
        var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.top, 'positionY', 'height', this.bufferHorizontal, edge1FuncHorizontal, edge2FuncHorizontal, releaseFuncHor,guides)
        var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.left, 'positionX', 'width', this.bufferVertical,edge1FuncVertical,edge2FuncVertical,releaseFuncVert,guides)
        
        if (!verticalBreak && horizontalBreak) {
            //element.positionX += dimensions.left
            return {left: dimensions.left, top: 0, width:null, height: null, border: null}
        }else if(verticalBreak && !horizontalBreak){
            //element.positionY += dimensions.top
            return {top: dimensions.top, left: 0, width: null, height: null, border: null}
        }else if(!horizontalBreak && !verticalBreak){
            return {left: dimensions.left, top: dimensions.top, width: null, height: null, border: null}
            /*element.positionY += dimensions.top
            element.positionX += dimensions.left*/
        }else{
            return {left: 0, top: 0, width: null, height: null, border: null}
        }
              
        //this.finalStep = this.stepSelector.makePosition(element, this.startState.positionX, element.positionX, this.startState.positionY, element.positionY)    
    }
    
    private resolveBreaks(breaks: Array<Break>,element: Element, deltaPos: number ,paramPosition: string, paramDimension: string, buffer: Buffer, edge1Func: (guideBreak: Break)=>void, edge2Func: (guideBreak: Break)=>void, releaseFunc: ()=>void, guides: Guide[]){
        for (var guideBreak of breaks){
            var edge2 = element[paramPosition] + element[paramDimension] <= guideBreak[paramPosition] + 10 && element[paramPosition] + element[paramDimension] > guideBreak[paramPosition] - 10
            var edge1 = element[paramPosition] > guideBreak[paramPosition] -10 && element[paramPosition] < guideBreak[paramPosition] + 10
            if (edge1 || edge2){
                if (!guideBreak.active){
                    var guide = new Guide()
                    guide[paramPosition] = guideBreak[paramPosition]
                    guideBreak.guide = guide
                    guides.push(guide)                
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
                    guides.splice(guides.indexOf(guideBreak.guide),1)
                    guideBreak.guide = null
                    guideBreak.active = false
                    buffer.value = 0
                    return false                    
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
        }
        if (dimensions.height){
            element.height += dimensions.height
        }
    }
    
    resize(element: Element,dimensions: ElementDimensions, page: Page, guides: Guide[]): ElementDimensions{
        if (!this.startState){
            this.startState = { width: element.width, height: element.height}
            this.initGuides(element,page)
            this.verticals = this.verticals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
            this.horizontals = this.horizontals.filter(guideBreak => this.filterOpositeBorder(guideBreak, dimensions, element))
        }
        
        let edge2FuncHorizontal = function(guideBreak: Break) { element.height = guideBreak.positionY - element.positionY}
        let edge2FuncVertical = function(guideBreak: Break) { element.width = guideBreak.positionX - element.positionX}
        let emptyFunc = function (guideBreak: Break) {}
        let releaseFuncVert = () => { element.width += this.bufferVertical.value }
        let releaseFuncHor = () => { element.height += this.bufferHorizontal.value }
        if(dimensions.width && dimensions.height){
            var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.height, 'positionY', 'height', this.bufferHorizontal,emptyFunc, edge2FuncHorizontal, releaseFuncHor, guides)
            var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.width, 'positionX', 'width', this.bufferVertical, emptyFunc, edge2FuncVertical, releaseFuncVert,guides)
            if(!verticalBreak && !horizontalBreak){
                return {width: dimensions.width,height: dimensions.height,top: null, left: null, border: null}
                //element.width += dimensions.width
                //element.height += dimensions.height
            }
        } else if (dimensions.height){
            var horizontalBreak = this.resolveBreaks(this.horizontals, element, dimensions.height, 'positionY', 'height', this.bufferHorizontal,emptyFunc, edge2FuncHorizontal, releaseFuncHor, guides)
            if(!horizontalBreak){
                return {width:null,height:dimensions.height,top: null, left: null, border: null} 
                //element.height += dimensions.height
            }
        } else if (dimensions.width){
            var verticalBreak = this.resolveBreaks(this.verticals, element, dimensions.width, 'positionX', 'width', this.bufferVertical, emptyFunc, edge2FuncVertical, releaseFuncVert,guides)
            if(!verticalBreak){
                return {width: dimensions.width,height: null,top: null, left: null, border: null}
                //element.width += dimensions.width
            }
        } 
                
        //this.finalStep = this.stepSelector.makeDimensions(element, this.startState.width, element.width, this.startState.height, element.height)    
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

interface Break{
    positionX?:number
    positionY?:number
    guide: Guide
    active: boolean
}

interface Buffer{
    value: number
}

