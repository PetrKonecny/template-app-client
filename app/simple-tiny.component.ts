import {
  Component,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output, OnInit
} from '@angular/core';
import {ColorPickerDirective} from 'ct-angular2-color-picker/component'
import {TextContent, Editor} from './text-content'

declare var tinymce: any;

@Component({
  selector: 'simple-tiny',
  template: `<div class="text" id="{{content.editor.id}}"></div>`,
  styles:[`
        .element {
            background-color: white;
        }
        .content {
            position: absolute;         
        }
        .image{
            pointer-events: none;
        }
        .text{
            min-height: 100%;
            min-width: 100%;
            resize: none;
            width: 100%;
            height: 100%;
            overflow:hidden;
            user-select: none;
        }`],
    directives:[ColorPickerDirective]
})
export class SimpleTinyComponent implements AfterViewInit, OnDestroy, OnInit {
    @Input() content: TextContent;
    @Output() onEditorKeyup = new EventEmitter<any>();
    
    ngOnInit(){
        this.content.editor = new Editor()
    }
  
    ngAfterViewInit() {
        console.log(this.content.editor.id)
        tinymce.init({
            selector: '#'+this.content.editor.id,
            menubar:false,
            statusbar: false,
            toolbar: false,
            inline:true,
            plugins: ['textcolor'],
            skin_url: '/node_modules/tinymce/skins/lightgray',
            setup: editor => {
                this.content.editor.editor = editor
                editor.on('keyup change', () => {
                    const content = editor.getContent();
                    this.onEditorKeyup.emit(content);
                });
                    editor.on('NodeChange', (e) => {
                    this.content.editor.editorCurColor = tinymce.DOM.getStyle(e.element, 'color', true)
                });
            },
      });
    }
    
    ngOnDestroy() {
        tinymce.remove(this.content.editor);
    }

    bold(){
        this.content.editor.editor.execCommand("Bold")     
    }

    textColor(color: string){
        this.content.editor.editor.execCommand('ForeColor', false, color);
    }
}