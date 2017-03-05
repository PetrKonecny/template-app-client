import { Component, OnInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template} from './template';
import {ActivatedRoute} from '@angular/router';
import { ElementSelector } from '../element/element-selector';
import { ImageSelector } from '../image/image-selector';
import { PageSelector} from '../page/page-selector'
import { RulerSelector } from '../guide/ruler-selector'
import { TextSelector } from '../editor/text-selector'
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, PageSelector, RulerSelector, TextSelector, UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands]
})

export class TemplateEditComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private templateService: TemplateInstanceStore,
        private pageSelector: PageSelector,
        private undoRedoService: UndoRedoService 
    ){ }
    
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    ngOnInit(){
        this.route.params.map(params=>{
            this.templateService.cleanStore()
            this.templateService.getTemplate(params['id'])
       })
       .flatMap(
           ()=>this.templateService.template
       )
       .first(template => template.id > 0)
       .subscribe(template => {
           this.template = template
           this.templateService.createContentsForTemplate();
           if(this.template.pages && this.template.pages[0]){
               this.pageSelector.selectPage(this.template.pages[0])
           }
        })
   }
}