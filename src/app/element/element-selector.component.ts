import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element, ElementCommands } from './element';
import { TextElement } from './text-element';
import {FontService} from '../font/font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {Font} from '../font/font'
import {TextContent} from '../content/text-content'
import {PageCommands} from '../page/page'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import { TemplateHelper} from '../template/template.helper'
import { TemplateStore } from '../template/template.store'
import { Template } from '../template/template'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'element-select',
    template: ` 
                <div class="toolbar" style="display: flex;" *ngIf="element"> 
                    <button md-icon-button (click)="deleteElement()"><md-icon>delete</md-icon></button>
                    <div class="toolbarCategory">
                    <span class="toolbarCategoryHint">obecné</span>
                    <button md-icon-button [mdMenuTriggerFor]="menu" mdTooltip="pozice a šířka">XY</button>
                    <my-md-menu #menu="mdMenu">
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.width"  (keyup)="0" placeholder="width">
                        </md-input-container>
                        <md-input-container>
                            <input  mdInput [(ngModel)]="element.height"  (keyup)="0"placeholder="height">
                        </md-input-container>
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.positionX"   (keyup)="0" placeholder="X">
                        </md-input-container>
                        <md-input-container>
                            <input mdInput [(ngModel)]="element.positionY"   (keyup)="0" placeholder="Y">
                        </md-input-container>
                    </my-md-menu>
                    <button md-icon-button [mdMenuTriggerFor]="opacity" mdTooltip="průhlednost"><md-icon>opacity</md-icon></button>
                    <button md-icon-button (onMenuOpen)="checkArrangement()" [mdMenuTriggerFor]="arangement" mdTooltip="pořadí">123</button>
                    <md-menu #arangement="mdMenu">
                      <button md-menu-item (click)="onBringForward()" [disabled]="last">
                        <span>Posunout dopředu</span>
                      </button>
                      <button md-menu-item (click)="onPushBack()" [disabled]="first">
                        <span>Posunout dozadu</span>
                      </button>
                    </md-menu>
                    <my-md-menu #opacity="mdMenu">
                        <md-slider style="margin:10px; width: 200px;" [thumbLabel]="true" [value]="this.element.opacity ? this.element.opacity : 100" (input)="onSliderChange($event)"></md-slider>
                    </my-md-menu>                   
                    <md-checkbox #backgroundCheckbox [checked]="element.background_color" (change)="toggleElementBackground(backgroundCheckbox.checked)" mdTooltip="zobrazit/skrýt pozadí"></md-checkbox>
                    <button *ngIf="element.background_color" style="background: none; border:none;" [colorPicker]="getBgColor()" mdTooltip="barva pozadí" (colorPickerChange)="changeBackgroundColor($event)"><button md-icon-button><md-icon [style.color]="getBgColor()">format_color_fill</md-icon></button></button>
                    </div>
                    <div class="toolbarCategory" *ngIf="element.type == 'text_element' && element.content.editor">
                        <span class="toolbarCategoryHint">text</span>
                        <text-select></text-select>
                    </div>
                    <div class="toolbarCategory" *ngIf="element.type == 'table_element' && element.clientState == 3 && element.selectedCells?.length > 0">
                        <span class="toolbarCategoryHint">vybrané buňky</span> 
                        <cell-edit-toolbar></cell-edit-toolbar>
                    </div>                                              
                </div>
             `,
    providers: [],
    styles: [`
        .toolbarCategory{
            position: relative; margin-left: 20px; border-bottom: 1px solid #bdbdbd;
        }
        .toolbarCategoryHint{
            position: absolute; z-index:1000; top: 42px; font-size: 10px; width: 100%; text-align: center; color: #bdbdbd;
        }


    `]
})

export class ElementSelectorComponent  {
    
    element: Element
    template: Template
    first: boolean
    last: boolean 

    constructor(private elementStore: ElementStore,  private commands: ElementCommands, private pageCommands: PageCommands, private templateStore: TemplateStore){
        this.elementStore.element.subscribe(element=> this.element = element)
        this.templateStore.template.subscribe(template => this.template = template)
    }

    private getBgColor(){
        let color = this.element.background_color
        if(color){
            return color
        }else{
            return Element.defaultBackgroundColor
        }
    }

    deleteElement(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        this.pageCommands.RemoveElement(page,this.element)
        this.elementStore.changeElement(null)
    }

    changeBackgroundColor(color: string){
        this.commands.changeBackgroundColor(this.element,color)
    }

    toggleElementBackground(value: boolean){
        this.commands.toggleElementBackground(this.element,value)
    }

    onSliderChange(event){
        this.commands.startChangingOpacity(this.element,event.value)
    }

    onBringForward(){
        this.pageCommands.bringElementForward(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    onPushBack(){
        this.pageCommands.pushElementBack(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    isElementLast(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == page.elements.length - 1
    }

    isElementFirst(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == 0
    }

    checkArrangement(){
        this.first = this.isElementFirst()
        this.last = this.isElementLast()
    }


    onKey(){
        
    }
    
}