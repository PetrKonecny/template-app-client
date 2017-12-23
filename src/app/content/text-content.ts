
import {Content} from './content';
import {Editor} from '../editor/editor'
import {UndoRedoService, Command, BufferCommand} from '../undo-redo.service'
import {Injectable} from '@angular/core';
import {changeOneParamOnObj} from '../normalizers'

@Injectable()
export class TextContentCommands{

	constructor(private service: UndoRedoService){}

	/**changes test of the text content
	@param content - content to add text to
	@param text - text to add
	*/
	changeText(content: TextContent, text: string){
		this.service.addToBufferAndExecute(new ChangeText(content,text))
	}


}

//executing this command changes text of the content 
export class ChangeText implements BufferCommand{

	constructor(private content: TextContent, private text: string){}
	storedText :string
	fresh = true

	execute(){
		this.storedText = this.content.text
		this.content.text = this.text
		if(!this.fresh && this.content.editor){
			Editor.setText(this.content.editor,this.text)
		}
	}

	unExecute(){
		this.fresh = false
		if(this.content.editor){
			Editor.setText(this.content.editor,this.storedText)
		}
		this.content.text = this.storedText
	}

	getStoredState(){
		return {storedText: this.storedText, fresh: this.fresh}
	}

	setStoredState(state){
		this.storedText = state.storedText
		this.fresh = state.fresh
	}


}

export function changeText(content,text){
	return changeOneParamOnObj(content,'contents','text',text)
}

//model for text content
export class TextContent extends Content {
    text: string
    type: string = "text_content";
    editor: Editor
}

