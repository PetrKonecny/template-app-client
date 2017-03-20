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

    bringElementForward(page: Page, element: Element){
      this.service.execute(new BringElementForward(page,element))
    }

    pushElementBack(page: Page, element: Element){
      this.service.execute(new PushElementBack(page,element))
    }

}

export class AddElement implements Command{

	constructor(private page: Page, private element: Element){}

	execute(){
		this.page.elements.push(this.element)
	}

	unExecute(){
		this.page.elements.splice(this.page.elements.indexOf(this.element),1)
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

export class BringElementForward implements Command{

  constructor(private page: Page, private element: Element){}

  oldIndex
  execute(){
    this.oldIndex = this.page.elements.indexOf(this.element)
    if(this.oldIndex == this.page.elements.length - 1){
      throw new Error("element is already at last position")
    }
    this.page.elements.splice(this.oldIndex, 0, this.page.elements.splice(this.oldIndex + 1, 1)[0]);
  }

  unExecute(){
    this.page.elements.splice(this.oldIndex+1, 0, this.page.elements.splice(this.oldIndex, 1)[0]);
  }
}

export class PushElementBack implements Command{

  constructor(private page: Page, private element: Element){}

  oldIndex
  execute(){
    if(this.oldIndex == 0){
        throw new Error("element is already at first position")
    }
    this.oldIndex = this.page.elements.indexOf(this.element)
    this.page.elements.splice(this.oldIndex, 0, this.page.elements.splice(this.oldIndex + -1, 1)[0]);
  }

  unExecute(){
    this.page.elements.splice(this.oldIndex-1, 0, this.page.elements.splice(this.oldIndex, 1)[0]);
  }
}

export class Page  {
  id: number;
  elements: Element[];
  rulers: Guide[];
  static defaultWidth = 210
  static defaultHeight = 297
  static presetDimensions = {A3:{width: 297,height:420},A4:{width:210,height:297},A5:{width:148,height:210}}
  width: number;
  height: number;
  pageNumber: number;  
}