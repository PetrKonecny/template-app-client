import {Page} from '../page/page';
import {User} from '../user/user'
import {Tag} from '../tag/tag'
import {PageFactory} from '../page/page.factory'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'
import { Action } from '@ngrx/store'
import { addNewIntoObjAfterX, removeFromObject, NormalizerAddAction } from '../normalizers'

export class AddPageAbove extends NormalizerAddAction {
	subtype: string = "ADD_PAGE_ABOVE"
	constructor(public page: Page, public page2 : number, public template){
		super()
		this.data = addNewIntoObjAfterX(template,'templates',page,'pages',template.pages.indexOf(page2))
	}
}

export class AddPageBelow extends NormalizerAddAction {
	subtype: string = "ADD_PAGE_BELOW"
	constructor(public page: Page, public page2 : number, public template){
		super()
		this.data = addNewIntoObjAfterX(template,'templates',page,'pages',template.pages.indexOf(page2) + 1)
	}
}

export class DeletePage extends NormalizerAddAction {
	subtype: string = "DELETE_PAGE"
	constructor(public pageId: number, public template){
		super()
		this.data = removeFromObject(template,'templates','pages', pageId)
	}
}

export interface TemplatesState {
	selected: number,
	templates: any,
	isFetching: Action,
	error: any
}

export function templatesReducer(state = {selected: 0, templates: null, isFetching: null, error: null},action) {
	switch (action.type) {
		case "ADD_NORMALIZED_DATA":
			if(action.data.entities.templates){ 
				return Object.assign({},state,{selected: action.selected, templates: Object.assign({},state.templates,...action.data.entities.templates)})
			}else{
				return state
			}
		case "SELECT TEMPLATE":
			return Object.assign({},state,{selected: action.selected})
		case "REQUEST_TEMPLATES":
			return Object.assign({},state,{'isFetching' : true})
		case "TEMPLATES_ERR":
			return Object.assign({},state,{'isFetching' : false, 'error': action.error})
		default: return state;
	}
}

export const selectTemplates = (state: TemplatesState) => state.templates;

// template model
export class Template {
  id: number;
  name: string;
  pages: any[];
  user: User
  user_id: number;
  tagged: any[]
  public: boolean
  type: string
  created_at: number
  updated_at: number
}