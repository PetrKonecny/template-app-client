import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[draggable2]'
})

export class Draggable2 implements OnInit {

    mousedrag;
    enabled: boolean = true;
    started: boolean = false;
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseover = new EventEmitter();
    startElement: ElementDimensions;

   
    @Output()
    move = new EventEmitter<ElementDimensions>()
  
    borderClick;
    
   
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
        this.mouseup.emit(event);
        this.enabled = true
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        if (this.enabled){     
            this.mousedown.emit(event)
        }
        //return false; // Call preventDefault() on the event
    }

    @HostListener('mousemove', ['$event'])
    onMouseover(event: MouseEvent) {
        this.mouseover.emit(event);
        //return false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event) {
        if (this.enabled){
            this.mousemove.emit(event);
        }
    }

    constructor(public element: ElementRef) {
        this.mousedrag = this.mousedown.map((event: MouseEvent) => {
            this.startElement = this.getStats()
            this.started = true
            var border = this.detectBorderPosition({left: event.offsetX, top: event.offsetY})
            if(border){
                this.enabled = false;
            }
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
                var dimensions = this.getStats();
                dimensions.left = this.startElement.left + pos.left
                dimensions.top = this.startElement.top + pos.top
                this.move.emit(dimensions)
            }
        });       
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
    
    detectBorderPosition(pos) {
        var borderPosition;
        var fromLeft = pos.left;
        var fromTop = pos.top;
        var fromRight = this.getWidth() - pos.left;
        var fromBottom = this.getHeight() - pos.top;
        if (fromLeft < 10) {
            borderPosition = Border.left;
        } else if (fromTop < 10) {
            borderPosition = Border.top;
        } else if (fromRight < 10) {
            borderPosition = Border.right;
        } else if (fromBottom < 10) {
            borderPosition = Border.bottom;
        } else {
            borderPosition = null;
        }
        return borderPosition;
    }
}

enum Border { left, right, bottom, top };

export interface ElementDimensions {
    left
    top
    height
    width
}
