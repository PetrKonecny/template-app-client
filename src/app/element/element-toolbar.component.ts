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
import { ElementHelper } from '../element/element.helper'
import { TemplateStore } from '../template/template.store'
import { Template } from '../template/template'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'element-toolbar',
    template: ` 
                <!-- displays whole toolbar -->

                <div class="toolbar" style="display: flex;" *ngIf="element"> 
                   
                    <button md-icon-button (click)="deleteElement()" md-tooltip="smazat prvek"><md-icon>delete</md-icon></button>
                    
                    <!-- displays general toolbar for all elements -->

                    <div class="toolbarCategory">

                        <!-- displays controls to change dimensions -->

                        <button md-icon-button [mdMenuTriggerFor]="menu" mdTooltip="pozice a šířka">XY</button>
                        <md-menu #menu="mdMenu">
                            <position-form (click)="$event.stopPropagation()" [dimensions]="getDimensions()" (onSubmit)="onPositionMenuConfirmed($event)"></position-form>
                        </md-menu>

                        <!-- displays controls to change opacity -->

                        <button md-icon-button [mdMenuTriggerFor]="opacity" mdTooltip="průhlednost"><md-icon>opacity</md-icon></button>
                        <md-menu #opacity="mdMenu">
                            <md-slider (click)="$event.stopPropagation()"  style="margin:10px; width: 200px;" [thumbLabel]="true" [value]="this.element.opacity ? this.element.opacity : 100" (input)="onSliderChange($event)"></md-slider>
                        </md-menu>

                        <!-- displays controls to change order of elements -->

                        <button md-icon-button (onMenuOpen)="checkArrangement()" [mdMenuTriggerFor]="arangement" mdTooltip="pořadí">123</button>
                        <md-menu #arangement="mdMenu">
                          <button md-menu-item (click)="onBringForward()" [disabled]="last">
                            <span>Posunout dopředu</span>
                          </button>
                          <button md-menu-item (click)="onPushBack()" [disabled]="first">
                            <span>Posunout dozadu</span>
                          </button>
                        </md-menu> 

                        <!-- displays controls to change color of the background --> 

                        <button md-icon-button mdTooltip="Barva pozadí" [mdMenuTriggerFor]="backgroundColorMenu"><md-icon  [style.color]="element.background_color">fiber_manual_record</md-icon></button>
                        <md-menu #backgroundColorMenu>
                            <div (click)="$event.stopPropagation()">
                                <div md-menu-item [colorPicker]="element.background_color ? element.background_color : lastColor" style="width: 230px; height: 290px; padding: 0 !important;" [cpOutputFormat]="hex" (colorPickerChange)="changeBackgroundColor($event)" [cpToggle]="true" [cpDialogDisplay]="'inline'" [cpAlphaChannel]="'disabled'">
                                </div>
                            </div>
                            <div (click)="$event.stopPropagation()" md-menu-item style="overflow: hidden;">
                                Zobrazit/skrýt pozadí <md-checkbox #bgCheckbox [checked]="element.background_color" (change)="toggleElementBackground(bgCheckbox.checked)" style="position: relative; z-index: 1000; padding-left: 16px"></md-checkbox>
                            </div>
                        </md-menu>

                    </div>

                    <!-- displays specialized toolbar for text elements -->

                    <div class="toolbarCategory" *ngIf="element.type == 'text_element' && element.content.editor">
                        <editor-toolbar></editor-toolbar>
                    </div>

                    <!-- displays specialized toolbar for table elements -->

                    <div class="toolbarCategory" *ngIf="element.type == 'table_element' && element.clientState == 3 && element.selectedCells?.length > 0">
                        <cell-edit-toolbar></cell-edit-toolbar>
                    </div>                                              
                </div>
             `,
    providers: [],
    styles: [`
        .toolbarCategory{
            position: relative; margin-left: 20px; border-left: 1px solid #bdbdbd; padding-left: 12px;
        }
        .toolbarCategoryHint{
            position: absolute; z-index:1000; top: 42px; font-size: 10px; width: 100%; text-align: center; color: #bdbdbd;
        }


    `]
})

/**Displays main element toolbar with controlls same for every component
toolbar provides generic controlls such as resizing and repositioning for every selected element
**/
export class ElementToolbarComponent  {
    
    //element that is selected    
    element: Element
    //template that the editor is working with
    template: Template
    
    //true if selected element is first in the template
    first: boolean

    //true if selected element is last in template
    last: boolean

    //last color set in editor as the background, defaults to default color
    lastColor = Element.defaultBackgroundColor

    /***
    @param 'elementStore' - injects store containing selected element provided by editor component
    @param 'commands' - injects commands to manipulate element state
    @param 'pageCommands' - injects commands to manipulate page state
    @param 'templateStore' - injects store containing template currently loaded into the editor
    ***/
    constructor(private elementStore: ElementStore,  private commands: ElementCommands, private pageCommands: PageCommands, private templateStore: TemplateStore){
        this.elementStore.element.subscribe(element=> this.element = element)
        this.templateStore.template.subscribe(template => this.template = template)
    }


    //shorthand to get background color
    private getBgColor(){
        let color = this.element.background_color
        if(color){
            return color
        }else{
            return Element.defaultBackgroundColor
        }
    }

    //shorthand to get dimensions
    getDimensions(){
        return ElementHelper.getDimensions(this.element)
    }

    //calls command to delete the element and deselects 
    deleteElement(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        this.pageCommands.RemoveElement(page,this.element)
        this.elementStore.changeElement(null)
    }

    /***changes background color of the element
    @param 'color' - css value to be set as color
    ***/
    changeBackgroundColor(color: string){
        this.lastColor = color
        if(this.element.background_color){
            this.commands.changeBackgroundColor(this.element, this.lastColor)
        }
    }
    /** toggles display of elements background 
    **/
    toggleElementBackground(){
        if(this.element.background_color){
            this.commands.changeBackgroundColor(this.element, null)
        }else{
            this.commands.changeBackgroundColor(this.element, this.lastColor)
        }
    }

    /**changes elements opacity if opacity slider is moved
    @param 'event' - event fired if slider is moved
    **/
    onSliderChange(event){
        this.commands.startChangingOpacity(this.element,event.value)
    }

    //brings element forward in the displayed page
    onBringForward(){
        this.pageCommands.bringElementForward(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    //pushes element back in displayed page
    onPushBack(){
        this.pageCommands.pushElementBack(TemplateHelper.getPageFromTemplateForElement(this.element, this.template),this.element)
        this.checkArrangement()
    }

    /**sets element dimensions
    @param 'dimensions' - dimensions to be set
    **/
    onPositionMenuConfirmed(dimensions){
        this.commands.setElementDimensions(this.element, dimensions)
    }

    /**checks if the element is last in the pages and therefore cannot be pushed further back
    @return - true if element is last false otherwise
    **/
    isElementLast(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == page.elements.length - 1
    }

    /**checks if the element is first in the pages and therefore cannot be brought forwared
    @return - true if element is first false otherwise
    **/
    isElementFirst(){
        let page = TemplateHelper.getPageFromTemplateForElement(this.element, this.template)
        return page.elements.indexOf(this.element) == 0
    }

    /**
    after arrangement is changed refreshes the values
    **/
    checkArrangement(){
        this.first = this.isElementFirst()
        this.last = this.isElementLast()
    }

    //empty function used to trigger change detection
    onKey(){
        
    }
    
}