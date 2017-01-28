import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ImageService } from '../image/image.service';
import { Element } from './element';
import { TextElement } from './text-element';
import { ElementSelector} from './element-selector';
import {FontSelector} from '../font/font-selector';
import {FontService} from '../font/font.service';
import {ClientState, TableElement, Cell} from './table-element'
import {Font} from '../font/font'
import {TextContent} from '../content/text-content'
import {TextSelector} from '../editor/text-selector'

@Component({
    selector: 'element-select',
    template: ` 
                <span *ngIf="element"> 
                <button md-icon-button (click)="deleteElement()"><md-icon>delete</md-icon></button>
                <button md-button [mdMenuTriggerFor]="menu">Position</button>
                <my-md-menu #menu="mdMenu">
                    <md-input [(ngModel)]="element.width"  (keyup)="0" placeholder="width"></md-input>
                    <md-input [(ngModel)]="element.height"  (keyup)="0"placeholder="height"></md-input>
                    <md-input [(ngModel)]="element.positionX"   (keyup)="0" placeholder="X"></md-input>
                    <md-input [(ngModel)]="element.positionY"   (keyup)="0" placeholder="Y"></md-input>
                </my-md-menu>
                <button style="background: none; border:none;" [colorPicker]="getBgColor()"  (colorPickerChange)="changeBackgroundColor($event)"><button md-icon-button><md-icon [style.color]="getBgColor()">format_color_fill</md-icon></button></button>
                <text-select *ngIf="element.type == 'text_element' && element.content.editor"></text-select>
                <span *ngIf="element.type == 'table_element'"> 
                    <button md-button *ngIf="element.clientState != 2" (click)="editTable()">Edit table</button>
                    <button md-button *ngIf="element.clientState != 0" (click)="moveTable()">Move or resize table</button>
                    <button md-button *ngIf="element.clientState != 1" (click)="filloutTable()">Fillout table</button>
                    <button md-button *ngIf="element.clientState != 3" (click)="editCells()">Edit cells</button>
                    <cell-edit-toolbar *ngIf="element.clientState == 3 && element.selectedCells?.length > 0">                        
                    </cell-edit-toolbar>
                    <div *ngIf="element.clientState == 2"  >
                        <button (click)="distributeRows()">Distribute rows</button>
                        <button (click)="distributeColumns()">Distribute columns</button>
                    </div>
                </span>
                </span>
             `,
    providers: [],
})

export class ElementSelectorComponent  {
    
    element: Element 

    constructor(private elementSelector: ElementSelector, private textSelector: TextSelector){
        this.elementSelector.element.subscribe(element=> {
            this.element = element
            if(this.element && this.element.content && this.element.content.type == 'text_content' && (<TextContent>this.element.content).editor){
                this.textSelector.changeEditor((<TextContent>this.element.content).editor)
            }
        })
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
        this.elementSelector.deleteElement();
    }

    changeBackgroundColor(color: string){
        this.elementSelector.changeBackgroundColor(color)
    }

    editTable(){
        this.elementSelector.setElementClientState(ClientState.editTable)
    }
    
    moveTable(){
        this.elementSelector.setElementClientState(ClientState.moveResize)
    }
    
    filloutTable(){
        this.elementSelector.setElementClientState(ClientState.fillOut)
    }
    
    editCells(){
        this.elementSelector.setElementClientState(ClientState.editCells)
    }
     
    onKey(){
        
    }
    
}