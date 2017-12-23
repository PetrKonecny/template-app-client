import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template } from './template';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import {ActivatedRoute} from '@angular/router';
import {PageFactory} from '../page/page.factory'
import { TemplateStore } from '../template/template.store'
import { TemplateHelper} from '../template/template.helper'
import { PageStore } from '../page/page.store'
import { ElementStore } from '../element/element.store'

@Component({
    selector: 'template-create',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ElementStore, PageStore]
})

//index page for creating new template containing the editor component
export class TemplateCreateComponent implements AfterViewInit, OnInit  {
    
    template : Template;

    constructor(
        private templateStore: TemplateStore, 
        private pageStore: PageStore, 
        private undoRedoService: UndoRedoService, 
        private route: ActivatedRoute, 
        private factory: PageFactory
    ){ }

    //saves buffer commands if the mouse up event happens
    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    //processes url parameters for creating setting up the editor
    ngOnInit(){
        this.templateStore.cleanStore();
        this.templateStore.template.first().subscribe( template => {
            this.template = template
        })
        this.route.params.subscribe(params=>{
            let width = +params['width']
            let height = +params['height']
            let margin = +params['margin']
            this.template.type = params['type']
            if(width && height && width > 100 && width < 2000 && height > 100 && height < 2000 && margin >= 0){
                this.factory.setWidth(width).setHeight(height).setMargin(margin)                
            }
            if(!this.template.pages || this.template.pages.length < 1){
                    this.template.pages = []
                    this.template.pages.push(this.factory.build())
            }
        })

    }

    ngAfterViewInit(){
        //this.pageStore.selectPage(this.template.pages[0])
    }
}