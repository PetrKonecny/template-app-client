import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit, ContentChild} from '@angular/core';

@Directive({
    selector: '[resizable]'
})

export class Resizable implements OnInit {

    mousedrag;
    enabled: boolean = true;
    running: boolean = false;
    border: Border
    position: any = {left: 0, top: 0}
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove = new EventEmitter();
    mouseover = new EventEmitter();
    
    @Output()
    resize = new EventEmitter<ElementDimensions>()
  
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {    
        this.mouseup.emit(event)
        this.enabled = true
        this.running = false
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        if (this.enabled){
            this.mousedown.emit(event)
            this.running = true
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseover(event: MouseEvent) {
        if (this.enabled && !this.running) {
            this.mouseover.emit(event)
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
            if(!this.border){
                this.enabled = false
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
                if (this.border <= 1 ){
                    dimensions.width = pos.left - this.position.left
                }else{
                    dimensions.height = pos.top - this.position.top
                }
                if(this.border){
                    this.resize.emit(dimensions)
                }
                this.position = pos
                }
        });
        
        this.mouseover.subscribe({next: (event: MouseEvent) => {
                this.border = this.detectBorderPosition({ left: event.offsetX, top: event.offsetY });
            if (!this.border ) {
                this.element.nativeElement.style.cursor = 'pointer';
            }
            else if (this.border <= 1) {
                this.element.nativeElement.style.cursor = 'e-resize';
            } else {
                this.element.nativeElement.style.cursor = 'n-resize';
            }  
        }});
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
        //return this.element.nativeElement.offsetLeft
        return this.styleToNum(this.element.nativeElement.parentElement.style.left);
    }
    
    getTop() {
        //return this.element.nativeElement.offsetTop
        return this.styleToNum(this.element.nativeElement.parentElement.style.top);
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

export class ElementDimensions {
    left
    top
    height
    width
}
