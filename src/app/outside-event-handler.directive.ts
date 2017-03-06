import {Directive, HostListener, EventEmitter, Output, ElementRef, OnInit, Input, NgZone} from '@angular/core';

@Directive({
  selector: '[outSideEventHandler]'
})
export class OutSideEventHandlerDirective {
  
  @Input() event: string = 'mousemove';
  @Output('outSideEventHandler') emitter = new EventEmitter();
  private _handler: Function;
  constructor(private _ngZone: NgZone, private el: ElementRef) {}
  
  ngOnInit() {
    this._ngZone.runOutsideAngular(() => {
      const nativeElement = this.el.nativeElement;
      this._handler = $event => {
        this.emitter.emit($event);
      }
      
      
      nativeElement.addEventListener(this.event, this._handler, false);
    });
  }
  
  ngOnDestory() {
    this.el.nativeElement.removeEventListener(this.event, this._handler);
  }
}