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

@Component({
    selector: 'create-new-template',
    template: `
        <md-sidenav-container style="height: 100%;">
            <md-toolbar>
                <button md-icon-button *ngIf="!sidenav.opened" (click)="sidenav.toggle()"><md-icon>add</md-icon></button>
                <button md-icon-button *ngIf="sidenav.opened" (click)="sidenav.toggle()"><md-icon>close</md-icon></button>
                <button md-icon-button (click)="saveTemplate()"><md-icon>save</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getUndos().length" (click)="undo()"><md-icon>undo</md-icon></button>
                <button md-icon-button [disabled]="!undoService.getRedos().length" ><md-icon>redo</md-icon></button>
                <element-select style="width: 100%;"></element-select>
            </md-toolbar>
            <md-sidenav mode ="side" #sidenav style="width: 20%;">
                <md-tab-group>
                    <md-tab label = "Elements">                   
                        <page-select></page-select>
                        <ruler-select></ruler-select>
                    </md-tab>
                    <md-tab label = "Images">
                        <image-select></image-select>
                    </md-tab>
                </md-tab-group>
            </md-sidenav>       
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
            height: 95%;
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

export class NewTemplateComponent implements OnInit {

    @Input()
    template: Template;
    displaySelectWindow: boolean;
    
    
    constructor(
        private templateStore: TemplateStore,
        public dialog: MdDialog,
        private undoService: UndoRedoService,
        private pageService: PageService,
        private pageFactory: PageFactory,
        private templateCommands: TemplateCommands,
        private snackBar: MdSnackBar
    ){ }
    
    ngOnInit(){
    }
    
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

    onClickAddAbove(page: Page){
        this.templateCommands.addPageAbove(this.template,page,this.pageFactory)
    }

    onClickAddBelow(page: Page){
        this.templateCommands.addPageBelow(this.template,page,this.pageFactory)
    }

    onClickDelete(page: Page){
        this.templateCommands.deletePage(this.template,page)
    }
   
    undo(){
        this.undoService.undo()
    }
}