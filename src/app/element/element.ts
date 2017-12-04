import {Content} from '../content/content';
import {Injectable} from '@angular/core';
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'

export enum Border { left, right, bottom, top };


@Injectable()
//groups all element commands and injects undo redo service for convinience
export class ElementCommands{

    constructor(private service: UndoRedoService){}

    /**starts moving element, saveBuffer() on UndoRedoService 
    should be called after move is finished
    @param element - element that should be moved
    @param dimensions - dimensions it should be moved by
    **/
    startMovingElement(element: Element, dimensions){
        this.service.addToBufferAndExecute(new ChangeElementDimensions(element,dimensions))
    }

    /**starts resizing element, saveBuffer() on UndoRedoService
    should be called after resize is finished
    @param element - element that should be moved
    @param dimensions - dimensions it should be resized by
    **/
    startResizingElement(element: Element, dimensions){
        this.service.addToBufferAndExecute(new ChangeElementDimensions(element,dimensions))
    }

    /**starts changing element opacity, saveBuffer() on UndoRedoService
    should be called after change is finished
    @param element - element that should be changed
    @param value - value that should be set as opacity
    **/
    startChangingOpacity(element: Element, value){
        this.service.addToBufferAndExecute(new ChangeElementOpacity(element,value))
    }

    /**sets element dimensions 
    @param element - element to be changed
    @param dimensions - dimensions that sohuld be set on element 
    **/
    setElementDimensions(element: Element, dimensions){
        this.service.execute(new SetElementDimensions(element,dimensions))
    }

    //convinience method to save buffer
    finishMovingElement(){
        this.service.saveBuffer()
    }

    //convinience method to save buffer
    finishResizingElement(){
        this.service.saveBuffer()
    }

    //convinience method to save buffer
    finishChangingOpacity(){
        this.service.saveBuffer()
    }

    /**changes background color of the element
    @param element - element to be changed
    @param value - css value to be changed 
    **/
    changeBackgroundColor(element: Element, value: string){
        this.service.addToBufferAndExecute(new ChangeBackgroundColor(element,value))
    }

    /**turns off or on element background display
    @param element - element to be changed
    @param value - boolean walue whether it should be on or off 
    **/
    toggleElementBackground(element: Element, value: boolean){
        if(value){
           this.changeBackgroundColor(element,Element.defaultBackgroundColor)
        }else{
           this.changeBackgroundColor(element,null)
        }
    }
}

/*
sets element dimensions to value given 
*/
export class SetElementDimensions implements Command{

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

    execute(){
        this.oldDimensions = {left: this.element.positionX,top: this.element.positionY, width: this.element.width, height: this.element.height}
        this.setDimensions(this.dimensions)
    }

    unExecute(){
        this.setDimensions(this.oldDimensions)
    }
}

/*
adds or substracts the given values from element dimensions
*/
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

/*
changes element opacity to the given value
*/
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

/*
changes element background color to the given value
*/
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

//element model
export class Element  {
    id: number;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    rotation: number;
    type: string;
    opacity: number;
    content: any;
    draggable: boolean = true;
    static defaultBackgroundColor: string = "#ccc"
    static notRecordedParams: Array<string> = ['draggable','changing','redoing', 'clientState']
    background_color: string
}

export function elementsReducer(state = {selected: 0, elements: null},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA": 
        if(action.data.entities.elements){ 
            return Object.assign({},state,{elements: Object.assign({},state.elements,...action.data.entities.elements)})
        }else{
            return state
        }
    default: return state;
  }
}

interface ElementDimensions {
    left
    top
    height
    width
}