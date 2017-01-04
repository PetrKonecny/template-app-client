import { Component, Input, HostListener, OnInit} from '@angular/core';
import { Page} from './page';
import { NewPage} from './new-page'
import { Guide } from '../guide/guide'
import {PageSelector} from '../page/page-selector'


@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>
          <div class ="page" (click)="onPageClicked()">
            <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>\n\
            <display-guide *ngFor="let guide of guides" [guide] = "guide" ></display-guide>
            <display-ruler *ngFor="let guide of page.rulers" [guide] = "guide" ></display-ruler>
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
    
    constructor(private newPage: NewPage, private pageSelector: PageSelector) {
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