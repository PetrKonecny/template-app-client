import { Component, Input, HostListener, OnInit,KeyValueDiffers, KeyValueDiffer, DoCheck, ElementRef} from '@angular/core';
import { Page} from './page';
import { PageService} from './page.service'
import { Guide } from '../guide/guide'
import {PageSelector} from '../page/page-selector'
import {NewPageRemote} from './new-page.remote'
import {StateChangeRespond, StepSelector} from '../step-selector'
import {ImageElement} from '../element/image-element'

@Component({
    selector: 'create-new-page',
    template: `
          <div class ="page" [class.selected]="selected" (drop)="onDrop($event)" (dragover)="onDragOver()"  (click)="onPageClicked()">
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
            background-color: white;
            width: 210mm;
            height: 297mm;
        }       
    `],
    providers: [NewPageRemote]
})

export class NewPageComponent implements OnInit, DoCheck, StateChangeRespond {
    
    @HostListener('mousedown', ['$event'])
    onMousedown(event) {
        this.newPageRemote.onMouseDown()
    }
    
    @HostListener('mouseup', ['$event'])
    onMouseup(event) {
        this.guides = new Array
        this.newPageRemote.onMouseUp()
    }

    onDragOver(){
        return false
    }

    selected: boolean = false

    onDrop(event){
        console.log('drop2')
        let data = event.dataTransfer.getData("text");
        let image = JSON.parse(data)
        let page = this.page
        let element = new ImageElement()
        let x = event.clientX - this.ref.nativeElement.getBoundingClientRect().left
        let y = event.clientY - this.ref.nativeElement.getBoundingClientRect().top
        element.width = 100
        element.height = 100
        element.positionX = x
        element.positionY = y
        element.image = image
        this.page.elements.push(element)
    }

    guides: Array<Guide>
        differ: KeyValueDiffer;

    @Input()
    page: Page  

    continuousChangeRunning: boolean  = false
    
    ngDoCheck(){
        var changes = this.differ.diff(this.page);
        if(changes) {
            this.stateService.respond(changes,this)           
        }        
    }

    constructor(private newPageRemote: NewPageRemote, private pageSelector: PageSelector,  private differs: KeyValueDiffers, private stateService: StepSelector, private ref: ElementRef) {
        this.newPageRemote.component = this
        this.guides = new Array
        this.differ = differs.find({}).create(null);
        this.pageSelector.page.subscribe(page => {if(this.page == page){this.selected = true}else{this.selected = false}})
    }

    getSubject(){
        return this.page
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