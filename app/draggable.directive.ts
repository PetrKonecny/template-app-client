import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit, ContentChild} from '@angular/core';

@Directive({
    selector: '[draggable]'
})

export class Draggable implements OnInit {

    mousedrag;
    startElement: ElementDimensions;
    nearestViablePos: ElementDimensions;
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseover = new EventEmitter();
    
    @Output()
    resize = new EventEmitter<ElementDimensions>()
    @Output()
    move = new EventEmitter<ElementDimensions>()
    @Output()
    returnToValidPos = new EventEmitter<ElementDimensions>()
    borderClick;
    
   
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
        if (this.nearestViablePos != null) {
            this.returnToValidPos.emit(this.nearestViablePos)
            /*
            this.element.nativeElement.style.top = this.nearestViablePos.top + 'px';
            this.element.nativeElement.style.left = this.nearestViablePos.left + 'px';
            this.element.nativeElement.style.width = this.nearestViablePos.width + 'px';
            this.element.nativeElement.style.height = this.nearestViablePos.height + 'px';*/
        }
        this.mouseup.emit(event);

    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        console.log(event);
        this.mousedown.emit(event);
        //return false; // Call preventDefault() on the event
    }

    @HostListener('mousemove', ['$event'])
    onMouseover(event: MouseEvent) {
        this.mouseover.emit(event);
        //return false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event) {
        this.mousemove.emit(event);
    }

    constructor(public element: ElementRef) {
        this.mousedrag = this.mousedown.map((event: MouseEvent) => {
            this.borderClick = this.detectBorderPosition({ left: event.offsetX, top: event.offsetY });
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
                this.checkOutOfBounds();
                var dimensions = this.getStats();
                if (this.borderClick == null) {/*
                    this.element.nativeElement.style.top = this.startElement.top + pos.top + 'px';
                    this.element.nativeElement.style.left = this.startElement.left + pos.left + 'px';*/
                    dimensions.left += pos.left
                    dimensions.top += pos.top
                    this.move.emit(dimensions)
                } else if (this.borderClick == Border.right) {
                    //this.element.nativeElement.style.width = this.startElement.width + pos.left + 'px';
                    dimensions.width += pos.left
                    this.resize.emit(dimensions)
                } else if (this.borderClick == Border.bottom) {
                    dimensions.height += pos.top
                    this.resize.emit(dimensions)
                    //this.element.nativeElement.style.height = this.startElement.height + pos.top  + 'px';
                }
            }
        });
        
        this.mouseover.subscribe({next: (event: MouseEvent) => {
            var borderDetect = this.detectBorderPosition({ left: event.offsetX, top: event.offsetY });
            if (borderDetect == null) {
                this.element.nativeElement.style.cursor = 'pointer';
            } else if (borderDetect <= 1) {
                this.element.nativeElement.style.cursor = 'e-resize';
            } else {
                this.element.nativeElement.style.cursor = 'n-resize';
            }           
        }});
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
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

    checkOutOfBounds() {
        var left = this.getLeft();
        var top = this.getTop();
        var bottom = this.getTop() + this.getHeight();
        var right = this.getLeft() + this.getWidth();
        var width = this.getWidth();
        var height = this.getHeight();
        if (top < 0 || left < 0 || bottom > 1122 || right > 793) {
            if (this.startElement.width == width && this.startElement.height == height){
                if (top < 0) { top = 0 };
                if (left < 0) { left = 0 };
                if (bottom > 1122) { top = 1122 - this.getHeight() }
                if (right > 793) { left = 793 - this.getWidth() }
            }else{
                if(right > 793) { width = 793 - left}
                if(bottom > 1122) { height = 1122 - top}
            }
            this.nearestViablePos = { top: top, left: left, width: width, height: height};   
        } else {
            this.nearestViablePos = null;
        }
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
