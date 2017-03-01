
import {Content} from './content';
import {Editor} from '../editor/editor'
import {UndoRedoService, Command} from '../undo-redo.service'
import {Injectable} from '@angular/core';

@Injectable()
export class TextContentRedoer{

	constructor(private service: UndoRedoService){}

	changeText(content: TextContent, text: string){
		this.service.execute(new ChangeText(content,text))
	}

}

export class ChangeText implements Command{

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


}

export class TextContent extends Content {
    text: string
    type: string = "text_content";
    editor: Editor
}

