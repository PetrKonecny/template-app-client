import {Content} from './content';

export class TextContent extends Content {
    text: string
    type: string = "text_content";
    editor: Editor
}

export class Editor {
    editor: any
    id: string
    editorCurColor: string
    editorCurFontSize: number
    editorCurFont: string
    
    constructor(){
        this.id = Math.random().toString(36).substring(7);
    }
    
}
