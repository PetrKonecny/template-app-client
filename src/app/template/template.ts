import {Page} from '../page/page';
import {User} from '../user/user'
import {Tag} from '../tag/tag'
import {PageFactory} from '../page/page.factory'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'
import { Action } from '@ngrx/store'

@Injectable()
export class TemplateCommands {

	constructor(private service: UndoRedoService){}

	/**adds page above the given page
	@param template - template to add page to
	@param page - page to add the page above
	@param page2 - page to add
	*/
	addPageAbove(template: Template, page: Page, page2: Page){
		this.service.execute(new AddPageAbovePage(template, page, page2))
	}

	/**adds page below the given page
	@param template - template to add page to
	@param page - page to add the page below
	@param page2 - page to add
	*/
	addPageBelow(template: Template, page: Page, page2: Page){
		this.service.execute(new AddPageBelowPage(template, page, page2))
	}

	/**deletes page from the template
	@param template - template to delete page from
	@param page - page to be deleted
	*/
	deletePage(template: Template, page: Page){
		this.service.execute(new DeletePage(template, page))
	}

}


//executing this command adds page above
export class AddPageAbovePage implements Command {

	constructor(private template: Template,private page: Page, private page2: Page){}

	execute(){
		this.template.pages.splice(this.template.pages.indexOf(this.page),0, this.page2)
	}

	unExecute(){
		this.template.pages = this.template.pages.filter(page => page !== this.page2)
	}


}

//executing this command adds page below
export class AddPageBelowPage implements Command {

	constructor(private template: Template,private page: Page, private page2: Page){}

	execute(){
		this.template.pages.splice(this.template.pages.indexOf(this.page)+1,0, this.page2)
	}

	unExecute(){
		this.template.pages = this.template.pages.filter(page => page !== this.page2)
	}

}

//executing this command deletes the page
export class DeletePage implements Command {

	index: number
	constructor(private template: Template,private page: Page){}

	execute(){
		this.index = this.template.pages.indexOf(this.page)
		this.template.pages.splice(this.index,1)	
	}

	unExecute(){
		this.template.pages.splice(this.index,0,this.page)
	}

}

export function templateReducer(state = {template: null}, action: Action) {
	switch (action.type) {
		default: return state;
	}
}

export class TemplatesAction implements Action {
	constructor(
		public type: string, 
		public data: any, 
		public error = null){
	}
}

export function templatesReducer(state = {templates: null, isFetching: null, error: null},action: any) {
	switch (action.type) {
		case "ADD_NORMALIZED_DATA":
			return state && 
				action.data.entities.templates && 
				Object.assign({},state,{templates: Object.assign({},state.templates,...action.data.entities.templates)})
		case "REQUEST_TEMPLATES":
			return Object.assign({},state,{'isFetching' : true})
		case "TEMPLATES_ERR":
			return Object.assign({},state,{'isFetching' : false, 'error': action.error})
		default: return state;
	}
}

// template model
export class Template {
  id: number;
  name: string;
  pages: Page[];
  user: User
  user_id: number;
  tagged: Tag[]
  public: boolean
  type: string
  created_at: number
  updated_at: number
}