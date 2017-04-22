import { Component, OnInit} from '@angular/core';
import { Image} from '../image/image';
import { Element } from '../element/element';
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
import {MdDialog, MdDialogRef} from '@angular/material'
import {ImageSelectorComponent} from '../image/image-selector.component'
import {CreateTableModal} from '../element/create-table-element.modal' 
import {PageCommands} from './page'
import {TextElementFactory, FrameElementFactory, TableElementFactory} from '../element/element.factory'
import {PageStore} from '../page/page.store'

@Component({
    selector: 'page-select',
    template: `
                <span *ngIf="page">
                    <md-grid-list cols="2">                    
                        <md-grid-tile (click)="createNewTextElement()">text</md-grid-tile>
                        <md-grid-tile (click)="createNewFrameElement()">rámeček</md-grid-tile>
                        <md-grid-tile (click)="createNewTableElement()">tabulka</md-grid-tile>
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

    constructor(private pageStore: PageStore,
                public dialog: MdDialog, 
                private commands: PageCommands,){
        this.pageStore.page.subscribe(page => this.page = page)   
    }
    
    createNewTextElement(){
        let factory = new TextElementFactory
        this.commands.addElement(this.page, factory.build())
    }
    
    createNewFrameElement(){
        let factory = new FrameElementFactory
        this.commands.addElement(this.page, factory.build())
    }
           
    createNewTableElement(){
        let dialogRef = this.dialog.open(CreateTableModal, {height: 'auto',
          width: '30%',})
        dialogRef.afterClosed().subscribe(val =>{
            if(val && val.rows && val.columns && val.rowHeight && val.columnWidth){
                let factory = new TableElementFactory
                factory.setColumnCount(val.columns)
                factory.setRowCount(val.rows)
                factory.setColumnWidth(val.columnWidth)
                factory.setRowHeight(val.rowHeight)
                this.commands.addElement(this.page, factory.build())}
        })
    }    
}