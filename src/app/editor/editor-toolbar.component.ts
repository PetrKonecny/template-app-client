import { Component, OnInit , Input, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import { ImageService } from '../image/image.service';
import {FontService} from '../font/font.service';
import {Editor} from './editor'
import {Font} from '../font/font'
import { ElementStore } from '../element/element.store'
import {TextContent} from '../content/text-content'

@Component({
    selector: 'editor-toolbar',
    template: ` <span *ngIf="editor | async as editor">
                    <font-toolbar (onFontSelected)="changeEditorFont(editor, $event)" (onFontSizeSelected)="changeEditorFontSize(editor,$event)" [fontLabel]="editor.editorCurFont.substring(0,5)" [fontSizeLabel]="editor.editorCurFontSize"></font-toolbar>
                    <button md-icon-button md-tooltip="barva písma" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="editor.editorCurColor">fiber_manual_record</md-icon></button>
                    <md-menu #backgroundColorMenu>
                        <div (click)="$event.stopPropagation()">
                            <div md-menu-item [colorPicker]="editor.editorCurColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeEditorTextColor(editor, $event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                            </div>
                        </div>       
                    </md-menu>
                    <button md-icon-button [mdMenuTriggerFor]="textMenu"  mdTooltip="formát textu">F</button>
                    <md-menu (click)="$event.stopPropagation()" #textMenu="mdMenu">
                        <button md-icon-button (click)="changeEditorTextAlign(editor, 'JustifyLeft')" mdTooltip="zarovnat doleva"><md-icon>format_align_left</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign(editor, 'JustifyRight')" mdTooltip="zarovnat doprava"><md-icon>format_align_right</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign(editor, 'JustifyCenter')" mdTooltip="zarovnat na střed"><md-icon>format_align_center</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextAlign(editor, 'JustifyFull')" mdTooltip="zarovnat do bloku"><md-icon>format_align_justify</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextBold(editor)" mdTooltip="tučné"><md-icon>format_bold</md-icon></button>
                        <button md-icon-button (click)="changeEditorTextItalic(editor)" mdTooltip="kurzíva"><md-icon>format_italic</md-icon></button>
                        <button md-icon-button (click)="changeEditorFormatBlock(editor, 'h1')" mdTooltip="nadpis 1">H1</button>
                        <button md-icon-button (click)="changeEditorFormatBlock(editor, 'h2')" mdTooltip="nadpis 2">H2</button>
                        <button md-icon-button (click)="changeEditorFormatBlock(editor, 'p')" mdTooltip="odstavec">P</button>
                    </md-menu>
                </span>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush

})

//displays custom toolbar for tiny-mce editor 
export class EditorToolbarComponent {
    
    //editor of currently selected text element
    @Input()
    editor   

    curColor: string

    init: boolean
    
   //calls tiny-mce command to change font size   
   changeEditorFontSize(editor, size: number){
        editor.editor.execCommand('fontSize',false,size+"px")       
    }
    
    //calls tiny-mce command to change font bold
    changeEditorTextBold(editor){
        editor.editor.execCommand("Bold")     
    }
    
    //calls tiny-mce command to change font italic
    changeEditorTextItalic(editor){
        editor.editor.execCommand("Italic")     
    }
    

    //calls tiny-mce command to change text format
    changeEditorFormatBlock(editor, block: string){
        editor.editor.execCommand('FormatBlock', false , block)
    }
    
    //calls tiny-mce command to change editor font
    changeEditorFont(editor, font: Font){
        let fontName = ""
        if(font.id){
            fontName = "font" + font.id
        }else if (font.name){
            fontName = font.name
        }
        editor.editor.execCommand('FontName',false,fontName)       
    }
    
    //calls tiny-mce command to change text align
    changeEditorTextAlign(editor, align: string){
        editor.editor.execCommand(align)
    }
     
    //calls tiny-mce command to change text color
    changeEditorTextColor(editor, color: string){
        if(this.init){
            editor.editor.execCommand('ForeColor', false, color);
        }
        this.init = true
    }
    
}