import { Component, OnInit, AfterViewInit, HostListener} from '@angular/core';
import { TemplateInstanceStore } from '../template-instance/template-instance.store';
import { Template, TemplateCommands} from './template';
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
import {ActivatedRoute} from '@angular/router';
import {PageFactory} from '../page/page.factory'

@Component({
    selector: 'template-create',
    template: `
        <create-new-template *ngIf="template" [template] = template></create-new-template>
    `,
    providers: [ElementSelector, ImageSelector, PageSelector, RulerSelector, TextSelector, UndoRedoService, TableElementCommands, TextContentCommands, ImageContentCommands, ElementCommands, PageCommands, TemplateCommands]
})

export class TemplateCreateComponent implements AfterViewInit, OnInit  {
    
    errorMessage: string;
    template : Template;

    constructor(
        private templateService: TemplateInstanceStore, private pageSelector: PageSelector, private undoRedoService: UndoRedoService, private route: ActivatedRoute, private factory: PageFactory
    ){ }

    @HostListener('document:mouseup', ['$event'])
    onMouseup(event) {
       this.undoRedoService.saveBuffer()
    }
    
    
    ngOnInit(){
        this.templateService.cleanStore();
        this.templateService.template.first().subscribe( template => {
            this.template = template
            this.templateService.createContentsForTemplate()
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
        this.pageSelector.selectPage(this.template.pages[0])
    }
}