
import {Content} from './content';
import {Editor} from '../editor/editor'
import {changeOneParamOnObj, NormalizerAddAction} from '../normalizers'

export class ChangeText extends NormalizerAddAction {
    subtype = "CHANGE_TEXT";
	constructor(content,text){
		super();
		this.data = changeOneParamOnObj(content,'contents','text',text);
	}
}

//model for text content
export class TextContent extends Content {
    text: string;
    type: string = "text_content";
    editor: Editor;
}

