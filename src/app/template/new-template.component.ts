import { Component, OnInit, Input, ViewChildren, QueryList} from '@angular/core';
import { Template} from './template';
import { Page} from '../page/page';
import { ElementSelector } from '../element/element-selector';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { ImageSelector } from '../image/image-selector';
import { StepSelector } from '../step-selector'
import {PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'

@Component({
    selector: 'create-new-template',
    template: `
        <h2>Template creator</h2>\n\
        <image-select *ngIf="displaySelectWindow"></image-select>
        <div class="leftPanel">
            <label>name: </label>
            <input [(ngModel)]="template.name" placeholder="name"/><br>
            <button (click)="createNewPage()">Add page</button>
            <button (click)="saveTemplate()">Save</button>
            <button (click)="undo()">Undo</button>\n\
            <page-select></page-select>
            <element-select></element-select>
            <ruler-select></ruler-select>
        </div>       
        <div class="pages">
        <create-new-page *ngFor="let page of template.pages" [page]="page"></create-new-page>
        </div>
    `,
    providers: [ElementSelector, ImageSelector, StepSelector, PageSelector, RulerSelector],
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
            margin-left: 300px;
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
        private stepSelector: StepSelector
    ){ }
    
    ngOnInit(){
        this.imageSelector.selectorWindowOpened.subscribe(opened => this.displaySelectWindow = opened);
    }
    
    saveTemplate() {
        this.templateService.saveTemplate();
    }
    
    createNewPage() {
        if (this.template.pages == null) {
            this.template.pages = new Array<Page>();
        }
        this.template.pages.push(new Page());
    }
    
    undo(){
        this.stepSelector.undo()
    }

}