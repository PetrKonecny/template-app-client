import {TemplateInstance} from '../template-instance/template-instance';
import { AppState } from '../app.state'
import { Action, createSelector } from '@ngrx/store'

//content model
export class Content  {
    id: number;
    element_id: number;
    templateInstance: TemplateInstance;
    type: string;
}

export function contentsReducer(state = {contents: null, selected: 0},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA":
        if(action.data.entities.contents) { 
          return Object.assign({},state,{contents: Object.assign({},state.contents,...action.data.entities.contents)})
        }else{
          return state
        }
    default: return state;
  }
}

export const getContents = (state: AppState) => state.contents.contents

export const getContentById = (id) => createSelector(getContents,(contents)=>{
    return contents && contents[id];
})

export const getContentFromStore = (id,store) => store.select(getContentById(id)) 
