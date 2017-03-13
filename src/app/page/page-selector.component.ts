import { Component, OnInit} from '@angular/core';
import { Image} from '../image/image';
import { Element } from '../element/element';
import { ElementSelector} from '../element/element-selector';
import {PageSelector} from './page-selector'
import {Page} from './page'
import {TextContent} from '../content/text-content'
import {ImageContent} from '../content/image-content'
import {TableContent} from '../content/table-content'
import {ImageElement} from '../element/image-element'
import {TextElement} from '../element/text-element'
import {TableElement} from '../element/table-element'
import {TemplateInstanceStore} from '../template-instance/template-instance.store'
import {Guide} from '../guide/guide'
import {FrameElement} from '../element/frame-element'
import {ImageSelector} from '../image/image-selector'
import {MdDialog, MdDialogRef} from '@angular/material'
import {ImageSelectorComponent} from '../image/image-selector.component'
import {CreateTableModal} from '../element/create-table-element.modal'

@Component({
    selector: 'page-select',
    template: `
                <span *ngIf="page">\n\
                    <md-grid-list cols="2">                    
                        <md-grid-tile (click)="createNewTextElement()">text</md-grid-tile>
                        <md-grid-tile (click)="createNewFrameElement()">rámeček</md-grid-tile>
                        <md-grid-tile (click)="createNewTableElement()">tabulka</md-grid-tile>\n\
                    </md-grid-list>
                </span>
             `,
    providers: [],
    styles: [`md-grid-tile {background: whitesmoke;}`]
})

export class PageSelectorComponent {
        
    page: Page
    imagesOpened: boolean
    dialogRef: MdDialogRef<ImageSelectorComponent>

    constructor(private pageSelector: PageSelector,  private imageSelector: ImageSelector,  public dialog: MdDialog){
        this.pageSelector.page.subscribe(page => this.page = page)   
    }

    openDialog() {
        this.dialogRef = this.dialog.open(ImageSelectorComponent, {
          disableClose: false,
          width: "80%",
          height: "80%"
        });       
    }
    
    createNewTextElement(){
        this.pageSelector.createNewTextElement()
    }
    
    createNewFrameElement(){
        this.pageSelector.createNewFrameElement()
    }
    
    onAddImageButtonClick(){
        this.imageSelector.openSelectorWindow()
        this.openDialog()
        let sub = this.imageSelector.selectorWindowOpened.take(1).subscribe() 
        this.imageSelector.image.takeWhile(image => !sub.closed).subscribe((image) => this.pageSelector.createNewImageElement(image))
    }
        
    createNewTableElement(){
        let dialogRef = this.dialog.open(CreateTableModal, {disableClose: false})
        dialogRef.afterClosed().subscribe(val =>{
            if(val && val.rows && val.columns && val.rowHeight && val.columnWidth){
                this.pageSelector.createNewTableElement(val.columns,val.rows,val.columnWidth,val.rowHeight)
            }
        })
    }
    
    createNewRulerX(){
        this.pageSelector.createNewRulerX()
    }
    
    createNewRulerY(){
        this.pageSelector.createNewRulerY()
    }
    
    onDeleteClicked(){
        this.pageSelector.deletePage()
    }
 
    
}