import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, ElementRef, DoCheck, KeyValueDiffers} from '@angular/core';
import { ImageContent } from './image-content'
import { Draggable} from './draggable.directive'

@Component({
    selector: 'display-content-img-drag',
    template:  `   
        <div #frame [style.left.px]="content.left" [style.top.px]="content.top" class="content">
            <img #image *ngIf="content.image"  [width]="content.width" [height]="content.height"  class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">\n\          
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
    `],
    directives: [Draggable]
})

export class DisplayContentImgDragComponent implements OnInit, DoCheck {

    @Input()
    content: ImageContent;
    
    @ViewChild('frame')
    frame: ElementRef;
       
    @ViewChild('image')
    image: ElementRef;
    
    differ: any;
    
    saveContent(){
        this.content.left = this.styleToNum(this.frame.nativeElement.style.left);
        this.content.top = this.styleToNum(this.frame.nativeElement.style.top);
        this.content.width = this.image.nativeElement.width;
        this.content.height = this.image.nativeElement.height;
    }
    
    ngDoCheck(){
        var changes = this.differ.diff(this.content);
        if(changes) {
                changes.forEachChangedItem(r => this.applyInputChanges(r));
                changes.forEachAddedItem(r => this.applyInputChanges(r));
        } 
    }
    applyInputChanges(change: any){
        if(change.key == 'width'){
            this.changeWidth(this.content.width)
        }else if(change.key == 'height'){
            this.changeHeight(this.content.height)
        }else if(change.key == 'left'){
            this.changeX(this.content.left)
        }else if(change.key == 'top'){
            this.changeY(this.content.top)
        }
    }
    
    changeWidth(width: number){
        if(width <= 0) return
        if(!this.image) return
        this.image.nativeElement.style.width = width;
    }
    
    changeHeight(height: number){
        if(height <= 0) return
        if(!this.image) return
        this.image.nativeElement.style.height = height;
    }
    
    changeX(x: number){
        if(x <= 0) return
        if(!this.frame) return
        this.frame.nativeElement.style.left = x;
    }
    
    changeY(y: number){
        if(y <= 0) return
        if(!this.frame) return
        this.frame.nativeElement.style.top = y;
    }

    
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

    constructor(private differs: KeyValueDiffers) {
        this.differ = differs.find({}).create(null);
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
        return this.content.height
        //return this.styleToNum(this.frame.nativeElement.style.height)
        //eturn this.element.nativeElement.scrollHeight;
    }

    getWidth() {
        return this.content.width
        //return this.styleToNum(this.frame.nativeElement.style.width)
        //return this.element.nativeElement.scrollWidth;
    }
    
    getLeft() {
        return this.content.left
        //return this.styleToNum(this.frame.nativeElement.style.left);
    }
    
    getTop() {
        return this.content.top
        //return this.styleToNum(this.frame.nativeElement.style.top);
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
