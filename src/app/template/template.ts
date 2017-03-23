import {Page} from '../page/page';
import {User} from '../user/user'
import {Tag} from '../tag/tag'
import {PageFactory} from '../page/page.factory'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'

@Injectable()
export class TemplateCommands {

	constructor(private service: UndoRedoService){}

	addPageAbove(template: Template, page: Page, factory: PageFactory){
		this.service.execute(new AddPageAbovePage(template, page, factory))
	}

	addPageBelow(template: Template, page: Page, factory: PageFactory){
		this.service.execute(new AddPageBelowPage(template, page, factory))
	}

	deletePage(template: Template, page: Page){
		this.service.execute(new DeletePage(template, page))
	}

}



export class AddPageAbovePage implements Command {

	constructor(private template: Template,private page: Page, private factory: PageFactory){}

	execute(){
		this.template.pages.splice(this.template.pages.indexOf(this.page),0, this.factory.build())
	}

	unExecute(){
		this.template.pages = this.template.pages.filter(page => page !== this.page)
	}


}

export class AddPageBelowPage implements Command {

	constructor(private template: Template,private page: Page, private factory: PageFactory){}

	execute(){
		this.template.pages.splice(this.template.pages.indexOf(this.page)+1,0, this.factory.build())
	}

	unExecute(){
		this.template.pages = this.template.pages.filter(page => page !== this.page)
	}

}

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



export class Template {
  id: number;
  name: string;
  pages: Page[];
  user: User
  tagged: Tag[]
  public: boolean
}