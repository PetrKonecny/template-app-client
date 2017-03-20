import { Component, Input, HostListener, OnInit, ElementRef, ViewChild, AfterViewInit, AfterViewChecked} from '@angular/core';
import { Page, PageCommands} from './page';
import { PageService} from './page.service'
import { Guide } from '../guide/guide'
import {PageSelector} from '../page/page-selector'
import {NewPageRemote} from './new-page.remote'
import {ImageElement} from '../element/image-element'

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
        let page = this.page
        let element = new ImageElement()
        let x = event.clientX - this.pageElementRef.nativeElement.getBoundingClientRect().left
        let y = event.clientY - this.pageElementRef.nativeElement.getBoundingClientRect().top
        element.width = 100
        element.height = 100
        element.positionX = x
        element.positionY = y
        element.image = image
        if(!this.page.elements){
            this.page.elements = new Array
        }
        this.commands.addElement(this.page,element)
    }

    constructor(private newPageRemote: NewPageRemote, private pageSelector: PageSelector,  private ref: ElementRef, private commands: PageCommands) {
        this.newPageRemote.component = this
        this.guides = new Array
        this.pageSelector.page.subscribe(page => {if(this.page == page){this.selected = true}else{this.selected = false}})
    }
    
    ngAfterViewInit(){
        setTimeout(_ => {
            this.page.rulers = new Array
            let ruler = new Guide
            ruler.positionX = 10
            let ruler2 = new Guide
            ruler2.positionY = 10
            let ruler3 = new Guide
            let ruler4 = new Guide
            ruler3.positionX = +this.pageElementRef.nativeElement.clientWidth -10
            ruler4.positionY = +this.pageElementRef.nativeElement.clientHeight -10
            this.page.rulers.push(ruler4)
            this.page.rulers.push(ruler3)
            this.page.rulers.push(ruler2)
            this.page.rulers.push(ruler)
        });        
    }
    
    onPageClicked(){
        this.pageSelector.selectPage(this.page)
    }

}