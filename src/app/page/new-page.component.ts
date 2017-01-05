import { Component, Input, HostListener, OnInit} from '@angular/core';
import { Page} from './page';
import { PageService} from './page.service'
import { Guide } from '../guide/guide'
import {PageSelector} from '../page/page-selector'


@Component({
    selector: 'create-new-page',
    template: `
          <h3>New Page</h3>
          <div class ="page" (click)="onPageClicked()">
            <create-new-element *ngFor="let element of page.elements" [element] = "element" ></create-new-element>
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
    providers: [PageService]
})

export class NewPageComponent implements OnInit {
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
    }
    
    @HostListener('mouseup', ['$event'])
    onMouseup(event) {
        this.guides = new Array
        this.newPage.guides = this.guides
        this.newPage.save()
        this.newPage.resetState()
    }

    guides: Array<Guide>
    
    @Input()
    page: Page  
    
    constructor(private newPage: PageService, private pageSelector: PageSelector) {
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
        this.newPage.page = this.page
        this.newPage.guides = this.guides      
    }
    
    onPageClicked(){
        this.pageSelector.selectPage(this.page)
    }

}