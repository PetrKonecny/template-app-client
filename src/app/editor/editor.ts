import {BehaviorSubject} from 'rxjs'
//model for editor stored in text content
export class Editor {
    editor;
    id: string
    editorCurColor 
    editorCurFontSize 
    editorCurFont 
    subject = new BehaviorSubject(this);

    constructor(){
        this.id = Math.random().toString(36).substring(7);
    }
}