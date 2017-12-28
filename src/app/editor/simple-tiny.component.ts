import {
  Component,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  NgZone,
  Output, OnInit, DoCheck, KeyValueDiffers, KeyValueDiffer
} from '@angular/core';
import {TextContent} from '../content/text-content'
import {Editor} from './editor'

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
        }
        `],
})

/**The component that integrates tiny-mce editor into Angular2 enviroment
*/
export class SimpleTinyComponent implements AfterViewInit, OnDestroy, OnInit  {

    @Input() 
    //content containing the editor 
    content: TextContent;
    @Output() 
    //triggered when typing into the editor
    onEditorKeyup = new EventEmitter<any>();

    ngOnInit(){
        this.content.editor = new Editor()
    }

    //sets up the editor with no menubar, no status bar, no toolbar
    //in inline mode
    ngAfterViewInit() {
        tinymce.init({
            selector: '#'+this.content.editor.id,
            menubar:false,
            statusbar: false,
            toolbar: false,
            inline:true,
            skin_url: '/assets/skins/lightgray',
            plugins: ['textcolor'],
            setup: editor => {
                this.content.editor.editor = editor
                editor.on('change', () => {
                    const content = editor.getContent();
                    this.onEditorKeyup.emit(content);
                });
                editor.on('NodeChange', (e) => {
                    this.content.editor.editorCurColor = this.rgb2hex(tinymce.DOM.getStyle(e.element, 'color', true));
                    this.content.editor.editorCurFont = tinymce.DOM.getStyle(e.element,'font-family',true);
                    this.content.editor.editorCurFontSize = tinymce.DOM.getStyle(e.element,'font-size',true);
                    this.content.editor.subject.next(this.content.editor);
                });
                editor.on('init', (e) => {
                    if (this.content.text){
                        this.content.editor.editor.setContent(this.content.text)
                    }
                });
            },
      });
    }
    
    //removes the editor instance if component is destroyed
    ngOnDestroy() {
        tinymce.remove(this.content.editor.editor);
    }
    
    rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return  (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }     
}