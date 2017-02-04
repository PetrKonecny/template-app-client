import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Image } from './image';
import { Router } from '@angular/router'
import { AppConfig } from '../app.config';


@Component({
    selector: 'image-list',
    template: `
            <md-grid-list cols="3">
                <md-grid-tile *ngFor="let image of images" (click)="onSelect(image)">
                    <img class="image" draggable="true" (dragstart)="drag($event,image)" src="{{config.getConfig('api-url')}}/img/{{image.image_key}}.{{image.extension}}?w=250&h=250&fit=crop">
                </md-grid-tile>
            </md-grid-list> `,
    styles: [`        
            .image {
                margin: 5px;
                border: 1px solid #ccc;
                float: left;
                width: 250px;
                height: 250px;}
            .image:hover {
                border: 1px solid #777;
            }
            .container {
                z-index: 3;
                background-color: grey;
                border: 1px solid black;
                display: flex;
                flex-wrap: wrap;
                width: 90%;
            }
            `]
})

export class ImageListComponent {
     
    @Input()
    images : Image[] 
    @Output() onImageClicked = new EventEmitter<Image>();
    
    constructor( private config: AppConfig){}
    
    onSelect(image: Image) {
        this.onImageClicked.emit(image);
    }

    drag(event, image){
        event.dataTransfer.setData("text",JSON.stringify(image))
    }
    
}