import { Component, OnInit, Input } from '@angular/core';
import { TemplateInstance} from './template-instance';
import { Template} from '../template/template';
import { TemplateInstanceStore } from './template-instance.store';
import { ImageSelector } from '../image/image-selector';
import {  Router} from '@angular/router'
import { TextSelector } from '../editor/text-selector'
import { ElementSelector } from '../element/element-selector';
import {TextContent} from '../content/text-content'
import { Element } from '../element/element';

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
    providers: [ImageSelector, TextSelector, ElementSelector],
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

export class NewTemplateInstanceComponent implements OnInit {
    
    displaySelectWindow: boolean;
    @Input()
    templateInstance: TemplateInstance;
    @Input()
    template: Template;

    element: Element
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore,
        private imageSelector: ImageSelector,
        private router: Router,
        private elementSelector: ElementSelector,
        private textSelector: TextSelector
    ){ 
        
        this.elementSelector.element.subscribe(element=> {
            this.element = element
            if(this.element && this.element.content && this.element.content.type == 'text_content' && (<TextContent>this.element.content).editor){
                this.textSelector.changeEditor((<TextContent>this.element.content).editor)
            }
        })
    }
    
    ngOnInit(){
        this.imageSelector.selectorWindowOpened.subscribe(opened => this.displaySelectWindow = opened);
    }
      
    saveTemplateInstance() {
        this.templateInstanceStore.saveTemplateInstance();
    }
    
    openAsTemplate(){
        this.templateInstanceStore.removeIdFromTemplate()
        this.templateInstanceStore.ignoreNextClean();
        this.router.navigate(['/templates','new'])
    }
}
   
