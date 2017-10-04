import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import { MdDialog } from '@angular/material'
import { Template, TemplateCommands} from './template';
import { Page} from '../page/page';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { SaveTemplateModal } from './save-template.modal'
import { UndoRedoService } from '../undo-redo.service'
import { PageService } from '../page/page.service'
import { PageFactory } from '../page/page.factory'
import { TemplateStore } from '../template/template.store'
import {MdSnackBar} from '@angular/material';
import {CreateTableModal} from '../element/create-table-element.modal' 
import {PageCommands} from '../page/page'
import {TextElementFactory, FrameElementFactory, TableElementFactory} from '../element/element.factory'
import {PageStore} from '../page/page.store'
import domtoimage from 'dom-to-image'
import { SaveTemplateInstanceModal} from '../template-instance/save-template-instance.modal'
import { TemplateInstance} from '../template-instance/template-instance';
import { Router} from '@angular/router'

@Component({
    selector: 'create-new-template',
    template: `
        <md-sidenav-container style="height: calc(100% - 64px);">

            <!-- side menu -->

            <md-sidenav opened="true" class="mat-elevation-z6 bg-dark" mode ="side" #sidenav style="width: 20%; display:flex; overflow: visible;">
                    <div style="display:flex; flex-direction:row; width: 100%;">
                        <div style="background: #673ab7; flex:1; width: 15%;">
                            <div class="side-switch" [class.switch-active]="sidenavState == 1" (click)="clickImages()"><md-icon>image</md-icon></div>
                            <div class="side-switch" [class.switch-active]="sidenavState == 0" (click)="clickElements()"><md-icon>web</md-icon></div>
                        </div>
                        <div style="flex: 5; width: 85%;">
                            <div class="sidenav" [class.sidenav-active]="sidenavState == 1" >
                            <album-index-sidenav  [hidden]="sidenavState != 1" (onCloseClicked)="sidenav.close()"></album-index-sidenav>
                            </div>
                            <div class="sidenav" [class.sidenav-active]="sidenavState == 0" >
                            <page-select  [hidden]="sidenavState != 0" (onCloseClicked)="sidenav.close()"></page-select>
                            </div>
                            
                        </div>
                    </div>
            </md-sidenav>

            <!-- main app toolbar -->

            <md-toolbar class="mat-elevation-z2" style="z-index: 30; position: relative;">
                <md-icon *ngIf="!sidenav.opened"  style="transform: scale(1.8,1.8); opacity:0.3; cursor: pointer;" (click)="sidenav.open()" mdTooltip="ukázat boční panel">chevron_right</md-icon>
                <button md-icon-button *ngIf="template && template.type!='no_instance_template'" [disabled]="disableSave" (click)="saveTemplate()" md-tooltip="uložit šablonu"><md-icon>save</md-icon></button>
                <button md-icon-button *ngIf="template && template.type == 'no_instance_template'" [disabled]="disableSave" (click)="saveDocument()" md-tooltip="uložit dokument"><md-icon>save</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getUndos().length" (click)="undo()" md-tooltip="vrátit akci zpět"><md-icon>undo</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getRedos().length" (click)="redo()" md-tooltip="zopakovat akci"><md-icon>redo</md-icon></button>
                <element-toolbar style="width: 100%;"></element-toolbar>
            </md-toolbar>       

            <!-- pages of the template -->

            <div class="pages">
            <span *ngFor="let page of template.pages" >
                <div class = "buttons" [style.width.mm] = "pageService.getPageWidth(page)">
                    <button md-icon-button mdTooltip="smazat stranu" (click)="onClickDelete(page)" [disabled]="template.pages.length < 2"><md-icon>delete</md-icon></button>
                    <button md-icon-button  mdTooltip="nová strana nad" (click)="onClickAddAbove(page)"><md-icon>keyboard_arrow_up</md-icon></button>
                    <button md-icon-button mdTooltip="nová strana pod" (click)="onClickAddBelow(page)"><md-icon>keyboard_arrow_down</md-icon></button>
                </div> 
                <create-new-page [page]="page"></create-new-page>
            </span>
            </div>
        </md-sidenav-container>
    `,
    styles: [`.leftPanel {
            position: relative;
            float: left;
            margin-top: 10px;
            width: 300px;
        }
        .pages{
            position: relative;
            overflow-y: auto;
            height: calc(100% - 64px);
            box-sizing: border-box;
            padding: 16px;
        }       
        .buttons{
            margin-left: auto;
            margin-right: auto;
            position: relative;
            display: flex;
            flex-direction: row-reverse;
        }

        md-tab-group{
            height: 100%;
        }
    `],
})

//component representing the editor
export class NewTemplateComponent  {

    @Input()
    //template that should be edited
    template: Template;

    @Input()
    templateInstance: TemplateInstance
 
    @Input()
    disableSave: boolean = false;

    page: Page;
    sidenavState: number = 0;
    
    /**
    @param templateStore - injects store containing current template
    @param dialog - injects service to create dialog
    @param undoService - injects udo/redo service
    @param pageFactory - injects factory thaat builds pages
    @param templateCommands - injects commands to manipulate template
    @param snackBar - injects service to display snackbars  
    */
    constructor(
        protected templateStore: TemplateStore,
        public dialog: MdDialog,
        protected undoService: UndoRedoService,
        protected pageFactory: PageFactory,
        protected pageService: PageService,
        protected templateCommands: TemplateCommands,
        protected snackBar: MdSnackBar,
        protected pageStore: PageStore,
        protected pageCommands: PageCommands,
        protected templateInstanceStore: TemplateInstanceStore,
        protected router: Router
    ){ 
        this.pageStore.page.subscribe(page => this.page = page)
    }
  
    //calls store to save the template     
    saveTemplate() {
        let dialogRef = this.dialog.open(SaveTemplateModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value == 'save'){
                    this.templateStore.saveTemplate().subscribe(template=>{
                        this.snackBar.open("Šablona úspěšně uložena",null,{duration: 1500})
                    },error=>{
                        this.snackBar.open("Chyba při ukládání šablony",null,{duration: 2500})
                    })
                }
            }
        )
        dialogRef.componentInstance.template = this.template
    }

    saveDocument() {
        let dialogRef = this.dialog.open(SaveTemplateInstanceModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value){
                    this.template.name = value.name
                    this.template.tagged = value.tagged
                    this.templateStore.saveTemplate().subscribe(template=>{
                        this.snackBar.open("Dokument úspěšně uložen",null,{duration: 1500})
                    },error=>{
                        this.snackBar.open("Chyba při ukládání dokumentu",null,{duration: 2500})
                    })
                }
            }
        )
        let instance = <any> this.template
        dialogRef.componentInstance.setTemplateInstance(instance)
    }

    //calls command to instert page above
    onClickAddAbove(page: Page){
        this.templateCommands.addPageAbove(this.template,page,this.pageFactory.build())
    }

    //calls command to insert page below
    onClickAddBelow(page: Page){
        this.templateCommands.addPageBelow(this.template,page,this.pageFactory.build())
    }

    //calls command to delete the page
    onClickDelete(page: Page){
        this.templateCommands.deletePage(this.template,page)
    }
   
    //calls undo in undo service
    undo(){
        this.undoService.undo()
    }

    //calls redo in redo service
    redo(){
        this.undoService.redo()
    }

    createNewTextElement(){
        let factory = new TextElementFactory
        this.pageCommands.addElement(this.page, factory.build())
    }
    
    //calls command to create new frame element
    createNewFrameElement(){
        let factory = new FrameElementFactory
        this.pageCommands.addElement(this.page, factory.build())
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
                this.pageCommands.addElement(this.page, factory.build())}
        })
    }

    clickImages(){
        this.sidenavState = 1
    }

    clickElements(){
        this.sidenavState = 0
    }

    //this has to bypass framework
    createSnapshot(){
        let firstPageDOM = document.getElementsByClassName("page")[0]
        console.log(domtoimage)
        console.log(firstPageDOM)
        domtoimage.toBlob(firstPageDOM)
        .then(function (blob) {
            (<any>window).saveAs(blob, 'test.jpg');
        });
    }
}