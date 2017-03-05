import { Component, OnInit, Input, ViewChildren, QueryList} from '@angular/core';
import { MdDialog } from '@angular/material'
import { Template} from './template';
import { Page} from '../page/page';
import { ElementSelector } from '../element/element-selector';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { ImageSelector } from '../image/image-selector';
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'
import { SaveTemplateModal } from './save-template.modal'
import { UndoRedoService } from '../undo-redo.service'

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
                <element-select></element-select>
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
                    <md-tab label = "Pages">
                        <button md-raised-button (click)="createNewPage()">Add page</button>
                        <br> TO-DO: Different page types here
                    </md-tab>
                </md-tab-group>
            </md-sidenav>       
            <div class="pages">
            <create-new-page *ngFor="let page of template.pages" [page]="page"></create-new-page>
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
    `]
})

export class NewTemplateComponent implements OnInit {

    @Input()
    template: Template;
    displaySelectWindow: boolean;
    
    
    constructor(
        private templateService: TemplateInstanceStore,
        private imageSelector: ImageSelector,
        public dialog: MdDialog,
        private undoService: UndoRedoService
    ){ }
    
    ngOnInit(){
        this.imageSelector.selectorWindowOpened.subscribe(opened => this.displaySelectWindow = opened);
    }
    
    saveTemplate() {
        let dialogRef = this.dialog.open(SaveTemplateModal, {
          height: 'auto',
          width: '30%',
        });
        dialogRef.afterClosed().subscribe(value => 
            {
                if(value == 'save'){
                    this.templateService.saveTemplate()
                }
            }
        )
        dialogRef.componentInstance.template = this.template
    }
 
    createNewPage() {
        if (this.template.pages == null) {
            this.template.pages = new Array<Page>();
        }
        let page = new Page()
        page.elements = new Array
        this.template.pages.push(page);
    }

   
    undo(){
        this.undoService.undo()
    }

}