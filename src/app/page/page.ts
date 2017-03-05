import {Element} from '../element/element';
import {Guide} from '../guide/guide'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'

@Injectable()
export class PageCommands{

    constructor(private service: UndoRedoService){}

    addElement(page: Page, element: Element){
    	this.service.execute(new AddElement(page,element))
    }

    RemoveElement(page: Page, element: Element){
    	this.service.execute(new RemoveElement(page,element))
    }

}

export class AddElement implements Command{

	constructor(private page: Page, private element: Element){}

	execute(){
		this.page.elements.push(this.element)
	}

	unExecute(){
		this.page.elements = this.page.elements.filter(element=> this.element !== element)
	}	
}

export class RemoveElement implements Command{

	constructor(private page: Page, private element: Element){}

	execute(){
		this.page.elements = this.page.elements.filter(element=> this.element !== element)
	}

	unExecute(){
		this.page.elements.push(this.element)
	}

}

export class Page  {
  id: number;
  elements: Element[];
  rulers: Guide[];
  size: number;
  pageNumber: number;  
}