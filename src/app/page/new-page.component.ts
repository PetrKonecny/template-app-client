import { Component, Input, HostListener, OnInit, ElementRef, ViewChild, AfterViewInit, AfterViewChecked} from '@angular/core';
import { Page, PageCommands} from './page';
import { PageService} from './page.service'
import { Guide } from '../guide/guide'
import {NewPageRemote} from './new-page.remote'
import {ImageElement} from '../element/image-element'
import {PageStore} from '../page/page.store'
import {ImageElementFactory} from '../element/element.factory'

@Component({
    selector: 'create-new-page',
    template: `            
          <div class ="page" #pageRef [style.width.mm]="getPageWidth()" [style.height.mm]="getPageHeight()" [class.selected]="selected" (drop)="onDrop($event)" (dragover)="onDragOver()"  (click)="onPageClicked()">             
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
            margin-left: auto;
            margin-right: auto;
            margin-top: 5px;
        }       
    `],
    providers: [NewPageRemote]
})

//displays page in the template editor
export class NewPageComponent implements AfterViewInit {

    //temporary guides displayed in the page 
    guides: Array<Guide>

    @Input()
    //displazed page
    page: Page  

    @ViewChild('pageRef')
    //reference to the div representing the page
    pageElementRef: ElementRef
 
     //whether the page is selected or not
    selected: boolean = false
     
    @HostListener('mouseup', ['$event'])
    //resets the guides on mouse up
    onMouseup(event) {
        this.guides = new Array
    }

    /**
    @param newPageRemote - reference to this component
    @param pageStore - store containing selected page
    @param commands - commands used for adding elements
    */
    constructor(private newPageRemote: NewPageRemote, private pageStore: PageStore, private commands: PageCommands) {
        this.newPageRemote.component = this
        this.guides = new Array
        this.pageStore.page.subscribe(page => {if(this.page == page){this.selected = true}else{this.selected = false}})
    }

    //prevents default behaviour on drag over
    onDragOver(){
        return false
    }

    //gets page width
    getPageWidth(){
        if(this.page.width){
            return this.page.width
        }else{
            return Page.defaultWidth
        }
    }

    //gets page height
    getPageHeight(){
        if(this.page.height){
            return this.page.height
        }else{
            return Page.defaultHeight
        }
    }

    /**is triggered when something that can be dragged is dropped on the page
    @param event - event fired on drop
    */
    onDrop(event){
        let data = event.dataTransfer.getData("text");
        let image
        try{
            image = JSON.parse(data)
        }catch(e){
            return;
        }
        let x = event.clientX - this.pageElementRef.nativeElement.getBoundingClientRect().left
        let y = event.clientY - this.pageElementRef.nativeElement.getBoundingClientRect().top
        let factory = new ImageElementFactory()
        factory.setPositionX(x).setPositionY(y).setWidth(null).setHeight(null).setImage(image)
        this.commands.addElement(this.page,factory.build())
        event.preventDefault()
    }
    
    //sets page borders when the page is created
    ngAfterViewInit(){
        setTimeout(_ => {
            let margin = 0
            let width = this.pageElementRef.nativeElement.clientWidth
            let height = this.pageElementRef.nativeElement.clientHeight
            let minDim = Math.min(width,height) 
            if(minDim > margin*2){
                margin = this.page.margin
            }
            this.page.rulers = new Array
            let ruler = new Guide
            ruler.positionX = margin
            let ruler2 = new Guide
            ruler2.positionY = this.page.margin
            let ruler3 = new Guide
            let ruler4 = new Guide
            ruler3.positionX = + width - margin
            ruler4.positionY = + height - margin
            this.page.rulers.push(ruler4)
            this.page.rulers.push(ruler3)
            this.page.rulers.push(ruler2)
            this.page.rulers.push(ruler)
        });        
    }
    
    //triggered when page is clicked, selects the page
    onPageClicked(){
        this.pageStore.selectPage(this.page)
    }

}