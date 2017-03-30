import {Content} from '../content/content';
import {Injectable} from '@angular/core';
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'

export enum Border { left, right, bottom, top };


@Injectable()
export class ElementCommands{

    constructor(private service: UndoRedoService){}

    startMovingElement(element: Element, dimensions){
        this.service.addToBufferAndExecute(new ChangeElementDimensions(element,dimensions))
    }

    startResizingElement(element: Element, dimensions){
        this.service.addToBufferAndExecute(new ChangeElementDimensions(element,dimensions))
    }

    startChangingOpacity(element: Element, value){
        this.service.addToBufferAndExecute(new ChangeElementOpacity(element,value))
    }

    finishMovingElement(){
        this.service.saveBuffer()
    }

    finishResizingElement(){
        this.service.saveBuffer()
    }

    changeBackgroundColor(element: Element, value){
        this.service.addToBufferAndExecute(new ChangeBackgroundColor(element,value))
    }

    toggleElementBackground(element: Element, value){
        if(value){
           this.changeBackgroundColor(element,Element.defaultBackgroundColor)
        }else{
           this.changeBackgroundColor(element,null)
        }
    }
}


export class ChangeElementDimensions implements BufferCommand{

    constructor(private element: Element, private dimensions){}

    oldDimensions

    private setDimensions(dimensions){
        if(dimensions.left != null){
            this.element.positionX = dimensions.left
        }
        if(dimensions.top != null){
            this.element.positionY = dimensions.top
        }
        if(dimensions.width != null){
            this.element.width = dimensions.width
        }
        if(dimensions.height != null){
            this.element.height = dimensions.height
        } 
    }

    private addDimensions(dimensions){
        if(dimensions.left != null){
            this.element.positionX += dimensions.left
        }
        if(dimensions.top != null){
            this.element.positionY +=  dimensions.top
        }
        if(dimensions.width != null){
            this.element.width += dimensions.width
        }
        if(dimensions.height != null){
            this.element.height += dimensions.height
        } 
    }

    execute(){
        this.oldDimensions = {left: this.element.positionX,top: this.element.positionY, width: this.element.width, height: this.element.height}
        this.addDimensions(this.dimensions)
    }

    unExecute(){
        this.setDimensions(this.oldDimensions)
    }

    getStoredState(){
        return this.oldDimensions
    }

    setStoredState(dimensions){
        this.oldDimensions = {left : dimensions.left, top: dimensions.top, width: dimensions.width, height: dimensions.height}
    }
}

export class ChangeElementOpacity implements BufferCommand{
 
 constructor(private element: Element, private value){}

    oldValue
    execute(){
        this.oldValue = this.element.opacity ? this.element.opacity : 100
        this.element.opacity = this.value
    }

    unExecute(){
        this.element.opacity = this.oldValue
    }

    getStoredState(){
        return this.oldValue
    }

    setStoredState(value){
        this.oldValue = value
    }

}

export class ChangeBackgroundColor implements BufferCommand{

    constructor(private element: Element, private value){}

    oldValue

    execute(){
        this.oldValue = this.element.background_color
        this.element.background_color = this.value
    }

    unExecute(){
        this.element.background_color = this.oldValue
    }

    getStoredState(){
        return this.oldValue
    }

    setStoredState(value){
        this.oldValue = value
    }

}


export class Element  {
    id: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rotation: number;
    type: string;
    opacity: number;
    content: Content;
    draggable: boolean = true;
    static defaultBackgroundColor: string = "#ccc"
    static notRecordedParams: Array<string> = ['draggable','changing','redoing', 'clientState']
    background_color: string
}


interface ElementDimensions {
    left
    top
    height
    width
}