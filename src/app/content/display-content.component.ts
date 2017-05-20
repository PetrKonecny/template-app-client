import { Component, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers, EventEmitter, Output} from '@angular/core';
import { Content } from './content';
import { TextContent, TextContentCommands } from './text-content'
import { AppConfig } from '../app.config'
import { ImageContent } from '../content/image-content'
import {Image} from '../image/image'

@Component({
    selector: 'display-content',
    template:        
    `   <simple-tiny *ngIf="content.type === 'text_content'" 
            [content]="content"
            (onEditorKeyup)="keyupHandlerFunction($event)"
            clasś="content text"
        >
        </simple-tiny>
        <div *ngIf="content.type === 'image_content'" #frame [style.margin-left.px]="content.left" [style.margin-top.px]="content.top" class="content image" [style.width.px]="content.width" [style.height.px]="content.height" >
            <image *ngIf="content?.image" (loaded)="onLoad($event)" (loadingError)="onError($event)" [image]="content.image"></image>
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

//displays text or image content 
export class DisplayContentComponent {
    @Input()
    //content to be displayed
    content: Content;
   
    @Output()
    //triggered when new image is loaded
    loaded = new EventEmitter

    @Output()
    //trigered if error while loading image
    loadingError = new EventEmitter

    //loading indicator
    loading = true
    
    //triggered when key in the editor is pressed
    keyupHandlerFunction(text: string){
        let content =<TextContent> this.content
        this.commands.changeText(content, text)
    }

    //trigered when image is laoded
    onLoad(image: Image){
        this.loaded.emit(image)
    }

    //triggered on error while loading image
    onError(){
        this.loadingError.emit()
    }

    /**
    @param config - config to get API URL from
    @param commands - commands to manipulate text content
    */
    constructor(
        private config: AppConfig,
        private commands: TextContentCommands
    ){}
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    
   
}
