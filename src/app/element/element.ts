import {Content} from '../content/content';
import {Injectable} from '@angular/core';
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'
import {NormalizerAddAction, changeMoreParamsOnObjNotNull, changeOneParamOnObj} from '../normalizers'
import { Action, createSelector } from '@ngrx/store'
import { AppState } from '../app.state'

export enum Border { left, right, bottom, top };

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
    static defaultBackgroundColor: string = "#ccc";
    static notRecordedParams: Array<string> = ['draggable','changing','redoing', 'clientState'];
    background_color: string;
}

export class SelectElement {
  type = "SELECT_ELEMENT";
  constructor(public selected){
    
  }
}

class ChangeElementDimensions extends NormalizerAddAction {
    constructor(element,dimensions){
        super();
        this.data = changeMoreParamsOnObjNotNull(element,'elements', ['positionX','positionY','width','height'],
        [element.positionX + dimensions.left,
         element.positionY + dimensions.top,
         element.width + dimensions.width,
         element.height + dimensions.height]);
    }
}

export class SetElementDimensions extends NormalizerAddAction {
    subtype = "SET_ELEMENT_DIMENSIONS"
    constructor(element,dimensions){
        super();
        this.data = changeMoreParamsOnObjNotNull(element,'elements', ['positionX','positionY','width','height'],
        [dimensions.left,
         dimensions.top,
         dimensions.width,
         dimensions.height]);
    }
}

export class ResizeElement extends ChangeElementDimensions{
    subtype = "RESIZE_ELEMENT";
}

export class MoveElement extends ChangeElementDimensions {
    subtype = "MOVE_ELEMENT";
}

export class ChangeBackgroundColor extends NormalizerAddAction {
    subtype = "CHANGE_BACKGROUND_COLOR";
    constructor(element, color){
        super();
        this.data = changeOneParamOnObj(element,'elements','background_color',color);
    }
}

export class ChangeOpacity extends NormalizerAddAction {
    subtype = "CHANGE_OPACITY";
    constructor(element, opacity: number){
        super();
        if(opacity <= 100 && opacity > 0){
            this.data  = changeOneParamOnObj(element,'elements','opacity',opacity);
        }
    }
}

export function elementsReducer(state = {selected: 0, elements: null},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA": 
        if(action.data.entities.elements){ 
            return Object.assign({},state,{elements: Object.assign({},state.elements,...action.data.entities.elements)})
        }else{
            return state
        }
    case "SELECT_ELEMENT":
        return {...state, selected: action.selected}
    default: return state;
  }
}


export const getElements = (state: AppState) => state.elements.elements

export const getElementById = (id) => createSelector(getElements,(elements)=>{
    return elements && elements[id]
})

interface ElementDimensions {
    left
    top
    height
    width
}