import { Component, OnInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from './template';
import {ActivatedRoute} from '@angular/router';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'
import { TemplateStore } from '../template/template.store'
import { PageStore } from '../page/page.store'
import { ElementStore } from '../element/element.store'
import { TemplateService } from '../template/template.service'
import { MdSnackBar } from '@angular/material';
import { PageFactory }from '../page/page.factory'

@Component({
    selector: 'template-edit',
    template: `
        <div class="shutter">
          <md-spinner *ngIf="!template && !error"></md-spinner>
          <md-icon class="shutter" style="font-size: 96px; opacity: 0.1;" *ngIf="error">error</md-icon>
        </div>
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands, ElementStore, PageStore]
})

export class TemplateEditComponent implements OnInit  {
    
    error: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private templateStore: TemplateStore,
        private pageStore: PageStore,
        private undoRedoService: UndoRedoService,
        private templateService: TemplateService,
        private snackBar: MdSnackBar,
        private factory: PageFactory
    ){ }
    
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    ngOnInit(){
        this.templateStore.cleanStore()
        this.route.params.flatMap(
           (params)=>this.templateService.getTemplate(params['id'])
       )
       .first(template => template.id > 0)
       .subscribe(
         template => {
             this.template = template
             if(this.template.pages && this.template.pages[0]){
                 this.pageStore.selectPage(this.template.pages[0])
                 this.factory.setHeight(this.template.pages[0].height).setWidth(this.template.pages[0].width)

             }
             this.templateStore.loadTemplate(template)
          },
          error => {
            this.error = error
            this.snackBar.open("Chyba při načítání šablony",null,{duration: 1500})
          }
        )

   }
}