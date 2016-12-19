import { Component, Input, ViewChildren, QueryList, Injectable, HostListener, OnInit} from '@angular/core';
import { Element} from './element';
import { TextElement } from './text-element';
import { ImageElement } from './image-element';
import { TableElement, Row, Cell } from './table-element';
import { Page} from './page';
import { NewElementComponent } from './new-element.component';
import { TextContent } from './text-content'
import { ImageContent } from './image-content'
import { TemplateInstanceStore } from './template-instance.store'
import { TableContent} from './table-content'
import { NewPage} from './new-page'
import { Guide } from './guide'
import { DisplayGuideComponent } from './display-guide.component'
import { DisplayRulerComponent } from './display-ruler.component'
import { StepSelector, ArrayStepPush } from './step-selector'
import {PageSelector} from './page-selector'


@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>
          <div class ="page" (click)="onPageClicked()">
            <div class="grid">
                  <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>\n\
                  <display-guide *ngFor="let guide of guides" [guide] = "guide" ></display-guide>
                  <display-ruler *ngFor="let guide of page.rulers" [guide] = "guide" ></display-ruler>
            </div>
          </div>        
    `,
    styles:[`
        .grid {
            min-width: 100%;
            min-height: 100%;
        }
        .page {
            position: relative;
            width: 210mm;
            height: 297mm;
        }
    `],
    directives: [NewElementComponent, DisplayGuideComponent, DisplayRulerComponent],
    providers: [NewPage]
})

export class NewPageComponent implements OnInit {
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.newPage.mouseDown()
    }
    
    @HostListener('mouseup', ['$event'])
    onMouseup(event) {
        this.newPage.mouseUp()
    }

    guides: Array<Guide>
    
    @Input()
    page: Page  
    
    constructor(private templateInstanceStore: TemplateInstanceStore, private newPage: NewPage, private stepSelector: StepSelector, private pageSelector: PageSelector) {
        this.newPage.component = this
        this.guides = new Array      
    }
    
    ngOnInit(){
        this.page.rulers = new Array
        var ruler = new Guide
        ruler.positionX = 20
        this.page.rulers.push(ruler)
        var ruler2 = new Guide
        ruler2.positionY = 20
        this.page.rulers.push(ruler2)
    }
    
    onPageClicked(){
        this.pageSelector.selectPage(this.page)
    }

}