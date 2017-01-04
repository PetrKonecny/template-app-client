import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, ElementRef, DoCheck, KeyValueDiffers} from '@angular/core';
import { ImageContent } from './image-content'

@Component({
    selector: 'display-content-img-drag',
    template:  `   
        <div #frame (move) ="move($event)" [style.left.px]="content.left" [style.top.px]="content.top" class="content">
            <img #image [width]="content.width" class="image" [height]="content.height"  class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">\n\          
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
            min-height: 20px;
            position: absolute;
        }
        .image{
            pointer-events: none;
        }        
    `]
})

export class DisplayContentImgDragComponent implements  DoCheck {

    @Input()
    content: ImageContent;
    
    @ViewChild('frame')
    frame: ElementRef;
       
    @ViewChild('image')
    image: ElementRef;
       
    move(dimensions: ElementDimensions){
        this.content.left = dimensions.left
        this.content.top = dimensions.top
    }
    
    ngDoCheck(){
        if((!this.content.width || !this.content.height) && this.image ){
            this.content.width = this.image.nativeElement.naturalWidth
            this.content.height = this.image.nativeElement.naturalHeight
        }
    }
    
    applyInputChanges(change: any){
        if(change.key == 'image'){
            if (!this.content.width){
                console.log(this.image)
            }
        }
    }
    
    // part of code from draggable directive 
    
    startElement: ElementDimensions;
    mousedrag;
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseover = new EventEmitter();
    
   
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
        this.mouseup.emit(event);

    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        console.log(this.frame);
        this.mousedown.emit(event);
        return false; // Call preventDefault() on the event
    }

    @HostListener('mousemove', ['$event'])
    onMouseover(event: MouseEvent) {
        this.mouseover.emit(event);
        return false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event) {
        this.mousemove.emit(event);
    }

    constructor() {
        this.mousedrag = this.mousedown.map((event: MouseEvent) => {
            this.startElement = this.getStats();
            return {
                left: event.clientX ,
                top: event.clientY
            };
        })
            .flatMap(imageOffset => this.mousemove.map((pos: MouseEvent) => {
                return {
                    top: pos.clientY - imageOffset.top,
                    left: pos.clientX - imageOffset.left
                }
            })
                .takeUntil(this.mouseup));
    }

    ngOnInit() {
        this.mousedrag.subscribe({
            next: pos => {
                this.content.top = this.startElement.top + pos.top;
                this.content.left = this.startElement.left + pos.left;               
            }
        });      
    }
    
    zoomOut(){
        this.content.width = this.content.width * 0.9;
        this.content.height = this.content.height * 0.9;
    }
    
    zoomIn(){
        this.content.width = this.content.width * 1.1;
        this.content.height = this.content.height * 1.1;
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    getHeight() {
        //return this.content.height
        return this.styleToNum(this.frame.nativeElement.style.height)
        //return this.element.nativeElement.scrollHeight;
    }

    getWidth() {
        //return this.content.width
        return this.styleToNum(this.frame.nativeElement.style.width)
        //return this.element.nativeElement.scrollWidth;
    }
    
    getLeft() {
        //return this.content.left
        return this.styleToNum(this.frame.nativeElement.style.left);
    }
    
    getTop() {
        //return this.content.top
        return this.styleToNum(this.frame.nativeElement.style.top);
    }
    
    getStats() {
        return { height: this.getHeight(), width: this.getWidth(), top: this.getTop(), left: this.getLeft()};
    }
}


enum Border { left, right, bottom, top };

interface ElementDimensions {
    left
    top
    height
    width
}
