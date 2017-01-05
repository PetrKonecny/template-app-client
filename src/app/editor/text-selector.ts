import {Injectable} from '@angular/core';
import {Element} from '../element/element'
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/Rx';
import {Font} from '../font/font'
import {Editor} from './editor'

@Injectable()
export class TextSelector {
    
  
    private _editor: BehaviorSubject<Editor> = new BehaviorSubject<Editor>(null);
    public editor: Observable<Editor> = this._editor.asObservable();


    changeEditor(editor: Editor){
    	this._editor.next(editor)
    }

    changeEditorFontSize(size: number){
      
    }
    
    changeEditorTextBold(){
        this._editor.value.editor.execCommand("Bold")     
    }
    
    changeEditorTextItalic(){
        this._editor.value.editor.execCommand("Italic")     
    }
    
    changeEditorFormatBlock(block: string){
        this._editor.value.editor.execCommand('FormatBlock', false , block)
    }
    
    changeEditorFont(font: Font){
        this._editor.value.editor.execCommand('FontName',false,'font'+font.id)       
    }
    
    changeEditorTextAlign(align: string){
        this._editor.value.editor.execCommand(align)
    }
     
    changeEditorTextColor(color: string){
        this._editor.value.editor.execCommand('ForeColor', false, color);
    }

  
}