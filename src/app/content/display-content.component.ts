import { Component, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers} from '@angular/core';
import { Content} from './content';
import { TextContent, TextContentCommands } from './text-content'
import { AppConfig } from '../app.config'

@Component({
    selector: 'display-content',
    template:        
    `   <simple-tiny *ngIf="content.type === 'text_content'" 
            [content]="content"
            (onEditorKeyup)="keyupHandlerFunction($event)"
            clasś="content text"
        >
        </simple-tiny>
        <div *ngIf="content.type === 'image_content'" #frame [style.margin-left.px]="content.left" [style.margin-top.px]="content.top" class="content image">
            <img *ngIf="content.image && content.width && content.height" #image [width]="content.width" [height]="content.height" class="image" src="{{config.getConfig('api-url')}}/img/{{content.image.image_key}}.{{content.image.extension}}">\n\
            <img *ngIf="content.image &&!content.width && !content.height" #image class="image" src="{{config.getConfig('api-url')}}/img/{{content.image.image_key}}.{{content.image.extension}}">
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
        }
        .image{
            pointer-events: none;
        }
        .text{
            min-height: 100%;
            min-width: 100%;
            resize: none;
            background: none;
            width: 100%;
            height: 100%;
            overflow:hidden;
            user-select: none;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
            color: inherit;
        }
    `],
})

export class DisplayContentComponent {
    @Input()
    content: Content;
    @ViewChild('textBox')
    child: any;   
    
    @ViewChild('image')
    image: ElementRef;
    
    @ViewChild('frame')
    frame: ElementRef; 
    
    keyupHandlerFunction(text: string){
        let content =<TextContent> this.content
        this.commands.changeText(content, text)
    }

    getSubject(){
        return this.content
    }

    constructor(
        private config: AppConfig,
        private commands: TextContentCommands
    ){}
    
    saveContent(){
        /*if(this.content.type == 'text_content'){
            (<TextContent> this.content).text = this.child.nativeElement.textContent;
            this.child.nativeElement.textContent = (<TextContent>this.content).text;
        }
        if(this.content.type == 'image_content'){
            var content = <ImageContent>this.content;
            if(this.image){
                content.width = this.image.nativeElement.width;
                content.height = this.image.nativeElement.height; 
                content.left = this.styleToNum(this.frame.nativeElement.style.left);
                content.top = this.styleToNum(this.frame.nativeElement.style.top);
            }
        }*/
    }


    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    
   
}
