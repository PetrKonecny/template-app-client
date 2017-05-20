import {Element} from '../element/element';
import {Guide} from '../guide/guide'
import {Injectable} from '@angular/core';
import {UndoRedoService, Command} from '../undo-redo.service'

@Injectable()
export class PageCommands{

    constructor(private service: UndoRedoService){}

    /** adds element into the page
    @param page - page to add element to
    @param element - element to be added
    */
    addElement(page: Page, element: Element){
    	this.service.execute(new AddElement(page,element))
    }

    /** removes element from the page
    @param page - page to remove element
    @param element - element to be removed
    */
    RemoveElement(page: Page, element: Element){
    	this.service.execute(new RemoveElement(page,element))
    }


    /** brings element forward in the page
    @param page - page conaining the element
    @param element -element to be brought forward
    */
    bringElementForward(page: Page, element: Element){
      this.service.execute(new BringElementForward(page,element))
    }

    /** pushes element back in the page
    @param page - page conaining the element
    @param element -element to be pushed back
    */
    pushElementBack(page: Page, element: Element){
      this.service.execute(new PushElementBack(page,element))
    }

}

//executing this command adds element
export class AddElement implements Command{

	constructor(private page: Page, private element: Element){}

	execute(){
		this.page.elements.push(this.element)
	}

	unExecute(){
		this.page.elements.splice(this.page.elements.indexOf(this.element),1)
	}	
}

//executing this command removes the element
export class RemoveElement implements Command{

	constructor(private page: Page, private element: Element){}

  oldIndex
	execute(){
    this.oldIndex = this.page.elements.indexOf(this.element)
		this.page.elements.splice(this.oldIndex,1)
	}

	unExecute(){
    this.page.elements.splice(this.oldIndex,0,this.element)
	}

}

//executing this command brings the element forward on the page
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

//executing this command pushes element back in the page
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

//page model
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
  margin: number;
}