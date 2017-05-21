import {
  AfterContentInit,
  Attribute,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {MenuPositionX, MenuPositionY} from '@angular/material/menu/menu-positions';
import {MdMenuInvalidPositionX, MdMenuInvalidPositionY} from '@angular/material/menu/menu-errors';
import {MdMenuItem} from '@angular/material/menu/menu-item';
import {MdMenuPanel} from '@angular/material/menu/menu-panel';
import {Subscription} from 'rxjs/Subscription';
import {transformMenu, fadeInItems} from '@angular/material/menu/menu-animations';

@Component({
  selector: 'my-md-menu',
  host: {'role': 'menu'},
  template: `<template><div class="md-menu-panel" [ngClass]="_classList"
    [@transformMenu]="'showing'">
    <div class="md-menu-content" [@fadeInItems]="'showing'">
      <ng-content></ng-content>
    </div>
  </div></template>`,
  styles: [`.md-menu-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:hidden;-webkit-overflow-scrolling:touch;max-height:calc(100vh + 48px)}.md-menu-panel.md-menu-after.md-menu-below{transform-origin:left top}.md-menu-panel.md-menu-after.md-menu-above{transform-origin:left bottom}.md-menu-panel.md-menu-before.md-menu-below{transform-origin:right top}.md-menu-panel.md-menu-before.md-menu-above{transform-origin:right bottom}[dir=rtl] .md-menu-panel.md-menu-after.md-menu-below{transform-origin:right top}[dir=rtl] .md-menu-panel.md-menu-after.md-menu-above{transform-origin:right bottom}[dir=rtl] .md-menu-panel.md-menu-before.md-menu-below{transform-origin:left top}[dir=rtl] .md-menu-panel.md-menu-before.md-menu-above{transform-origin:left bottom}@media screen and (-ms-high-contrast:active){.md-menu-panel{outline:solid 1px}}.md-menu-content{padding-top:8px;padding-bottom:8px}[md-menu-item]{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:flex;flex-direction:row;align-items:center;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,"Helvetica Neue",sans-serif;text-align:start;text-decoration:none;position:relative}[md-menu-item][disabled]{cursor:default}[md-menu-item] md-icon{margin-right:16px}[dir=rtl] [md-menu-item] md-icon{margin-left:16px}button[md-menu-item]{width:100%}.md-menu-ripple{position:absolute;top:0;left:0;bottom:0;right:0}`],
  encapsulation: ViewEncapsulation.None,
  animations: [
    transformMenu,
    fadeInItems
  ],
  exportAs: 'mdMenu'
})

/*
Copy of the source code of md-menu changed in a way that it does not close when user clicks inside the menu
this behaviour was not supported by the default implementation and was necessary to implement
*/
export class MyMdMenu implements MdMenuPanel, OnDestroy {

  /** Subscription to tab events on the menu panel */
  /** Config object to be passed into the menu's ngClass */
  _classList: any = {};

  /** Position of the menu in the X axis. */
  positionX: MenuPositionX = 'after';

  /** Position of the menu in the Y axis. */
  positionY: MenuPositionY = 'below';

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @ContentChildren(MdMenuItem) items: QueryList<MdMenuItem>;
  @Input() overlapTrigger = true;

  constructor(@Attribute('x-position') posX: MenuPositionX,
              @Attribute('y-position') posY: MenuPositionY) {
    if (posX) { this._setPositionX(posX); }
    if (posY) { this._setPositionY(posY); }
    this.setPositionClasses(this.positionX, this.positionY);
  }

  ngOnDestroy() {
  }

  /**
   * This method takes classes set on the host md-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set classList(classes: string) {
    this._classList = classes.split(' ').reduce((obj: any, className: string) => {
      obj[className] = true;
      return obj;
    }, {});
    this.setPositionClasses(this.positionX, this.positionY);
  }

  /** Event emitted when the menu is closed. */
  @Output() close = new EventEmitter<void>();

  /**
   * Focus the first item in the menu. This method is used by the menu trigger
   * to focus the first item when the menu is opened by the ENTER key.
   */
  focusFirstItem() {
  }

  /**
   * This emits a close event to which the trigger is subscribed. When emitted, the
   * trigger will close the menu.
   */
  _emitCloseEvent(): void {
    this.close.emit();
  }

  private _setPositionX(pos: MenuPositionX): void {
    if ( pos !== 'before' && pos !== 'after') {
      throw new MdMenuInvalidPositionX();
    }
    this.positionX = pos;
  }

  private _setPositionY(pos: MenuPositionY): void {
    if ( pos !== 'above' && pos !== 'below') {
      throw new MdMenuInvalidPositionY();
    }
    this.positionY = pos;
  }

  /**
   * It's necessary to set position-based classes to ensure the menu panel animation
   * folds out from the correct direction.
   */
  setPositionClasses(posX: MenuPositionX, posY: MenuPositionY): void {
    this._classList['md-menu-before'] = posX == 'before';
    this._classList['md-menu-after'] = posX == 'after';
    this._classList['md-menu-above'] = posY == 'above';
    this._classList['md-menu-below'] = posY == 'below';
  }

}