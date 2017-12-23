import { Component, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import { Content } from './content';
import { TextContent, changeText } from './text-content'
import { AppConfig } from '../app.config'
import { ImageContent } from '../content/image-content'
import {Image, getImageById} from '../image/image'
import { Store } from '@ngrx/store'
import { AppState } from '../app.state'

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
            <image *ngIf="(image | async).id" (loaded)="onLoad($event)" (loadingError)="onError($event)" [image]="image | async"></image>
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
    changeDetection: ChangeDetectionStrategy.OnPush
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

    image
    
    //triggered when key in the editor is pressed
    keyupHandlerFunction(text: string){
        this.store.dispatch({subtype: "CHANGE_TEXT", type: "ADD_NORMALIZED_DATA", data: changeText(this.content,text)})
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
    @param commands - commands to manipulate text content
    */
    constructor(
        public store: Store<AppState>
    ){}

    ngOnInit(){
        if(this.content.type === 'image_content'){
            this.image = this.store.select(getImageById((<ImageContent>this.content).image))
        }
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    
   
}
