import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit, Input} from '@angular/core';
import {AppComponentRef} from './app.ref'

@Directive({
    selector: '[draggable2]'
})

export class Draggable2 implements OnInit {

    mousedrag;
    mouseup = new EventEmitter();
    mousedown = new EventEmitter();
    mousemove
    position: any = {left: 0, top: 0}

    @Input('propagate')
    propagate: boolean = true
   
    @Output()
    move = new EventEmitter<ElementDimensions>()
      
   
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
        this.mouseup.emit(event);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.mousedown.emit(event)
    }

    constructor(public element: ElementRef, private ref: AppComponentRef) {
        this.mousedrag = this.mousedown.map((event: MouseEvent) => {
            this.position = { left: event.clientX, top: event.clientY}
            return {
                left: event.clientX ,
                top: event.clientY
            };
        })
        .flatMap(imageOffset => this.mousemove.map((pos: MouseEvent) => {
            pos.preventDefault()
            return {
                top: pos.clientY,
                left: pos.clientX
            }
        })
        .takeUntil(this.mouseup));
    }

    ngOnInit() {
        this.mousemove = this.ref.mouseMove
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
}

export class ElementDimensions {
    left: number
    top: number
    height: number
    width: number
}
