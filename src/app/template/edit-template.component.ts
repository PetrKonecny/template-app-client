import { Component, OnInit, HostListener, ChangeDetectionStrategy, Input} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template } from './template';
import {ActivatedRoute} from '@angular/router';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { TemplateStore } from '../template/template.store'
import { PageStore } from '../page/page.store'
import { ElementStore } from '../element/element.store'
import { TemplateService } from '../template/template.service'
import { MdSnackBar } from '@angular/material';
import { PageFactory }from '../page/page.factory'
import { Store } from "@ngrx/store";
import { AppState } from '../app.state'

@Component({
    selector: 'template-edit',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="!template && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template *ngIf="template" [template] = "template" ></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ElementStore, PageStore]
    ,
})


//index page for opening already created templates containing the editor component
export class TemplateEditComponent implements OnInit  {
    
    //error thrown when loading the template
    error: string;
    //template to be displayed
    @Input()
    template : Template;

    /**
    @param route - injects route to get route params
    @param templateStore - injects store containing current template
    @param pageStore - injects store containing currently selected page
    @param undoRedoService - injects undo redo ervice
    @param snackBar - injects service to dispaly snackbar with error
    @param factory - injects factory to build pages with right dimensions
    */
    constructor(
        private route: ActivatedRoute,
        private templateStore: TemplateStore,
        private pageStore: PageStore,
        private undoRedoService: UndoRedoService,
        private templateService: TemplateService,
        private snackBar: MdSnackBar,
        private factory: PageFactory,
        private store: Store<AppState>
    ){ 
    }
    
    
    //loads template from the store with the right id
    ngOnInit(){
        /*
        this.templateStore.cleanStore()

        this.templateStore.template
        .first(template => template.id > 0)
        .subscribe(template => {
            this.template = template
            if(this.template.pages && this.template.pages[0]){
                 this.pageStore.selectPage(this.template.pages[0])
                 this.factory.setHeight(this.template.pages[0].height).setWidth(this.template.pages[0].width)
            }
        })*/

        this.store.select('templates').first(data => data.selected > 0).subscribe(data => {
            this.template = data.templates[data.selected]
        })

       this.route.params
        .do(params=>this.store.dispatch({type: "REQUEST_TEMPLATE", id: params['id']}))
        .subscribe()
   }
}