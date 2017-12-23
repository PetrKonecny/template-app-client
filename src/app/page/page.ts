import {Element} from '../element/element';
import {Guide} from '../guide/guide'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'
import {addNewIntoObjAfterX, NormalizerAddAction, swapFromObjOnXandY, removeFromObject} from '../normalizers'
//page model
export class Page  {
  id: number;
  elements: any[];
  rulers: Guide[];
  static defaultWidth = 210
  static defaultHeight = 297
  static presetDimensions = {A3:{width: 297,height:420},A4:{width:210,height:297},A5:{width:148,height:210}}
  width: number;
  height: number;
  pageNumber: number;  
  margin: number;
}

export interface PagesState {
  selected: number
  pages: any
}

export class BringElementForward extends NormalizerAddAction{

  constructor(public elementId, public page){
    super()
    var index = page.elements.indexOf(elementId)
    if(index < page.elements.length - 1){
      this.data = swapFromObjOnXandY(page,'pages','elements',index,index+1)
    }
  }
}

export class PushElementBack extends NormalizerAddAction{

  constructor(public elementId, public page){
    super()
    var index = page.elements.indexOf(elementId)
    if(index > 0){
      this.data = swapFromObjOnXandY(page,'pages','elements',index,index-1)
    }
  }
}

export class DeleteElement extends NormalizerAddAction{
  constructor(public elementId, public page){
    super()
    this.data = removeFromObject(page,'pages','elements',elementId)
  }
}

export class AddElement extends NormalizerAddAction{
  constructor(public element, public page){
    super()
    this.data = addNewIntoObjAfterX(page,'pages',element,'elements',page.elements.length-1)
  }

}

export function pagesReducer(state: PagesState = {selected: 0, pages: null},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA":
      if(action.data.entities.pages){ 
        return Object.assign({},state,{pages: Object.assign({},state.pages,...action.data.entities.pages)})
      }else{
        return state
      }
    default: return state;
  }
}
