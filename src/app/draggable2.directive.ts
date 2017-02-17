import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit, Input} from '@angular/core';

@Directive({
    selector: '[draggable2]'
})

export class Draggable2 implements OnInit {

    mousedrag;
    enabled: boolean = true;
    running: boolean = false;
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseover = new EventEmitter();
    position: any = {left: 0, top: 0}

    @Input('borderCheck')
    borderCheck: boolean = true
    
    @Input('propagate')
    propagate: boolean = true
   
    @Output()
    move = new EventEmitter<ElementDimensions>()
  
    borderClick;
    
   
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
        this.mouseup.emit(event);
        this.enabled = true
        this.running = false
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        if (this.enabled){     
            this.mousedown.emit(event)
            this.running = true
        }
        return this.propagate
    }

    @HostListener('mousemove', ['$event'])
    onMouseover(event: MouseEvent) {
        if (this.enabled && !this.running) {
            this.mouseover.emit(event);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event) {
        if (this.enabled){
            this.mousemove.emit(event);
        }
    }

    constructor(public element: ElementRef) {
        this.mousedrag = this.mousedown.map((event: MouseEvent) => {
            var border
            if (this.borderCheck){
                //border = this.detectBorderPosition({left: event.offsetX, top: event.offsetY})
            }
            if(border){
                //this.enabled = false;
            }
            this.position = { left: event.clientX, top: event.clientY}
            return {
                left: event.clientX ,
                top: event.clientY
            };
        })
        .flatMap(imageOffset => this.mousemove.map((pos: MouseEvent) => {
            return {
                top: pos.clientY,
                left: pos.clientX
            }
        })
        .takeUntil(this.mouseup));
    }

    ngOnInit() {
        this.mousedrag.subscribe({
            next: pos => {
                var dimensions: ElementDimensions = new ElementDimensions();
                dimensions.left = pos.left - this.position.left
                dimensions.top =  pos.top - this.position.top 
                this.move.emit(dimensions)
                this.position = pos
            }
        });       
    }
    
    styleToNum(style){
        return Number(style.substring(0, style.length - 2));
    }

    getHeight() {
        return this.element.nativeElement.clientHeight
        //return this.styleToNum(this.element.nativeElement.parentElement.style.height)
        //eturn this.element.nativeElement.scrollHeight;
    }

    getWidth() {
        return this.element.nativeElement.clientWidth
        //return this.styleToNum(this.element.nativeElement.parentElement.style.width)
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
        var range = 10
        var fromLeft = pos.left;
        var fromTop = pos.top;
        var fromRight = this.getWidth() - pos.left;
        var fromBottom = this.getHeight() - pos.top;
        if (fromLeft < range) {
            borderPosition = Border.left;
        } else if (fromTop < range) {
            borderPosition = Border.top;
        } else if (fromRight < range) {
            borderPosition = Border.right;
        } else if (fromBottom < range) {
            borderPosition = Border.bottom;
        } else {
            borderPosition = null;
        }
        return borderPosition;
    }
}

enum Border { left, right, bottom, top };

export class ElementDimensions {
    left: number
    top: number
    height: number
    width: number
}
