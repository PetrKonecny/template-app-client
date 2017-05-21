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
import {CreateTableModal} from '../element/create-table-element.modal' 
import {PageCommands} from './page'
import {TextElementFactory, FrameElementFactory, TableElementFactory} from '../element/element.factory'
import {PageStore} from '../page/page.store'

@Component({
    selector: 'page-select',
    template: `
                <span *ngIf="page">
                    <md-grid-list cols="2">                    
                        <md-grid-tile ><div (click)="createNewTextElement()">text</div></md-grid-tile>
                        <md-grid-tile ><div (click)="createNewFrameElement()">rámeček</div></md-grid-tile>
                        <md-grid-tile ><div (click)="createNewTableElement()">tabulka</div></md-grid-tile>
                    </md-grid-list>
                </span>
                <span style="width: 100%; height: 100%; display: flex; align-items: center; text-align: center;" *ngIf="!page">
                    <h3 *ngIf="!page" class="nothing-found">Vyberte kliknutím stránku šablony</h3>
                </span>
             `,
    providers: [],
    styles: [`div {background: whitesmoke; width: 90%; height: 90%; cursor: pointer; display: flex; align-items: center; justify-content: center; text-transform: uppercase; font-weight: bold;}`]
})
//elements displayed in the sidenav in the template editor
export class PageSelectorComponent {
        
    //page that te elements are inserted into
    page: Page

    /**
    @param pageStore - store containing selected page
    @param dialog - dialog service used to display dialogs
    @param commands - commands used to add the elements
    */
    constructor(private pageStore: PageStore,
                public dialog: MdDialog, 
                private commands: PageCommands,){
        this.pageStore.page.subscribe(page => this.page = page)   
    }
    
    //calls command to create new text element
    createNewTextElement(){
        let factory = new TextElementFactory
        this.commands.addElement(this.page, factory.build())
    }
    
    //calls command to create new frame element
    createNewFrameElement(){
        let factory = new FrameElementFactory
        this.commands.addElement(this.page, factory.build())
    }
           
    //calls command to create new table element
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