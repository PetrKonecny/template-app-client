export class Editor {
    editor: any
    id: string
    editorCurColor: string
    editorCurFontSize: number
    editorCurFont: string
    
    constructor(){
        this.id = Math.random().toString(36).substring(7);
    }

    static setText(editor: Editor, text: string){
    	editor.editor.setContent(text)
    }
    
}