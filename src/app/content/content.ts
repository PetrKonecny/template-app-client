import {TemplateInstance} from '../template-instance/template-instance';

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
