import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, ElementRef, DoCheck, KeyValueDiffers} from '@angular/core';
import { ImageContent, ImageContentCommands } from './image-content'
import { AppConfig } from '../app.config'

@Component({
    selector: 'display-content-img-drag',
    template:  `
        <div draggable2 #frame (move) ="move($event)" [style.left.px]="content.left" [style.top.px]="content.top" class="content">
            <img #image [width]="content.width" class="image" [height]="content.height"  class="image" src="{{config.getConfig('api-url')}}/img/{{content.image.image_key}}.{{content.image.extension}}">\n\          
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
            min-height: 20px;
        }
        .image{
            pointer-events: none;
            opacity: 0.5;
        }        
    `]
})

//special case for displaying content as an image that can be dragged 
export class DisplayContentImgDragComponent implements  DoCheck {

    @Input()
    //content to be dragged
    content: ImageContent;
    element: ImageContent = this.content;
    
    @ViewChild('frame')
    //reference to template element #frame
    frame: ElementRef;

    //reference to template element #image
    @ViewChild('image')
    image: ElementRef;
       
    move(dimensions){
        this.commands.startMovingImage(this.content,dimensions)
    }
    
    //this runs on every change in the application 
    ngDoCheck(){
        if((!this.content.width || !this.content.height) && this.image ){
            let width = this.image.nativeElement.naturalWidth
            let height = this.image.nativeElement.naturalHeight
            let ratio = width/height
            if(width > 1000 || height > 1000){
                width = 1000 * ratio
                height = 1000
            }

            this.content.width = width
            this.content.height = height
        }
    }
    
    /**
    @param config - config to get API url from
    @param commands - commands to manipulate the image
    */
    constructor(public config: AppConfig, private commands: ImageContentCommands) {
       
    }
}
