import { Component, OnInit, Input, ViewChild, QueryList, OnChanges, HostListener, EventEmitter, ElementRef} from '@angular/core';
import { Content} from './content';
import { TextContent } from './text-content'
import { NewElementComponent } from './new-element.component';
import { TemplateInstanceStore} from './template-instance.store'
import { Draggable} from './draggable.directive'

@Component({
    selector: 'display-content-img-drag',
    template:  `   
        <div #frame class="content">
            <img #image *ngIf="content.image" class="image" src="http://localhost:8080/img/{{content.image.image_key}}.{{content.image.extension}}">\n\          
        </div>
    `,
    styles:[`
        .element {
            background-color: white;
        }
        .content {
            min-height: 20px;\n\
            position: absolute;
        }        
    `],
    directives: [Draggable]
})

export class DisplayContentImgDragComponent implements OnInit {

    @Input()
    content: Content;
    
    @ViewChild('frame')
    element: any;
       
    @ViewChild('image')
    image: any;
    
    saveContent(){
       
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
        console.log(this.element);
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
                this.element.nativeElement.style.top = this.startElement.top + pos.top + 'px';
                this.element.nativeElement.style.left = this.startElement.left + pos.left + 'px';               
            }
        });      
    }
    
    zoomOut(){
        this.image.nativeElement.style.width = (this.image.nativeElement.scrollHeight*0.9) + 'px';
        this.image.nativeElement.style.height = (this.image.nativeElement.scrollWidth*0.9) + 'px';
    }
    
    zoomIn(){
        this.image.nativeElement.style.width = (this.image.nativeElement.scrollHeight*1.1) + 'px';
        this.image.nativeElement.style.height = (this.image.nativeElement.scrollWidth*1.1) + 'px';
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }
    
    getHeight() {
        return this.styleToNum(this.element.nativeElement.style.height)
        //eturn this.element.nativeElement.scrollHeight;
    }

    getWidth() {
        return this.styleToNum(this.element.nativeElement.style.width)
        //return this.element.nativeElement.scrollWidth;
    }
    
    getLeft() {
        return this.styleToNum(this.element.nativeElement.style.left);
    }
    
    getTop() {
        return this.styleToNum(this.element.nativeElement.style.top);
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
