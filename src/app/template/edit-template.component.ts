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

@Component({
    selector: 'template-edit',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands, ElementStore, PageStore]
})

export class TemplateEditComponent implements OnInit  {
    
    errorMessage: string;
    template : Template;
    private sub: any;


    constructor(
        private route: ActivatedRoute,
        private templateStore: TemplateStore,
        private pageStore: PageStore,
        private undoRedoService: UndoRedoService 
    ){ }
    
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    ngOnInit(){
        this.route.params.map(params=>{
            this.templateStore.cleanStore()
            this.templateStore.getTemplate(params['id'])
       })
       .flatMap(
           ()=>this.templateStore.template
       )
       .first(template => template.id > 0)
       .subscribe(template => {
           this.template = template
           if(this.template.pages && this.template.pages[0]){
               this.pageStore.selectPage(this.template.pages[0])
           }
        })
   }
}