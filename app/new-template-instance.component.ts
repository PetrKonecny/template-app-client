import { Component, OnInit, Input, ViewChildren, ContentChildren, QueryList} from '@angular/core';
import { TemplateInstance} from './template-instance';
import { Template} from './template';
import { Page} from './page';
import { DisplayPageComponent } from './display-page.component';
import { DisplayContentComponent } from './display-content.component';
import { TemplateInstanceService } from './template-instance.service';
import { TemplateInstanceStore } from './template-instance.store';
import { ImageSelectorComponent } from './image-selector.component';
import { ImageSelector } from './image-selector';
import {  Router} from '@angular/router'

@Component({
    selector: 'create-new-template-instance',
    template:
       `<image-select *ngIf="displaySelectWindow"></image-select>
        <div>
            <h2>Template</h2>
            <div>
                <label>name: </label>
                <input [(ngModel)]="templateInstance.name" placeholder="name"/>
            </div>
            <button (click)="saveTemplateInstance()">Save</button>
            <button (click)="openAsTemplate()">Open as new template</button>
            <div *ngIf="template">
                <display-page *ngFor="let page of template.pages" [page]="page"></display-page>
            </div>
        </div>
    `,
    providers: [ImageSelector]
})

export class NewTemplateInstanceComponent implements OnInit {
    
    displaySelectWindow: boolean;
    @Input()
    templateInstance: TemplateInstance;
    @Input()
    template: Template;
    @ViewChildren(DisplayPageComponent)
    contentComponents : QueryList<DisplayPageComponent>;
    
    constructor(
        private templateInstanceStore: TemplateInstanceStore,
        private imageSelector: ImageSelector,
        private router: Router
    ){ 
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
   
