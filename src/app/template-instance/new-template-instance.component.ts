import { Component, OnInit, Input } from '@angular/core'
import { TemplateInstance} from './template-instance'
import { Template} from '../template/template'
import { TemplateInstanceStore } from './template-instance.store'
import { ImageSelector } from '../image/image-selector'
import {  Router} from '@angular/router'
import { TextSelector } from '../editor/text-selector'
import {TextContent} from '../content/text-content'
import { Element } from '../element/element'
import { TemplateHelper} from '../template/template.helper'
import { TemplateStore } from '../template/template.store'
import { ElementStore } from '../element/element.store'
import { PageStore } from '../page/page.store'

@Component({
    selector: 'create-new-template-instance',
    template:
       `
        <md-sidenav-container style="height: 100%;">
            <md-toolbar>
                <button md-icon-button *ngIf="!sidenav.opened" (click)="sidenav.toggle()"><md-icon>add</md-icon></button>
                <button md-icon-button *ngIf="sidenav.opened" (click)="sidenav.toggle()"><md-icon>close</md-icon></button>
                <button md-icon-button (click)="saveTemplateInstance()"><md-icon>save</md-icon></button>
                <button md-icon-button (click)="undo()"><md-icon>undo</md-icon></button>
                <button md-icon-button><md-icon>redo</md-icon></button>
                <button md-button (click)="openAsTemplate()">Open as new template</button>
                <text-select *ngIf="element && element.type == 'text_element' && element.content.editor"></text-select>
            </md-toolbar>
            <md-sidenav mode ="side" #sidenav style="width: 20%;">
                <image-select></image-select>                 
            </md-sidenav>       
            <div class="pages" *ngIf="template">
                <display-page *ngFor="let page of template.pages" [page]="page"></display-page>
            </div>
        </md-sidenav-container>
    `,
    providers: [ElementStore, PageStore],
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
        }
    `]
})

export class NewTemplateInstanceComponent {
    
    displaySelectWindow: boolean;
    @Input()
    templateInstance: TemplateInstance;
    @Input()
    template: Template;

    element: Element
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore,
        private elementStore: ElementStore,
        private router: Router,
        private templateStore: TemplateStore
    ){ 
        
        this.elementStore.element.subscribe(element=> {
            this.element = element
        })
    }
      
    saveTemplateInstance() {
        this.templateInstanceStore.saveTemplateInstance();
    }
    
    openAsTemplate(){
        TemplateHelper.removeIdsFromTemplate(this.template)
        this.templateStore.ignoreNextClean();
        this.router.navigate(['/templates','new'])
    }
}
   
