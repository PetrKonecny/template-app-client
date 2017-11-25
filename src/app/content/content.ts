import {TemplateInstance} from '../template-instance/template-instance';

//content model
export class Content  {
    id: number;
    element_id: number;
    templateInstance: TemplateInstance;
    type: string;
}

export function contentsReducer(state = {contents: null},action: any) {
  switch (action.type) {
    case "ADD_NORMALIZED_DATA":
      return state && 
        action.data.entities.contents && 
        Object.assign({},state,{contents: Object.assign({},state.contents,...action.data.entities.contents)})
    default: return state;
  }
}

export function contentReducer(state = {content: 0}, action: any) {
  switch (action.type) {
    default: return state;
  }
}