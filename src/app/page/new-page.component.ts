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

export class NewPageComponent implements AfterViewInit {


    guides: Array<Guide>

    @Input()
    page: Page  

    @ViewChild('pageRef')
    pageElementRef: ElementRef
 
    selected: boolean = false
     
    @HostListener('mouseup', ['$event'])
    onMouseup(event) {
        this.guides = new Array
    }

    constructor(private newPageRemote: NewPageRemote, private pageStore: PageStore, private commands: PageCommands) {
        this.newPageRemote.component = this
        this.guides = new Array
        this.pageStore.page.subscribe(page => {if(this.page == page){this.selected = true}else{this.selected = false}})
    }

    onDragOver(){
        return false
    }

    getPageWidth(){
        if(this.page.width){
            return this.page.width
        }else{
            return Page.defaultWidth
        }
    }

    getPageHeight(){
        if(this.page.height){
            return this.page.height
        }else{
            return Page.defaultHeight
        }
    }

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
    
    ngAfterViewInit(){
        setTimeout(_ => {
            this.page.rulers = new Array
            let ruler = new Guide
            ruler.positionX = 0
            let ruler2 = new Guide
            ruler2.positionY = 0
            let ruler3 = new Guide
            let ruler4 = new Guide
            ruler3.positionX = +this.pageElementRef.nativeElement.clientWidth -0
            ruler4.positionY = +this.pageElementRef.nativeElement.clientHeight -0
            this.page.rulers.push(ruler4)
            this.page.rulers.push(ruler3)
            this.page.rulers.push(ruler2)
            this.page.rulers.push(ruler)
        });        
    }
    
    onPageClicked(){
        this.pageStore.selectPage(this.page)
    }

}