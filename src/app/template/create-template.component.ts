import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from './template';
import { UndoRedoService } from '../undo-redo.service'
import { TableElementCommands } from '../element/table-element'
import { TextContentCommands } from '../content/text-content'
import { ImageContentCommands } from '../content/image-content'
import { ElementCommands } from '../element/element'
import { PageCommands } from '../page/page'
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
    providers: [UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands, ElementStore, PageStore]
})

export class TemplateCreateComponent implements AfterViewInit, OnInit  {
    
    errorMessage: string;
    template : Template;

    constructor(
        private templateStore: TemplateStore, private pageStore: PageStore, private undoRedoService: UndoRedoService, private route: ActivatedRoute, private factory: PageFactory
    ){ }

    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    
    ngOnInit(){
        this.templateStore.cleanStore();
        this.templateStore.template.first().subscribe( template => {
            this.template = template
        })
        this.route.params.subscribe(params=>{
            let width = +params['width']
            let height = +params['height']
            if(width && height && width > 100 && width < 2000 && height > 100 && height < 2000){
                this.factory.setWidth(width).setHeight(height)                
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