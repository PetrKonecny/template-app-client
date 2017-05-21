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

@Component({
    selector: 'create-new-template',
    template: `
        <md-sidenav-container style="height: 100%;">

            <!-- main app toolbar -->

            <md-toolbar>
                <button md-icon-button *ngIf="!sidenav.opened" (click)="sidenav.toggle()" md-tooltip="přidat prvek"><md-icon>add</md-icon></button>
                <button md-icon-button *ngIf="sidenav.opened" (click)="sidenav.toggle()" md-tooltip="zavřít boční menu"><md-icon>close</md-icon></button>
                <button md-icon-button (click)="saveTemplate()" md-tooltip="uložit šablonu"><md-icon>save</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getUndos().length" (click)="undo()" md-tooltip="vrátit akci zpět"><md-icon>undo</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getRedos().length" (click)="redo()" md-tooltip="zopakovat akci"><md-icon>redo</md-icon></button>
                <element-toolbar style="width: 100%;"></element-toolbar>
            </md-toolbar>

            <!-- side menu -->

            <md-sidenav mode ="side" #sidenav style="width: 20%;">
                <md-tab-group>
                    <md-tab label = "Prvky">                   
                        <page-select></page-select>
                    </md-tab>
                    <md-tab label = "Obrázky">
                        <album-index-sidenav></album-index-sidenav>
                    </md-tab>
                </md-tab-group>
            </md-sidenav>       

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
            overflow-y: scroll;
            height: 90%;
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
    
    /**
    @param templateStore - injects store containing current template
    @param dialog - injects service to create dialog
    @param undoService - injects udo/redo service
    @param pageFactory - injects factory thaat builds pages
    @param templateCommands - injects commands to manipulate template
    @param snackBar - injects service to display snackbars  
    */
    constructor(
        private templateStore: TemplateStore,
        public dialog: MdDialog,
        private undoService: UndoRedoService,
        private pageFactory: PageFactory,
        private pageService: PageService,
        private templateCommands: TemplateCommands,
        private snackBar: MdSnackBar
    ){ }
    
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
}